import { useState, useEffect } from 'react'
import { Folder, FileText, ChevronRight, ChevronDown, BookOpen, RefreshCw, Search } from 'lucide-react'

export default function KnowledgeView() {
  const [files, setFiles] = useState([])
  const [tree, setTree] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { loadFiles() }, [])

  async function loadFiles() {
    setLoading(true)
    try {
      const isElectron = typeof window !== 'undefined' && window.api !== undefined
      if (isElectron) {
        const result = await window.api.listKnowledge()
        if (result?.ok) {
          setFiles(result.files)
          setTree(buildTree(result.files))
        }
      } else {
        // Browser fallback — show structure info
        setTree(buildDemoTree())
      }
    } catch (err) {
      console.error('Knowledge load error:', err)
    } finally {
      setLoading(false)
    }
  }

  function buildTree(filePaths) {
    const root = { name: 'Kahn', children: {}, files: [] }
    filePaths.forEach(fp => {
      const parts = fp.split('/')
      let node = root
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node.children[parts[i]]) {
          node.children[parts[i]] = { name: parts[i], children: {}, files: [] }
        }
        node = node.children[parts[i]]
      }
      node.files.push({ name: parts[parts.length - 1], path: fp })
    })
    return root
  }

  function buildDemoTree() {
    const dirs = ['00_SYSTEM', 'AI', 'HEALTH', 'LEGAL', 'LIFE', 'PITCHBLACK', 'SESSIONS']
    const root = { name: 'Kahn', children: {}, files: [{ name: 'INDEX.md', path: 'INDEX.md' }, { name: 'README.md', path: 'README.md' }] }
    dirs.forEach(d => {
      root.children[d] = { name: d, children: {}, files: [{ name: '(load in Electron to browse)', path: null }] }
    })
    return root
  }

  function toggleExpand(path) {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }))
  }

  async function readFile(filePath) {
    if (!filePath) return
    setSelectedFile(filePath)
    try {
      const isElectron = typeof window !== 'undefined' && window.api !== undefined
      if (isElectron) {
        const result = await window.api.readKnowledge(filePath)
        setFileContent(result?.ok ? result.content : 'Error loading file.')
      } else {
        setFileContent('File reading requires Electron. Run the app with: npm run dev')
      }
    } catch (err) {
      setFileContent('Error: ' + err.message)
    }
  }

  function filterTree(node, term, path = '') {
    if (!term) return node
    const lowerTerm = term.toLowerCase()
    const filteredFiles = node.files.filter(f => f.name.toLowerCase().includes(lowerTerm))
    const filteredChildren = {}
    Object.entries(node.children).forEach(([key, child]) => {
      const filtered = filterTree(child, term, path ? `${path}/${key}` : key)
      if (filtered.files.length > 0 || Object.keys(filtered.children).length > 0 || child.name.toLowerCase().includes(lowerTerm)) {
        filteredChildren[key] = filtered
      }
    })
    return { ...node, children: filteredChildren, files: filteredFiles }
  }

  function renderNode(node, path = '', depth = 0) {
    const isExpanded = expanded[path] !== false
    const childKeys = Object.keys(node.children).sort()
    const hasContent = childKeys.length > 0 || node.files.length > 0

    return (
      <div key={path || 'root'} className="knowledge-node">
        {depth > 0 && (
          <div
            className={`knowledge-dir${isExpanded ? ' expanded' : ''}`}
            style={{ paddingLeft: depth * 16 }}
            onClick={() => toggleExpand(path)}
          >
            {hasContent ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span style={{ width: 14 }} />}
            <Folder size={14} />
            <span className="knowledge-dir-name">{node.name}</span>
            <span className="knowledge-dir-count">
              {node.files.length + childKeys.length}
            </span>
          </div>
        )}
        {(depth === 0 || isExpanded) && (
          <>
            {childKeys.map(key => renderNode(node.children[key], path ? `${path}/${key}` : key, depth + 1))}
            {node.files.map(f => (
              <div
                key={f.path || f.name}
                className={`knowledge-file${selectedFile === f.path ? ' selected' : ''}`}
                style={{ paddingLeft: (depth + 1) * 16 }}
                onClick={() => readFile(f.path)}
              >
                <FileText size={13} />
                <span>{f.name}</span>
              </div>
            ))}
          </>
        )}
      </div>
    )
  }

  if (loading) return <div className="narration-loading">Loading knowledge system...</div>

  const displayTree = searchTerm ? filterTree(tree, searchTerm) : tree

  return (
    <div className="knowledge-view">
      <div className="knowledge-sidebar">
        <div className="knowledge-sidebar-head">
          <BookOpen size={16} />
          <span>Knowledge System</span>
          <button className="knowledge-refresh" onClick={loadFiles}><RefreshCw size={14} /></button>
        </div>
        <div className="knowledge-search">
          <Search size={13} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="knowledge-tree">
          {displayTree && renderNode(displayTree)}
        </div>
      </div>
      <div className="knowledge-content">
        {selectedFile ? (
          <>
            <div className="knowledge-content-head">
              <FileText size={14} />
              <span>{selectedFile}</span>
            </div>
            <pre className="knowledge-content-body">{fileContent}</pre>
          </>
        ) : (
          <div className="knowledge-content-empty">
            <BookOpen size={32} />
            <div>Select a file to view</div>
            <div className="knowledge-content-hint">
              Knowledge base at C:\Kahn\ — {files.length} files across {Object.keys(tree?.children || {}).length} directories
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
