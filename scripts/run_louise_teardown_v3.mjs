/**
 * TEAR-DOWN VALUATION v3 — 35656 N Louise Place, Ingleside IL 60041
 * PIN: 0513114010
 *
 * DATA SOURCES USED:
 *   Lake County GIS / WABParcels MapServer — queried directly via ArcGIS REST API
 *   Both subject and comp pulled from official parcel records.
 *
 * METHODOLOGY: Land Residual + Demo Cost Deduction (tear-down standard)
 *
 * PRIOR VALUATION (v2) WAS MATERIALLY WRONG due to three bad assumptions:
 *   1. Comp (35678 N Louise Pl) assumed to be single lot — it is actually LOTS 10+11+12 (3 lots, 22,991 sqft)
 *   2. Comp structure assumed ~1940s — it was built 1990, 1,100 sqft, functional at sale
 *   3. Subject assumed 2 beds / 700 sqft — confirmed 1 bed / 816 sqft / built 1936
 *
 * WATER ACCESS: Definitively NO.
 *   LMWATER field = "No". Watershed = Manitou Creek (not Long Lake watershed).
 *   FEMA Zone X (entire parcel). No deeded easement or access in record.
 *   The $20K-$60K lake access upside flagged in v2 does NOT apply.
 */

import fs from 'fs';

const now = new Date().toISOString();

// ─── CONFIRMED SUBJECT DATA (from Lake County GIS parcel record) ─────────────
const subject = {
  pin: '0513114010',
  address: '35656 N Louise Pl, Ingleside, IL 60041',
  owner: 'Thomas Krueger',
  legal: 'Alexanders Subdn Lot 13',
  subdivision: 'Alexanders Subdivision',
  neighborhood: 'Alexanders/Mitchell Highlands',
  lotSqFt: 7501,
  lotAcres: 0.1722,
  livingAreaSqFt: 816,
  yearBuilt: 1936,
  bedrooms: 1,
  fullBaths: 1,
  condition: 'Average (uninhabitable)',
  zoning: 'R-3',
  municipality: 'Unincorporated Lake County',
  watershed: 'Manitou Creek-Fox River',
  lakeWaterAccess: false,      // LMWATER = "No"
  femaZone: 'X',               // Entire parcel — minimal flood risk
  assessedLand: 7488,          // Tax year assessed value
  assessedBldg: 29102,
  assessedTotal: 36590,
  structure: 'UNINHABITABLE — tear-down. Zero improvement value.',
};

// ─── CONFIRMED COMP DATA (from Lake County GIS parcel record) ────────────────
/**
 * 35678 N Louise Pl — PIN 0513114020
 *   Legal: Alexander's Subdn LOTS 10, 11 & 12  ← THREE LOTS COMBINED
 *   Lot size: 22,991 sqft (subject is 7,501 sqft — comp is 3.06x larger)
 *   Built: 1990. Living area: 1,100 sqft. 1 bath. Average condition.
 *   LMWATER: No. FEMA Zone X.
 *   Sale: $180,000 — Dec 9, 2020 (64 months ago as of Apr 2026)
 */
const comp = {
  pin: '0513114020',
  address: '35678 N Louise Pl, Ingleside, IL 60041',
  legal: "Alexander's Subdn Lots 10, 11 & 12",
  lotSqFt: 22991,
  livingAreaSqFt: 1100,
  yearBuilt: 1990,
  fullBaths: 1,
  condition: 'Average (functional at time of sale)',
  salePrice: 180000,
  saleDate: '2020-12-09',
  lakeWaterAccess: false,
};

// ─── STEP 1: STRIP IMPROVEMENT FROM COMP ────────────────────────────────────
/**
 * Comp had a 1990-built 1,100 sqft cottage — functional and occupiable at sale.
 * At time of sale (Dec 2020), structure was 30 years old.
 *
 * Improvement contribution estimate:
 *   Replacement cost: ~$100/sqft × 1,100 sqft = $110,000
 *   Physical depreciation: 35% (30-year-old structure, average condition)
 *   Depreciated cost: $110,000 × 0.65 = $71,500
 *   Market premium for functional occupancy: adds ~$5K-$10K above depreciated cost
 *   Estimate: $75,000 (midpoint of $65K-$85K supportable range)
 *
 * Cross-check: $180K - $75K = $105K for 22,991 sqft implies $4.57/sqft
 *   Comparable interior Ingleside cottage land without structure — plausible.
 */
const compImprovementContribution = 75000;
const compLandResidual = comp.salePrice - compImprovementContribution;
// $180,000 - $75,000 = $105,000 for 22,991 sqft

// ─── STEP 2: TIME-ADJUST COMP LAND VALUE ────────────────────────────────────
const monthlyAppreciation = 0.003; // 0.3%/mo — Ingleside balanced market
const compMonthsAgo = 64;          // Dec 2020 → Apr 2026
const timeAdjFactor = 1 + (monthlyAppreciation * compMonthsAgo);
const compLandResidualAdjusted = compLandResidual * timeAdjFactor;
// $105,000 × 1.192 = $125,160 for 22,991 sqft

// ─── STEP 3: DERIVE LAND VALUE PER SQFT ────────────────────────────────────
const landPerSqFt = compLandResidualAdjusted / comp.lotSqFt;
// $125,160 / 22,991 = $5.44/sqft

// ─── STEP 4: APPLY TO SUBJECT LOT ───────────────────────────────────────────
const subjectLandValue = Math.round(subject.lotSqFt * landPerSqFt);
// 7,501 × $5.44 = ~$40,800

// ─── CROSS-CHECK: TAX ASSESSMENT LAND VALUE ─────────────────────────────────
/**
 * IL residential assessed at 33.33% of market value.
 * Assessed land: $7,488 × 3 = $22,464 market indication.
 * Assessment may be 2-3 years stale. At 3.6% annual appreciation:
 * $22,464 × 1.13 (3 years) = $25,385
 *
 * The land-residual method produces $40,800 vs assessment-based $25,385.
 * Gap is significant. The assessment likely reflects the lot in isolation
 * (no improvement premium from neighboring use patterns).
 * Using weighted midpoint: ($40,800 × 0.6) + ($25,385 × 0.4) = $34,634
 * Rounded: $35,000
 *
 * This cross-check drives the final land value estimate toward $35,000.
 */
const assessmentBasedLand = Math.round(subject.assessedLand * 3 * 1.13);
const weightedLandEstimate = Math.round(subjectLandValue * 0.6 + assessmentBasedLand * 0.4);

// ─── STEP 5: DEMO COST DEDUCTION ────────────────────────────────────────────
/**
 * 816 sqft, 1936-built, probable asbestos (pre-1980 construction).
 * Lead paint virtually certain (pre-1978). Space heater heating system.
 * Demo cost range for this type:
 *   Low:  $10,000 (basic demo, asbestos testing only comes back negative)
 *   Mid:  $15,000 (probable: asbestos testing + limited abatement on pipe insulation/tile)
 *   High: $22,000 (worst case: significant asbestos abatement + lead paint disposal)
 */
const demoCostLow  = 10000;
const demoCostMid  = 15000;
const demoCostHigh = 22000;

const pointEstimate = Math.round((weightedLandEstimate - demoCostMid) / 500) * 500;
const rangeLow      = Math.round((weightedLandEstimate - demoCostHigh) / 500) * 500;
const rangeHigh     = Math.round((weightedLandEstimate - demoCostLow) / 500) * 500;

// ─── CONFIDENCE ASSESSMENT ──────────────────────────────────────────────────
const confidence = {
  score: 28,
  label: 'Low',
  color: 'red',
  reasons: [
    'Subject and comp data now confirmed from official Lake County GIS parcel records',
    'Water access definitively resolved — LMWATER=No, Manitou Creek watershed (not Long Lake)',
    'Tax assessment provides independent land value cross-check ($25K adjusted)',
  ],
  gaps: [
    'CRITICAL: Only 1 comp — and it required a massive lot-size adjustment (3 lots vs 1). This single adjustment dominates uncertainty.',
    'Improvement strip-out from comp ($75K) carries ±$15K uncertainty — drives $6K swing in land residual per sqft',
    'No direct single-lot land sales found in Alexanders/Mitchell Highlands area — no pure land comps',
    'Assessment-based cross-check ($25K) vs land-residual estimate ($41K) differ by $16K — weighted at 60/40',
    'Actual demo cost unknown — 1936 structure with space heater. Get contractor quote with asbestos testing included.',
    'Per-sqft land pricing may not hold in this micro-market — lot minimum value could be higher or lower',
  ]
};

// ─── PRINT RESULTS ──────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(62));
console.log('TEAR-DOWN VALUATION v3 — 35656 N LOUISE PLACE, INGLESIDE IL');
console.log('PIN: 0513114010  |  Data: Lake County GIS (confirmed)');
console.log('═'.repeat(62));

console.log('\nCONFIRMED SUBJECT DATA:');
console.log('  Lot: ' + subject.lotSqFt.toLocaleString() + ' sqft (' + subject.lotAcres + ' acres)');
console.log('  Structure: ' + subject.livingAreaSqFt + ' sqft, built ' + subject.yearBuilt + ', ' + subject.bedrooms + ' bed / ' + subject.fullBaths + ' bath');
console.log('  Legal: ' + subject.legal);
console.log('  Water access: NONE (LMWATER=No, watershed=Manitou Creek)');
console.log('  Zoning: R-3, Unincorporated Lake County');
console.log('  Assessed land: $' + subject.assessedLand.toLocaleString() + ' → ~$' + assessmentBasedLand.toLocaleString() + ' market indication');

console.log('\nCONFIRMED COMP DATA:');
console.log('  35678 N Louise Pl (PIN 0513114020)');
console.log('  Legal: ' + comp.legal);
console.log('  Lot: ' + comp.lotSqFt.toLocaleString() + ' sqft (3 lots combined — 3.06× subject)');
console.log('  Structure: ' + comp.livingAreaSqFt + ' sqft, built ' + comp.yearBuilt + ' (functional at sale)');
console.log('  Sale: $' + comp.salePrice.toLocaleString() + ' | Dec 2020 (' + compMonthsAgo + ' months ago)');

console.log('\nSTEP 1 — Strip comp improvement:');
console.log('  $' + comp.salePrice.toLocaleString() + ' − $' + compImprovementContribution.toLocaleString() + ' improvement = $' + compLandResidual.toLocaleString() + ' land for ' + comp.lotSqFt.toLocaleString() + ' sqft');

console.log('\nSTEP 2 — Time-adjust comp land:');
console.log('  +' + compMonthsAgo + 'mo × 0.3%/mo = +' + Math.round((timeAdjFactor - 1) * 100) + '%');
console.log('  $' + compLandResidual.toLocaleString() + ' × ' + timeAdjFactor.toFixed(3) + ' = $' + Math.round(compLandResidualAdjusted).toLocaleString());

console.log('\nSTEP 3 — Land value per sqft:');
console.log('  $' + Math.round(compLandResidualAdjusted).toLocaleString() + ' / ' + comp.lotSqFt.toLocaleString() + ' sqft = $' + landPerSqFt.toFixed(2) + '/sqft');

console.log('\nSTEP 4 — Apply to subject lot:');
console.log('  ' + subject.lotSqFt.toLocaleString() + ' sqft × $' + landPerSqFt.toFixed(2) + ' = $' + subjectLandValue.toLocaleString() + ' (land-residual method)');
console.log('  Assessment cross-check: $' + assessmentBasedLand.toLocaleString() + ' (assessed land × 3 × time factor)');
console.log('  Weighted estimate (60/40): $' + weightedLandEstimate.toLocaleString());

console.log('\nSTEP 5 — Demo cost deduction:');
console.log('  Demo mid ($15K) | range: $' + demoCostLow.toLocaleString() + '–$' + demoCostHigh.toLocaleString());

console.log('\n' + '─'.repeat(62));
console.log('POINT ESTIMATE : $' + pointEstimate.toLocaleString());
console.log('RANGE          : $' + rangeLow.toLocaleString() + ' — $' + rangeHigh.toLocaleString());
console.log('CONFIDENCE     : ' + confidence.label + ' (' + confidence.score + '/100)');
console.log('─'.repeat(62));

console.log('\nVERSION COMPARISON:');
console.log('  v1 (improved CMA, invalid):   $201,500  — wrong method, structure uninhabitable');
console.log('  v2 (tear-down, bad comp data): $152,500  — comp data unverified, 3-lot error');
console.log('  v3 (confirmed parcel records): $' + pointEstimate.toLocaleString() + '    — corrected comp, confirmed subject data');

console.log('\nWATER ACCESS — CLOSED:');
console.log('  LMWATER = "No" in Lake County GIS. Watershed = Manitou Creek.');
console.log('  This is NOT a Long Lake parcel. Zero water access premium.');
console.log('  The $20K-$60K upside flagged in v2 does NOT apply.');

console.log('\nCRITICAL GAPS:');
confidence.gaps.forEach(g => console.log('  ⚠', g));

// ─── UPDATE VALUATION RECORD ─────────────────────────────────────────────────
const valuations = JSON.parse(fs.readFileSync('C:/Kahn 2.0/data/valuations.json', 'utf8'));
const idx = valuations.findIndex(v => v.id === 'val_louise_003_v2');

const updatedVal = {
  ...(idx >= 0 ? valuations[idx] : {}),
  id: 'val_louise_003_v3',
  prospectId: 'p_louise_003',
  propertyId: 'prop_louise_003',
  requestedAt: now,
  revisionOf: 'val_louise_003_v2',
  revisionReason: 'Parcel records confirmed via Lake County GIS ArcGIS REST API. Prior v2 analysis used unverified comp data — comp was 3 lots (22,991 sqft) not 1 lot, built 1990 not 1940s. Water access definitively resolved: LMWATER=No, Manitou Creek watershed. All subject data corrected from official record.',
  confirmedParcelData: {
    subject: {
      pin: subject.pin,
      legal: subject.legal,
      lotSqFt: subject.lotSqFt,
      lotAcres: subject.lotAcres,
      livingAreaSqFt: subject.livingAreaSqFt,
      yearBuilt: subject.yearBuilt,
      bedrooms: subject.bedrooms,
      fullBaths: subject.fullBaths,
      lakeWaterAccess: subject.lakeWaterAccess,
      watershed: subject.watershed,
      femaZone: subject.femaZone,
      assessedLand: subject.assessedLand,
      assessedTotal: subject.assessedTotal,
      dataSource: 'Lake County GIS WABParcels MapServer Layer 12',
      confirmedAt: now,
    },
    comp: {
      pin: comp.pin,
      legal: comp.legal,
      lotSqFt: comp.lotSqFt,
      livingAreaSqFt: comp.livingAreaSqFt,
      yearBuilt: comp.yearBuilt,
      salePrice: comp.salePrice,
      saleDate: comp.saleDate,
      lakeWaterAccess: comp.lakeWaterAccess,
      dataSource: 'Lake County GIS WABParcels MapServer Layer 12',
      confirmedAt: now,
    }
  },
  result: {
    pointEstimate,
    rangeLow,
    rangeHigh,
    confidence,
    methodology: 'Land Residual + Demo Cost Deduction (Tear-Down) — v3 with confirmed parcel data',
    steps: {
      compSalePrice: comp.salePrice,
      compImprovementStrip: compImprovementContribution,
      compLandResidualAtSale: compLandResidual,
      compTimeAdjFactor: parseFloat(timeAdjFactor.toFixed(3)),
      compLandResidualAdjusted: Math.round(compLandResidualAdjusted),
      compLotSqFt: comp.lotSqFt,
      landPerSqFt: parseFloat(landPerSqFt.toFixed(2)),
      subjectLotSqFt: subject.lotSqFt,
      landResidualMethodValue: subjectLandValue,
      assessmentCrossCheck: assessmentBasedLand,
      weightedLandEstimate,
      demoCostDeducted: demoCostMid,
    },
    notes: [
      'Water access CLOSED: LMWATER=No in Lake County GIS. Watershed=Manitou Creek, not Long Lake. Zero water premium.',
      'Comp (35678 N Louise) confirmed as 3 lots (22,991 sqft) built 1990 — not a single-lot 1940s cottage as assumed in v2.',
      'Subject confirmed: 7,501 sqft lot, 816 sqft structure, built 1936, 1 bed/1 bath.',
      'Low confidence due to single comp requiring 3-to-1 lot adjustment — most significant uncertainty driver.',
      'Assessment cross-check ($25K adjusted) vs land-residual ($41K) weighted 40/60 to produce $35K land estimate.',
      'Demo cost revised to $15K mid for 816 sqft 1936 structure (asbestos/lead virtually certain).',
    ]
  },
  gaps: {
    critical: [
      { field: 'Single comp with 3-lot-to-1-lot adjustment', impact: 'Largest uncertainty driver. No pure single-lot land sales available in neighborhood.' },
      { field: 'Improvement strip-out uncertainty (±$15K)', impact: 'Each $15K change in improvement contribution shifts land residual per sqft by $0.65/sqft, shifting final estimate by ~$5K' },
      { field: 'Actual demolition cost', impact: 'Get contractor quote. 1936 structure — asbestos testing required before demo permit. Budget $15K mid.' },
    ],
    recommended: [
      { field: 'Additional land comps (vacant lot sales in 60041 or Alexanders Subdn)', impact: 'One additional land comp would significantly tighten the range' },
      { field: 'Confirm assessment year', impact: 'If assessment is 3+ years stale, reassessment could shift cross-check value' },
    ],
    nice: []
  },
  actualSalePrice: null,
  actualSaleDate: null,
  variance: null,
};

if (idx >= 0) {
  valuations[idx] = updatedVal;
} else {
  valuations.push(updatedVal);
}

fs.writeFileSync('C:/Kahn 2.0/data/valuations.json', JSON.stringify(valuations, null, 2));
console.log('\nValuation updated: val_louise_003_v3 written to data/valuations.json');
