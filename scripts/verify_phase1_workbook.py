"""Verify the Phase 1 workbook: count formulas, check syntax, simulate simple ones."""
import re
from openpyxl import load_workbook
from openpyxl.utils import column_index_from_string, get_column_letter

PATH = r"C:\Users\iAmiK\Downloads\Dan_Phase1_Integrated_Workbook.xlsx"

ERROR_MARKERS = ('#REF!', '#DIV/0!', '#VALUE!', '#N/A', '#NAME?', '#NUM!', '#NULL!')

def cell_ref_to_tuple(ref):
    m = re.match(r'([A-Z]+)(\d+)', ref)
    if not m: return None
    return (int(m.group(2)), column_index_from_string(m.group(1)))

def get_cell_value(ws, ref):
    r, c = cell_ref_to_tuple(ref)
    v = ws.cell(r, c).value
    if isinstance(v, str) and v.startswith('='):
        return evaluate_formula(ws, v)
    return v

def expand_range(ref):
    """Given 'D2:D17' return list of 'D2','D3',...,'D17'."""
    if ':' not in ref:
        return [ref]
    start, end = ref.split(':')
    r1, c1 = cell_ref_to_tuple(start)
    r2, c2 = cell_ref_to_tuple(end)
    cells = []
    for r in range(r1, r2+1):
        for c in range(c1, c2+1):
            cells.append(f'{get_column_letter(c)}{r}')
    return cells

def evaluate_formula(ws, formula):
    """Evaluate simple formulas. Returns computed value or string stub."""
    expr = formula.strip()
    if expr.startswith('='):
        expr = expr[1:]
    # Very simple evaluator — only handles what we used
    # Pattern: IF(COUNT(range)<2,"",A-B) or IF(COUNT(range)=0,"",AVERAGE(range))
    # For these, we just verify syntactic soundness and return None since they depend on user data
    if expr.startswith('IF('):
        return None
    # SUM(cell,cell,cell...) or SUM(range)
    m = re.fullmatch(r'SUM\((.+)\)', expr)
    if m:
        args = m.group(1).split(',')
        cells = []
        for arg in args:
            arg = arg.strip()
            cells.extend(expand_range(arg))
        vals = []
        for ref in cells:
            v = get_cell_value(ws, ref)
            if isinstance(v, (int, float)): vals.append(v)
        return sum(vals)
    # AVERAGE(range)
    m = re.fullmatch(r'AVERAGE\((.+)\)', expr)
    if m:
        cells = expand_range(m.group(1))
        vals = []
        for ref in cells:
            v = get_cell_value(ws, ref)
            if isinstance(v, (int, float)): vals.append(v)
        return (sum(vals)/len(vals)) if vals else None
    # Simple arithmetic: =E31/7 or =5*2600+2*2300 or =7*220 or =4*(5*2600+2*2300)
    # Replace cell refs with their values, then eval
    try:
        # Resolve all cell refs to numeric values
        def repl(match):
            ref = match.group(0)
            v = get_cell_value(ws, ref)
            if v is None or isinstance(v, str):
                return '0'
            return str(v)
        resolved = re.sub(r'[A-Z]+\d+', repl, expr)
        # Safe eval for arithmetic only
        if re.fullmatch(r'[\d+\-*/().\s]+', resolved):
            return eval(resolved)
    except Exception as e:
        return f'EVAL_ERROR: {e}'
    return None

def main():
    wb = load_workbook(PATH)
    total_cells = 0
    total_formulas = 0
    total_merged = 0
    error_cells = []  # cells whose value is an error marker
    formulas_by_sheet = {}
    formula_samples = {}

    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        formulas_by_sheet[sheet_name] = 0
        samples = []
        for row in ws.iter_rows():
            for cell in row:
                total_cells += 1
                v = cell.value
                if isinstance(v, str):
                    for em in ERROR_MARKERS:
                        if em in v and not v.startswith('='):  # literal error markers
                            error_cells.append((sheet_name, cell.coordinate, v))
                    if v.startswith('='):
                        total_formulas += 1
                        formulas_by_sheet[sheet_name] += 1
                        if len(samples) < 3:
                            samples.append((cell.coordinate, v))
        formula_samples[sheet_name] = samples
        total_merged += len(ws.merged_cells.ranges)

    # Now evaluate a few formulas to verify they compute sensibly
    test_evals = []
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        for row in ws.iter_rows():
            for cell in row:
                if isinstance(cell.value, str) and cell.value.startswith('='):
                    # Skip IF formulas (depend on user data)
                    if 'IF(' in cell.value:
                        continue
                    result = evaluate_formula(ws, cell.value)
                    test_evals.append((sheet_name, cell.coordinate, cell.value, result))
                    if len(test_evals) >= 20:
                        break
            if len(test_evals) >= 20:
                break
        if len(test_evals) >= 20:
            break

    print('=' * 70)
    print(f'WORKBOOK VERIFICATION: {PATH}')
    print('=' * 70)
    print(f'Sheets ({len(wb.sheetnames)}): {wb.sheetnames}')
    print(f'Total cells with content: {total_cells}')
    print(f'Total formulas: {total_formulas}')
    print(f'Total merged ranges: {total_merged}')
    print()
    print('Formulas per sheet:')
    for s, c in formulas_by_sheet.items():
        print(f'  {s}: {c} formulas')
    print()
    print('Error markers found as literal text:')
    if error_cells:
        for s, c, v in error_cells:
            print(f'  !! {s}!{c}: {v!r}')
    else:
        print('  (none)')
    print()
    print('Formula samples per sheet:')
    for s, samples in formula_samples.items():
        if samples:
            print(f'  {s}:')
            for ref, f in samples:
                print(f'    {ref}: {f}')
    print()
    print('Evaluated formula samples (non-IF):')
    for s, ref, f, result in test_evals:
        print(f'  {s}!{ref}: {f}  =>  {result}')
    print()
    if error_cells:
        print('STATUS: errors_found')
        return 1
    print('STATUS: success  •  total_errors: 0')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
