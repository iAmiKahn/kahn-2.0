# Kahn RE Platform — Data Schema Documentation
*Machine-readable data layer for GitHub integration and multi-agent access.*

---

## Overview

All data lives as JSON files in this directory. Files are:
- **Human-readable** — plain JSON, no binary formats
- **GitHub-ready** — can be committed directly to the knowledge repo
- **Machine-readable** — structured for multi-agent consumption
- **Portable** — no proprietary database format, zero vendor lock-in

---

## Files

### `prospects.json`
Array of prospect objects. One record per potential seller.

```json
{
  "id": "1711900000000_abc123",
  "name": "Jane Smith",
  "phone": "(555) 000-0000",
  "email": "jane@example.com",
  "source": "referral",
  "status": "active",
  "propertyAddress": "123 Oak Lane, Lake in the Hills, IL 60156",
  "propertyType": "sfr",
  "beds": 3,
  "baths": 2,
  "sqft": 1850,
  "yearBuilt": 1998,
  "estimatedValue": 350000,
  "motivation": "downsizing",
  "timeline": "3_6mo",
  "notes": "Referred by Tom K. Looking to downsize after youngest left for college.",
  "createdAt": "2026-04-01T14:00:00.000Z",
  "updatedAt": "2026-04-01T14:00:00.000Z"
}
```

**Status values:** `active` | `follow_up` | `cold` | `listed` | `closed` | `dead`
**Source values:** `referral` | `cold_call` | `door_knock` | `social_media` | `online_lead` | `past_client` | `open_house` | `expired` | `fsbo` | `other`
**Motivation values:** `downsizing` | `upsizing` | `relocation` | `divorce` | `estate` | `financial` | `retirement` | `investment` | `unknown`

---

### `properties.json`
Array of property objects. Linked to prospects. Stores structured property data used by valuation engine.

```json
{
  "id": "1711900100000_def456",
  "prospectId": "1711900000000_abc123",
  "address": "123 Oak Lane, Lake in the Hills, IL 60156",
  "propertyType": "sfr",
  "sqft": 1850,
  "bathsFull": 2,
  "bathsHalf": 1,
  "garageSpaces": 2,
  "basementFinishedSqft": 600,
  "yearBuilt": 1998,
  "condition": "good",
  "pool": false,
  "deck": true,
  "improvements": [
    { "type": "kitchen_remodel", "year": "2022", "estimatedCost": 28000 }
  ],
  "createdAt": "2026-04-01T14:05:00.000Z"
}
```

---

### `valuations.json`
Array of valuation objects. Each represents one CMA run. Includes full input and output for reproducibility and learning.

```json
{
  "id": "1711900200000_ghi789",
  "prospectId": "1711900000000_abc123",
  "propertyId": "1711900100000_def456",
  "requestedAt": "2026-04-01T14:10:00.000Z",
  "subject": { ... },
  "market": {
    "condition": "seller",
    "monthlyAppreciation": 0.003,
    "listToSaleRatio": 1.015,
    "avgDom": 12
  },
  "comps": [
    {
      "address": "456 Elm St, City, IL",
      "salePrice": 340000,
      "saleDate": "2026-02-15",
      "sqft": 1780,
      "bathsFull": 2,
      "garageSpaces": 2,
      "condition": "good",
      "distanceMiles": 0.4
    }
  ],
  "result": {
    "pointEstimate": 358000,
    "rangeLow": 344000,
    "rangeHigh": 372000,
    "confidence": { "score": 72, "label": "High", "color": "green" },
    "methodology": "Sales Comparison Approach (CMA)"
  },
  "gaps": {
    "critical": [],
    "recommended": [{ "field": "Monthly appreciation rate", "impact": "..." }],
    "nice": []
  },
  "actualSalePrice": null,
  "actualSaleDate": null,
  "variance": null,
  "outcomeRecordedAt": null
}
```

**Key fields for learning:**
- `result.confidence.score` — 0–100 confidence at time of valuation
- `actualSalePrice` — populated when outcome is known
- `variance` — `((actual - estimated) / estimated) × 100`, positive = we underestimated

---

### `interactions.json`
Array of interaction log entries. Linked to prospects.

```json
{
  "id": "1711900300000_jkl012",
  "prospectId": "1711900000000_abc123",
  "type": "call",
  "date": "2026-04-01",
  "notes": "Had a 20-minute call. She is motivated by downsizing...",
  "nextAction": "Send CMA by Friday",
  "nextActionDate": "2026-04-04",
  "createdAt": "2026-04-01T15:00:00.000Z"
}
```

**Type values:** `call` | `text` | `email` | `meeting` | `showing` | `offer` | `follow_up` | `note`

---

### `learning.json`
Auto-generated learning log. Populated by the system whenever an outcome is recorded or a pattern is identified. Feed this into the knowledge system.

```json
{
  "id": "1711900400000_mno345",
  "type": "valuation_outcome",
  "source": "outcome_comparison",
  "insight": "Valuation #123: estimated $358,000, actual $362,000, variance +1.1%",
  "propertyId": "...",
  "prospectId": "...",
  "variance": 1.1,
  "loggedAt": "2026-04-15T10:00:00.000Z"
}
```

---

### `settings.json`
App configuration. Not for sync — local only.

---

## GitHub Integration

To sync to the knowledge repo at `https://github.com/iAmiKahn/kahn`:

```bash
# From C:\Kahn 2.0\data\
cp prospects.json "C:\Kahn\11_REAL_ESTATE\crm_prospects.json"
cp valuations.json "C:\Kahn\11_REAL_ESTATE\valuations.json"
cp learning.json "C:\Kahn\11_REAL_ESTATE\learning_log.json"
cd "C:\Kahn"
git add 11_REAL_ESTATE/
git commit -m "RE Platform sync: [date]"
git push
```

The `learning.json` file is the primary knowledge system input — outcome variances directly inform valuation methodology refinements.

---

## ID Format

All IDs: `{timestamp}_{random6chars}` — e.g., `1711900000000_abc123`
- Globally unique within the dataset
- Lexicographically sortable by creation time
- No external dependencies
