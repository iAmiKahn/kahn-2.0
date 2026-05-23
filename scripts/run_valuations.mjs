import { calculateValuation, analyzeDataGaps } from '../src/utils/valuationEngine.js';
import fs from 'fs';

const now = new Date().toISOString();

// ─── MARKET CONTEXT — Lake in the Hills 60156 ────────────────────────────
const lithMarket = {
  condition: 'seller',
  monthlyAppreciation: 0.004,
  listToSaleRatio: 1.015,
  avgDom: 14,
  notes: 'Active seller market. Meadowbrook median $418K in 2025, up from $390K 2024. DOM ~12-17 days. Homes frequently selling above list.'
};

// ─── MARKET CONTEXT — Ingleside 60041 ───────────────────────────────────
const ingleMarket = {
  condition: 'balanced',
  monthlyAppreciation: 0.003,
  listToSaleRatio: 1.0,
  avgDom: 25,
  notes: 'Ingleside/Long Lake area. Mixed market. Non-waterfront cottages balanced. Wide price range $180K-$580K depending on water access.'
};

// ═══════════════════════════════════════════════════════════════════════════
// 1. 2621 CROFTON CIRCLE
// ═══════════════════════════════════════════════════════════════════════════
const croftonSubject = {
  address: '2621 Crofton Circle, Lake in the Hills, IL 60156',
  propertyType: 'sfr', sqft: 2230, beds: 4,
  bathsFull: 3, bathsHalf: 1, garageSpaces: 2,
  basementFinishedSqft: 500, yearBuilt: 1995,
  condition: 'average', pool: true, deck: true, improvements: []
};

const croftonComps = [
  {
    address: '5420 Avalon Ln, Lake in the Hills, IL 60156',
    salePrice: 365000, saleDate: '2025-02-15', sqft: 1556,
    bathsFull: 2, bathsHalf: 0, garageSpaces: 2, condition: 'good',
    basementFinishedSqft: 300, distanceMiles: 0.6
  },
  {
    address: '4781 Highwood Ln, Lake in the Hills, IL 60156',
    salePrice: 405000, saleDate: '2025-01-20', sqft: 1804,
    bathsFull: 2, bathsHalf: 1, garageSpaces: 2, condition: 'good',
    basementFinishedSqft: 400, distanceMiles: 0.8
  },
  {
    address: '4811 Princeton Ln, Lake in the Hills, IL 60156',
    salePrice: 425000, saleDate: '2025-01-10', sqft: 3021,
    bathsFull: 2, bathsHalf: 1, garageSpaces: 3, condition: 'good',
    basementFinishedSqft: 600, distanceMiles: 0.7
  }
];

const croftonResult = calculateValuation(croftonSubject, croftonComps, lithMarket);
const croftonGaps   = analyzeDataGaps(croftonSubject, croftonComps, lithMarket);

// ═══════════════════════════════════════════════════════════════════════════
// 2. 2304 DAYBREAK DRIVE
// ═══════════════════════════════════════════════════════════════════════════
const daybreakSubject = {
  address: '2304 Daybreak Drive, Lake in the Hills, IL 60156',
  propertyType: 'sfr', sqft: 2448, beds: 3,
  bathsFull: 2, bathsHalf: 1, garageSpaces: 2,
  basementFinishedSqft: 0, yearBuilt: 1998,
  condition: 'average', pool: false, deck: false, improvements: []
};

const daybreakComps = [
  {
    address: '4781 Highwood Ln, Lake in the Hills, IL 60156',
    salePrice: 405000, saleDate: '2025-01-20', sqft: 1804,
    bathsFull: 2, bathsHalf: 1, garageSpaces: 2, condition: 'good',
    basementFinishedSqft: 400, distanceMiles: 1.1
  },
  {
    address: '5420 Avalon Ln, Lake in the Hills, IL 60156',
    salePrice: 365000, saleDate: '2025-02-15', sqft: 1556,
    bathsFull: 2, bathsHalf: 0, garageSpaces: 2, condition: 'good',
    basementFinishedSqft: 300, distanceMiles: 1.3
  },
  {
    address: '9 Danbury Ct, Lake in the Hills, IL 60156',
    salePrice: 379000, saleDate: '2025-02-01', sqft: 1950,
    bathsFull: 2, bathsHalf: 1, garageSpaces: 2, condition: 'average',
    basementFinishedSqft: 0, distanceMiles: 0.9
  }
];

const daybreakResult = calculateValuation(daybreakSubject, daybreakComps, lithMarket);
const daybreakGaps   = analyzeDataGaps(daybreakSubject, daybreakComps, lithMarket);

// ═══════════════════════════════════════════════════════════════════════════
// 3. 35656 N LOUISE PLACE, INGLESIDE
// ═══════════════════════════════════════════════════════════════════════════
const louiseSubject = {
  address: '35656 N Louise Place, Ingleside, IL 60041',
  propertyType: 'sfr', sqft: 700, beds: 2,
  bathsFull: 1, bathsHalf: 0, garageSpaces: 0,
  basementFinishedSqft: 0, yearBuilt: null,
  condition: 'average', pool: false, deck: false, improvements: []
};

const louiseComps = [
  {
    address: '35678 N Louise Pl, Ingleside, IL 60041',
    salePrice: 180000, saleDate: '2021-02-09', sqft: 700,
    bathsFull: 1, bathsHalf: 0, garageSpaces: 0, condition: 'average',
    basementFinishedSqft: 0, distanceMiles: 0.05
  },
  {
    address: '25622 W Grant Ave, Ingleside, IL 60041',
    salePrice: 235000, saleDate: '2024-11-26', sqft: 1147,
    bathsFull: 1, bathsHalf: 0, garageSpaces: 1, condition: 'average',
    basementFinishedSqft: 0, distanceMiles: 0.9
  },
  {
    address: '34928 N Bergen St, Ingleside, IL 60041',
    salePrice: 274900, saleDate: '2024-11-27', sqft: 1700,
    bathsFull: 2, bathsHalf: 1, garageSpaces: 2, condition: 'good',
    basementFinishedSqft: 0, distanceMiles: 1.2
  }
];

const louiseResult = calculateValuation(louiseSubject, louiseComps, ingleMarket);
const louiseGaps   = analyzeDataGaps(louiseSubject, louiseComps, ingleMarket);

// ─── RESULTS ───────────────────────────────────────────────────────────────
const results = [
  { label: '1. 2621 CROFTON CIRCLE, LITH', r: croftonResult,  g: croftonGaps  },
  { label: '2. 2304 DAYBREAK DRIVE, LITH',  r: daybreakResult, g: daybreakGaps },
  { label: '3. 35656 N LOUISE PLACE, ING',  r: louiseResult,   g: louiseGaps   },
];

results.forEach(({ label, r, g }) => {
  console.log('\n' + '='.repeat(50));
  console.log(label);
  console.log('='.repeat(50));
  console.log('Point Estimate : $' + (r.pointEstimate || 'N/A').toLocaleString());
  console.log('Range          : $' + (r.rangeLow || 0).toLocaleString() + ' — $' + (r.rangeHigh || 0).toLocaleString());
  console.log('Confidence     : ' + r.confidence.label + ' (' + r.confidence.score + '/100)');
  if (g.critical.length) console.log('CRITICAL GAPS  :', g.critical.map(x => x.field).join(', '));
  if (g.recommended.length) console.log('Recommended    :', g.recommended.map(x => x.field).join(', '));
});

// ─── WRITE DATA FILES ──────────────────────────────────────────────────────
const valuations = [
  { id: 'val_crofton_001',  prospectId: 'p_crofton_001',  propertyId: 'prop_crofton_001',
    requestedAt: now, subject: croftonSubject,  market: lithMarket,   comps: croftonComps,
    result: croftonResult,  gaps: croftonGaps,  actualSalePrice: null, actualSaleDate: null, variance: null },
  { id: 'val_daybreak_002', prospectId: 'p_daybreak_002', propertyId: 'prop_daybreak_002',
    requestedAt: now, subject: daybreakSubject, market: lithMarket,   comps: daybreakComps,
    result: daybreakResult, gaps: daybreakGaps, actualSalePrice: null, actualSaleDate: null, variance: null },
  { id: 'val_louise_003',   prospectId: 'p_louise_003',   propertyId: 'prop_louise_003',
    requestedAt: now, subject: louiseSubject,   market: ingleMarket,  comps: louiseComps,
    result: louiseResult,   gaps: louiseGaps,   actualSalePrice: null, actualSaleDate: null, variance: null },
];

fs.writeFileSync('C:/Kahn 2.0/data/valuations.json', JSON.stringify(valuations, null, 2));
console.log('\nAll 3 valuations saved to data/valuations.json');
