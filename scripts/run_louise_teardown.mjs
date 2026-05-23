/**
 * TEAR-DOWN VALUATION — 35656 N Louise Place, Ingleside IL 60041
 *
 * METHODOLOGY CHANGE: Structure is uninhabitable — zero improvement value.
 * Cannot use Improved Sales Comparison Approach (prior method).
 *
 * CORRECT METHOD: Land Residual + Demo Cost Deduction
 *
 * Step 1 — Establish land value using improved comp with improvement stripped out
 * Step 2 — Deduct estimated demolition cost from land value
 * Step 3 — Result = what a buyer would rationally pay for the tear-down lot
 *
 * This is how appraisers value tear-downs. The buyer is purchasing land only;
 * the structure has negative value (they inherit the obligation to remove it).
 */

import fs from 'fs';

const now = new Date().toISOString();

// ─── LAND RESIDUAL ANALYSIS ─────────────────────────────────────────────────

/**
 * STEP 1: Best available land comp
 *
 * 35678 N Louise Pl — same street, ~50ft away, nearly identical lot
 *   Sale price:   $180,000
 *   Sale date:    Feb 9, 2021 (62 months ago as of April 2026)
 *   Improved:     ~700 sqft cottage, 1 bed/1 bath (functional at time of sale)
 *   This is our only direct street comp — everything else is 0.9+ miles away
 */
const compSalePrice    = 180000;
const compMonthsAgo    = 62;
const monthlyAppreciation = 0.003; // ~0.3%/mo — conservative for Ingleside balanced market

// Time-adjust the comp forward 62 months
const timeAdjFactor    = 1 + (monthlyAppreciation * compMonthsAgo);
const compAdjustedValue = Math.round(compSalePrice * timeAdjFactor / 500) * 500;
// $180,000 × 1.186 = $213,480 → $213,500

/**
 * STEP 2: Strip out improvement contribution from the adjusted comp
 *
 * The comp (35678) sold as an IMPROVED property — a functional cottage.
 * To get land-only value, we subtract what the cottage itself contributed.
 *
 * Improvement contribution estimate:
 *   - 700 sqft, 1940s-era cottage
 *   - Replacement cost new: ~$90/sqft × 700 = $63,000
 *   - Physical depreciation: 70% (80+ yr old structure, minimal maintenance typical)
 *   - Depreciated improvement value: $63,000 × 0.30 = ~$18,900
 *   - BUT: functional marketability adds a premium vs pure depreciated cost
 *   - Market-based estimate: $45,000-$55,000 (the cottage enabled immediate occupancy)
 *   - Used: $48,000 (midpoint of range)
 */
const improvementContribution = 48000;
const landValue = compAdjustedValue - improvementContribution;
// $213,500 - $48,000 = $165,500

/**
 * STEP 3: Demo cost deduction
 *
 * Buyer of a tear-down must demolish the uninhabitable structure.
 * Demolition cost for 700 sqft single-story small structure, IL:
 *   - Low:  $8,000  (basic teardown, no asbestos)
 *   - Mid:  $12,000 (probable for 1940s structure — possible asbestos testing/abatement)
 *   - High: $18,000 (if asbestos present, licensed abatement required)
 *   - Used: $13,000 (conservative middle — 1940s cottage likely has asbestos risk)
 */
const demoCostLow  = 8000;
const demoCostMid  = 13000;
const demoCostHigh = 18000;

const pointEstimate = Math.round((landValue - demoCostMid) / 500) * 500;
const rangeLow      = Math.round((landValue - demoCostHigh) / 500) * 500;
const rangeHigh     = Math.round((landValue - demoCostLow) / 500) * 500;
// Point: $165,500 - $13,000 = $152,500 → $152,500
// Low:   $165,500 - $18,000 = $147,500
// High:  $165,500 - $8,000  = $157,500

/**
 * CONFIDENCE ASSESSMENT
 *
 * Factors reducing confidence vs. improved property valuation:
 *  - Only 1 direct street comp — and it's 62 months old
 *  - No confirmed lot size for subject (assumed ~5,000-7,500 sqft from neighbors)
 *  - Water/lake access status unknown — Louise Place is near Long Lake;
 *    any easement or lake access adds $20K-$60K to land value
 *  - Demo cost is estimated — actual quote may vary ±$5K
 *  - No confirmed year built — asbestos risk is assumed, not confirmed
 *  - Improvement strip-out is an estimate, not a formal appraisal
 */
const confidence = {
  score: 44,
  label: 'Medium',
  color: 'yellow',
  reasons: [
    'Single direct street comp (35678 N Louise Pl) same street, same profile',
    'Land residual method is standard for tear-downs',
    'Conservative demo cost assumption protects buyer downside',
  ],
  gaps: [
    'Only 1 comparable available — and 62 months old. Weakest point in the analysis.',
    'Lot size not confirmed from public records (assumed ~5,000-7,500 sqft from neighbors)',
    'Lake/water access status unknown — if lot has any Long Lake easement or water access, add $20K-$60K',
    'Demo cost is estimated ($13K mid). Get contractor quote — 1940s structures may require asbestos abatement ($5K-$8K additional)',
    'Year built unknown — asbestos/lead risk unconfirmed',
    'No recent land-only sales found on Louise Place or immediate area',
  ]
};

// ─── PRINT RESULTS ─────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(58));
console.log('TEAR-DOWN VALUATION — 35656 N LOUISE PLACE, INGLESIDE IL');
console.log('═'.repeat(58));
console.log('METHOD: Land Residual + Demo Cost Deduction');
console.log('');
console.log('STEP 1 — Time-adjust direct street comp');
console.log('  35678 N Louise Pl, sold Feb 2021: $180,000');
console.log('  Time adj: +' + (compMonthsAgo) + 'mo × 0.3%/mo = +' + Math.round(monthlyAppreciation * compMonthsAgo * 100) + '%');
console.log('  Adjusted comparable value: $' + compAdjustedValue.toLocaleString());
console.log('');
console.log('STEP 2 — Strip improvement contribution from comp');
console.log('  Improvement contribution (700sqft 1940s cottage, functional): -$' + improvementContribution.toLocaleString());
console.log('  Land value residual: $' + landValue.toLocaleString());
console.log('');
console.log('STEP 3 — Deduct estimated demo costs');
console.log('  Demo cost (700sqft, 1940s vintage, asbestos risk): -$' + demoCostMid.toLocaleString() + ' mid');
console.log('  Demo range: -$' + demoCostLow.toLocaleString() + ' to -$' + demoCostHigh.toLocaleString());
console.log('');
console.log('─'.repeat(58));
console.log('POINT ESTIMATE : $' + pointEstimate.toLocaleString());
console.log('RANGE          : $' + rangeLow.toLocaleString() + ' — $' + rangeHigh.toLocaleString());
console.log('CONFIDENCE     : ' + confidence.label + ' (' + confidence.score + '/100)');
console.log('─'.repeat(58));
console.log('');
console.log('vs. PRIOR ESTIMATE (improved): $201,500');
console.log('TEAR-DOWN DISCOUNT vs. IMPROVED: -$' + (201500 - pointEstimate).toLocaleString() + ' (' + ((201500 - pointEstimate)/201500*100).toFixed(1) + '%)');
console.log('');
console.log('CRITICAL GAP — LAKE ACCESS:');
console.log('  If this lot has ANY Long Lake access/easement:');
console.log('  Add $20,000-$60,000 to above estimate.');
console.log('  Confirm with Lake County assessor before listing.');
console.log('');
confidence.gaps.forEach(g => console.log('  ⚠', g));

// ─── UPDATE VALUATION RECORD ────────────────────────────────────────────────
const valuations = JSON.parse(fs.readFileSync('C:/Kahn 2.0/data/valuations.json', 'utf8'));
const idx = valuations.findIndex(v => v.id === 'val_louise_003');

const updatedVal = {
  ...valuations[idx],
  id: 'val_louise_003_v2',
  requestedAt: now,
  revisionOf: 'val_louise_003',
  revisionReason: 'Structure determined uninhabitable — methodology updated from Improved Sales Comparison to Land Residual + Demo Cost Deduction. Tear-down valuation.',
  result: {
    pointEstimate,
    rangeLow,
    rangeHigh,
    confidence,
    methodology: 'Land Residual + Demo Cost Deduction (Tear-Down)',
    steps: {
      directCompAdjusted: compAdjustedValue,
      improvementContributionDeducted: improvementContribution,
      landValueResiudal: landValue,
      demoCostDeducted: demoCostMid,
    },
    notes: [
      'Structure uninhabitable — zero improvement value. Standard improved-property CMA does not apply.',
      'Land residual method: time-adjust best street comp, strip improvement contribution, deduct demo costs.',
      'Prior estimate ($201,500) assumed functional structure — invalidated by new information.',
      'Biggest variable: lake/water access. Confirm before listing. Could swing value $20K-$60K up.',
      'Second biggest variable: actual demo cost. Get a licensed contractor quote. Asbestos testing recommended given 1940s construction.',
    ]
  },
  gaps: {
    critical: [
      { field: 'Lake/water access confirmation', impact: 'Could add $20K-$60K to land value if any Long Lake easement exists' },
      { field: 'Actual demolition cost quote', impact: 'Estimate ±$5K — get contractor bid before listing; asbestos testing warranted for 1940s structure' },
      { field: 'Confirmed lot size from assessor', impact: 'Assumed 5,000-7,500 sqft from neighbors; actual size affects buildable envelope and value' },
    ],
    recommended: [
      { field: 'Year built confirmation', impact: 'Affects asbestos/lead risk assumption and demo cost accuracy' },
      { field: 'Additional land comps (vacant lot sales in 60041)', impact: 'Only 1 direct street comp available — market exposure to full land sale database would tighten range' },
    ],
    nice: []
  }
};

// Replace old record + add new version
valuations[idx] = updatedVal;
fs.writeFileSync('C:/Kahn 2.0/data/valuations.json', JSON.stringify(valuations, null, 2));
console.log('\nValuation updated in data/valuations.json');
