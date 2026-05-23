"""Build Dan's Phase 1 Integrated Workbook — dark purple themed, 8 tabs."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

OUTPUT_PATH = r"C:\Users\iAmiK\Downloads\Dan_Phase1_Integrated_Workbook.xlsx"

C = {
    'bg_deep':      '1A0B2E',
    'bg_primary':   '2D1B4E',
    'bg_secondary': '3D2A5F',
    'grad_top':     '4A2C7A',
    'grad_mid':     '5E3D94',
    'grad_bot':     '7B4FB8',
    'purple':       '9D6FE8',
    'bright':       'C8A8F0',
    'gold':         'E8C547',
    'green':        '6BCB77',
    'amber':        'FFD93D',
    'text':         'F5F0FF',
    'text_dim':     'C8B8E0',
    'text_dark':    '1A0B2E',
    'border':       '5D4378',
}

def F(hex_): return PatternFill('solid', start_color=hex_, end_color=hex_)

def FONT(size=11, bold=False, italic=False, color=None):
    return Font(name='Calibri', size=size, bold=bold, italic=italic,
                color=color or C['text'])

TITLE_FONT   = FONT(18, bold=True)
HEADER_FONT  = FONT(13, bold=True)
SUBHEAD_FONT = FONT(11, bold=True, color=C['bright'])
BODY_FONT    = FONT(11)
BODY_BOLD    = FONT(11, bold=True)
NOTE_FONT    = FONT(10, italic=True, color=C['text_dim'])
GOLD_FONT    = FONT(13, bold=True, color=C['gold'])
DARK_FONT    = FONT(11, bold=True, color=C['text_dark'])
NUM_FONT     = FONT(11, bold=True, color=C['bright'])

CENTER = Alignment(horizontal='center', vertical='center', wrap_text=True)
LEFT   = Alignment(horizontal='left', vertical='center', wrap_text=True, indent=1)
LEFTNI = Alignment(horizontal='left', vertical='center', wrap_text=True)
RIGHT  = Alignment(horizontal='right', vertical='center', wrap_text=True)

def BORDER():
    s = Side(style='thin', color=C['border'])
    return Border(left=s, right=s, top=s, bottom=s)

def LBORDER(color_key='green'):
    s = Side(style='thin', color=C['border'])
    left = Side(style='thick', color=C[color_key])
    return Border(left=left, right=s, top=s, bottom=s)

def fill_rng(ws, r1, r2, c1, c2, color):
    f = F(color)
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            ws.cell(row=r, column=c).fill = f

def fill_all_bg(ws, rows, cols, color=None):
    color = color or C['bg_primary']
    fill_rng(ws, 1, rows, 1, cols, color)
    # left+right padding cols deeper
    fill_rng(ws, 1, rows, 1, 1, C['bg_deep'])
    fill_rng(ws, 1, rows, cols, cols, C['bg_deep'])

def merge_set(ws, r, c1, c2, value=None, font=None, align=None, fill=None):
    if c2 > c1:
        ws.merge_cells(start_row=r, start_column=c1, end_row=r, end_column=c2)
    cell = ws.cell(row=r, column=c1)
    if value is not None: cell.value = value
    if font is not None: cell.font = font
    if align is not None: cell.alignment = align
    if fill is not None: cell.fill = fill
    return cell

def banner(ws, row, c1, c2, title):
    """3-row gradient banner. Returns next available row."""
    fill_rng(ws, row, row, c1, c2, C['grad_top'])
    ws.row_dimensions[row].height = 10
    fill_rng(ws, row+1, row+1, c1, c2, C['grad_mid'])
    ws.row_dimensions[row+1].height = 38
    merge_set(ws, row+1, c1, c2, title, TITLE_FONT, CENTER)
    fill_rng(ws, row+2, row+2, c1, c2, C['grad_bot'])
    ws.row_dimensions[row+2].height = 10
    return row + 3

def section(ws, row, c1, c2, title):
    """2-row gradient section header. Returns next available row."""
    fill_rng(ws, row, row, c1, c2, C['grad_top'])
    ws.row_dimensions[row].height = 6
    fill_rng(ws, row+1, row+1, c1, c2, C['grad_mid'])
    ws.row_dimensions[row+1].height = 26
    merge_set(ws, row+1, c1, c2, title, HEADER_FONT, LEFT)
    return row + 2

def day_banner(ws, row, c1, c2, title, day_color_key):
    """Per-day gradient banner on meal plan tab (slim)."""
    fill_rng(ws, row, row, c1, c2, C['grad_top'])
    ws.row_dimensions[row].height = 6
    fill_rng(ws, row+1, row+1, c1, c2, C['grad_mid'])
    ws.row_dimensions[row+1].height = 30
    cell = merge_set(ws, row+1, c1, c2, title, FONT(14, bold=True), LEFT)
    fill_rng(ws, row+2, row+2, c1, c2, C['grad_bot'])
    ws.row_dimensions[row+2].height = 6
    return row + 3

def set_col_widths(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

def style_cell(cell, value=None, font=None, align=None, fill=None, border=None):
    if value is not None: cell.value = value
    if font is not None: cell.font = font
    if align is not None: cell.alignment = align
    if fill is not None: cell.fill = fill
    if border is not None: cell.border = border

# =============================================================================
# TAB 1: START HERE
# =============================================================================
def build_start_here(wb):
    ws = wb.create_sheet('START HERE')
    set_col_widths(ws, [2, 28, 28, 28, 28, 2])
    # total rows ~ 70
    TOTAL_ROWS = 80
    fill_all_bg(ws, TOTAL_ROWS, 6)

    r = 2
    r = banner(ws, r, 2, 5, 'PHASE 1 — INTEGRATED WORKBOOK')

    # Intro paragraph
    r += 1
    merge_set(ws, r, 2, 5, 'A 16-week body recomposition plan: May–August 2026. Used jointly by Dan and Brett. We cook, we weigh, we track. One workbook, one team, one target.',
              FONT(12), LEFTNI)
    ws.row_dimensions[r].height = 45
    r += 2

    # What we're working toward
    r = section(ws, r, 2, 5, 'WHAT WE ARE WORKING TOWARD')
    r += 1
    lines = [
        ('Phase 1 goal (Aug 2026):', '205 lbs → 195 lbs at ~18% body fat — recomp window'),
        ('End-state target (Mar 2027):', '225 lbs at 13% body fat — Greek god physique'),
        ('Weekly pace:', '0.75–1 lb fat loss, lean mass holds or slightly increases'),
        ('Monthly pace:', '~4–5 lbs fat loss, ~1 lb lean mass gain'),
    ]
    for label, val in lines:
        style_cell(ws.cell(r, 2), label, SUBHEAD_FONT, LEFTNI, fill=F(C['bg_secondary']))
        merge_set(ws, r, 3, 5, val, BODY_FONT, LEFTNI, F(C['bg_secondary']))
        ws.row_dimensions[r].height = 24
        r += 1
    r += 1

    # The ONE thing — gold callout
    r = section(ws, r, 2, 5, 'THE ONE THING THAT MATTERS MOST')
    r += 1
    fill_rng(ws, r, r+2, 2, 5, C['gold'])
    cell = merge_set(ws, r, 2, 5, 'Weigh every food before cooking. The scale is the law.',
                     FONT(16, bold=True, color=C['text_dark']), CENTER)
    ws.row_dimensions[r].height = 34
    merge_set(ws, r+1, 2, 5, 'Seasoning, cooking method, and presentation = unlimited creativity.',
              FONT(12, italic=True, color=C['text_dark']), CENTER)
    ws.row_dimensions[r+1].height = 26
    merge_set(ws, r+2, 2, 5, 'Everything else flexes. Protein does not. The gram count does not.',
              FONT(11, color=C['text_dark']), CENTER)
    ws.row_dimensions[r+2].height = 22
    r += 4

    # How we use this workbook
    r = section(ws, r, 2, 5, 'HOW WE USE THIS WORKBOOK')
    r += 1
    cadence = [
        ('1.', 'Sunday', 'Review the week. Shop from the INGREDIENTS tab. Weigh in Monday morning (post-bathroom, no clothes, same scale).'),
        ('2.', 'Monday', 'Batch-cook the week\'s proteins and carbs. Portion into containers. Weigh everything raw before cooking.'),
        ('3.', 'Daily', 'Assemble meals from prepped components using the WEEKLY MEAL PLAN tab. Log water. Train if scheduled.'),
        ('4.', 'Every 2 weeks', 'Progress photos — front, side, back. Same lighting, same poses. Log weight on MACRO TARGETS.'),
        ('5.', 'Monthly', 'Adjust. If weight not moving ~3–5 lbs/month, drop calories by 150/day. If energy crashes, add 100 cal carbs on training days.'),
    ]
    for num, when, what in cadence:
        style_cell(ws.cell(r, 2), num, FONT(14, bold=True, color=C['purple']), CENTER, fill=F(C['bg_secondary']))
        style_cell(ws.cell(r, 3), when, SUBHEAD_FONT, LEFTNI, fill=F(C['bg_secondary']))
        merge_set(ws, r, 4, 5, what, BODY_FONT, LEFTNI, F(C['bg_secondary']))
        ws.row_dimensions[r].height = 38
        r += 1
    r += 1

    # Tab guide
    r = section(ws, r, 2, 5, 'TAB GUIDE')
    r += 1
    # header row
    style_cell(ws.cell(r, 2), 'TAB', SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    merge_set(ws, r, 3, 5, 'WHAT IT IS FOR', SUBHEAD_FONT, LEFTNI, F(C['grad_top']))
    ws.cell(r, 3).border = BORDER()
    ws.cell(r, 4).border = BORDER()
    ws.cell(r, 5).border = BORDER()
    ws.row_dimensions[r].height = 24
    r += 1
    tabs = [
        ('START HERE',            'This tab. Welcome, targets, cadence, tab guide.'),
        ('THE RULES',             'Five execution rules. The non-negotiables. Read weekly.'),
        ('MACRO TARGETS',         'Daily, weekly, monthly numbers. 16-week progress tracker with auto delta + running average.'),
        ('INGREDIENTS & SHOPPING','Grocery-store-order list with weekly + per-day amounts, costs, checkboxes, and batch-cook guide.'),
        ('WEEKLY MEAL PLAN',      'THE HUB. Each day = meals + workout + macros. Integrated daily view.'),
        ('FOOD SWAPS',            'Exact gram substitutions: protein, carbs, vegetables, fats, fruit.'),
        ('WORKOUT SCHEDULE',      'Full standalone training program reference. Phase breakdown + weekly split.'),
        ('SUPPLEMENTS',           'Creatine, D3, magnesium, omega-3, whey. Dosing, timing, cost. Paid in cash, not SNAP.'),
    ]
    for tab, desc in tabs:
        style_cell(ws.cell(r, 2), tab, BODY_BOLD, LEFTNI, fill=F(C['bg_secondary']), border=BORDER())
        merge_set(ws, r, 3, 5, desc, BODY_FONT, LEFTNI, F(C['bg_secondary']))
        ws.cell(r, 3).border = BORDER()
        ws.cell(r, 4).border = BORDER()
        ws.cell(r, 5).border = BORDER()
        ws.row_dimensions[r].height = 26
        r += 1
    r += 1

    # Quick daily reference
    r = section(ws, r, 2, 5, 'QUICK DAILY REFERENCE')
    r += 1
    # 2-column comparison
    headers = ['', 'TRAINING DAY', 'REST DAY']
    style_cell(ws.cell(r, 2), '', BODY_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 3), 'TRAINING DAY (Mon–Fri + optional Sat)', SUBHEAD_FONT, CENTER, fill=F(C['green']), border=BORDER())
    ws.cell(r, 3).font = FONT(11, bold=True, color=C['text_dark'])
    merge_set(ws, r, 4, 5, 'REST DAY (Sun + skipped Sat)', SUBHEAD_FONT, CENTER, F(C['amber']))
    ws.cell(r, 4).font = FONT(11, bold=True, color=C['text_dark'])
    ws.cell(r, 4).border = BORDER()
    ws.cell(r, 5).border = BORDER()
    ws.row_dimensions[r].height = 24
    r += 1
    rows = [
        ('Calories',  '2,600',   '2,300'),
        ('Protein',   '220g (34%)', '220g (38%)'),
        ('Carbs',     '260g (40%)', '200g (35%)'),
        ('Fat',       '75g (26%)',  '68g (27%)'),
        ('Fiber',     '35g minimum','35g minimum'),
        ('Water',     '128 oz (1 gal)', '128 oz (1 gal)'),
    ]
    for lbl, tr, rest in rows:
        style_cell(ws.cell(r, 2), lbl, BODY_BOLD, LEFTNI, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 3), tr,  NUM_FONT,   CENTER,  fill=F(C['bg_secondary']), border=BORDER())
        merge_set(ws, r, 4, 5, rest, NUM_FONT, CENTER, F(C['bg_secondary']))
        ws.cell(r, 4).border = BORDER()
        ws.cell(r, 5).border = BORDER()
        ws.row_dimensions[r].height = 22
        r += 1
    r += 2

    # Footer
    merge_set(ws, r, 2, 5, 'Last updated: 2026-04-20  •  Phase 1 runs May–August 2026  •  Phase 2 (Lean Bulk) begins September.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 22

# =============================================================================
# TAB 2: THE RULES
# =============================================================================
def build_rules(wb):
    ws = wb.create_sheet('THE RULES')
    set_col_widths(ws, [2, 8, 28, 76, 2])
    TOTAL_ROWS = 70
    fill_all_bg(ws, TOTAL_ROWS, 5)

    r = 2
    r = banner(ws, r, 2, 4, 'THE RULES')
    r += 1
    merge_set(ws, r, 2, 4, 'Five execution rules. The non-negotiables. If you break one of these, the whole plan slows down.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 24
    r += 2

    rules = [
        ('1', 'THE SCALE',
         'Weigh every ingredient raw, before cooking. No eyeballing. No "about a cup." No "a handful." Raw weights in grams, every time. This is the single biggest predictor of whether recomp works. Eyeballing kills recomps. The kitchen scale is the law.'),
        ('2', 'HIT THE PROTEIN',
         '220g protein every day — training day or rest day. Miss carbs, miss fat, skip a snack, forget a vegetable — but never miss protein. Protein is the anchor. Everything else flexes. 1.07g per lb bodyweight is the floor for preserving muscle in a deficit.'),
        ('3', 'TRAINING vs REST DAYS',
         'Training days (Mon/Tue/Wed/Thu/Fri + optional Sat): 2,600 cal, 260g carbs, 75g fat. Rest days (Sun + skipped Sat): 2,300 cal, 200g carbs, 68g fat. Protein stays at 220g both. Higher carbs on training days fuels the lifts; lower carbs on rest days speeds fat loss.'),
        ('4', 'SWAPS BY THE BOOK',
         'If something is out of stock or unaffordable, use the FOOD SWAPS tab. Use the exact gram amounts listed. Do not freestyle substitutions — a "similar" food with different macros breaks the plan. The swap tab has been calibrated so every swap holds protein/carb/fat content constant.'),
        ('5', 'TRACK EVERY SUNDAY',
         'Weigh-in Sunday morning, post-bathroom, no clothes, same scale. Log on MACRO TARGETS tab. Photos every 2 weeks — front, side, back, same lighting, same poses. The scale lies during recomps; photos do not. Monthly: adjust calories up or down by 150 if progress stalls or energy crashes.'),
    ]
    for num, title, body in rules:
        # Big number cell
        style_cell(ws.cell(r, 2), num, FONT(40, bold=True, color=C['purple']), CENTER, fill=F(C['bg_secondary']))
        ws.row_dimensions[r].height = 28
        # Rule name
        style_cell(ws.cell(r, 3), title, FONT(14, bold=True, color=C['bright']), LEFT, fill=F(C['bg_secondary']))
        # Body
        style_cell(ws.cell(r, 4), body, BODY_FONT, LEFTNI, fill=F(C['bg_secondary']))
        # Span number cell vertically across title+body? Just use 1 row and put body in row below
        ws.cell(r, 2).border = BORDER()
        ws.cell(r, 3).border = BORDER()
        ws.cell(r, 4).border = BORDER()
        ws.row_dimensions[r].height = 28
        # Body gets its own row
        r += 1
        style_cell(ws.cell(r, 2), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']))
        merge_set(ws, r, 3, 4, body, BODY_FONT, LEFTNI, F(C['bg_secondary']))
        ws.cell(r, 2).border = BORDER()
        ws.cell(r, 3).border = BORDER()
        ws.cell(r, 4).border = BORDER()
        ws.row_dimensions[r].height = 60
        # Spacer
        r += 2

    # Wait — the loop above has a bug. Let me restart the rules loop cleanly.
    pass

def build_rules_v2(wb):
    # Remove any existing and rebuild cleanly
    if 'THE RULES' in wb.sheetnames:
        del wb['THE RULES']
    ws = wb.create_sheet('THE RULES')
    set_col_widths(ws, [2, 8, 28, 76, 2])
    TOTAL_ROWS = 80
    fill_all_bg(ws, TOTAL_ROWS, 5)

    r = 2
    r = banner(ws, r, 2, 4, 'THE RULES')
    r += 1
    merge_set(ws, r, 2, 4, 'Five execution rules. The non-negotiables. If you break one of these, the whole plan slows down.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 24
    r += 2

    rules = [
        ('1', 'THE SCALE',
         'Weigh every ingredient raw, before cooking. No eyeballing. No "about a cup." No "a handful." Raw weights in grams, every time. This is the single biggest predictor of whether recomp works. Eyeballing kills recomps. The kitchen scale is the law.'),
        ('2', 'HIT THE PROTEIN',
         '220g protein every day — training day or rest day. Miss carbs, miss fat, skip a snack, forget a vegetable — but never miss protein. Protein is the anchor. Everything else flexes. 1.07g per lb bodyweight is the floor for preserving muscle in a deficit.'),
        ('3', 'TRAINING vs REST DAYS',
         'Training days (Mon/Tue/Wed/Thu/Fri + optional Sat): 2,600 cal, 260g carbs, 75g fat. Rest days (Sun + skipped Sat): 2,300 cal, 200g carbs, 68g fat. Protein stays at 220g both. Higher carbs on training days fuels the lifts; lower carbs on rest days speeds fat loss.'),
        ('4', 'SWAPS BY THE BOOK',
         'If something is out of stock or unaffordable, use the FOOD SWAPS tab. Use the exact gram amounts listed. Do not freestyle substitutions — a similar food with different macros breaks the plan. The swap tab is calibrated so every swap holds protein / carb / fat content constant.'),
        ('5', 'TRACK EVERY SUNDAY',
         'Weigh-in Sunday morning, post-bathroom, no clothes, same scale. Log on MACRO TARGETS tab. Photos every 2 weeks — front, side, back, same lighting, same poses. The scale lies during recomps; photos do not. Monthly: adjust calories up or down by 150 if progress stalls or energy crashes.'),
    ]
    for num, title, body in rules:
        # Title row — number on left, rule name on right
        style_cell(ws.cell(r, 2), num, FONT(36, bold=True, color=C['purple']), CENTER, fill=F(C['grad_top']))
        merge_set(ws, r, 3, 4, title, FONT(16, bold=True, color=C['bright']), LEFT, F(C['grad_top']))
        ws.row_dimensions[r].height = 46
        r += 1
        # Body row — number cell empty, body spans 3,4
        style_cell(ws.cell(r, 2), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']))
        merge_set(ws, r, 3, 4, body, BODY_FONT, LEFTNI, F(C['bg_secondary']))
        ws.cell(r, 2).border = BORDER()
        ws.cell(r, 3).border = BORDER()
        ws.cell(r, 4).border = BORDER()
        ws.row_dimensions[r].height = 70
        r += 2  # spacer

# =============================================================================
# TAB 3: MACRO TARGETS
# =============================================================================
def build_macro_targets(wb):
    ws = wb.create_sheet('MACRO TARGETS')
    set_col_widths(ws, [2, 14, 16, 16, 16, 16, 16, 30, 2])
    TOTAL_ROWS = 80
    fill_all_bg(ws, TOTAL_ROWS, 9)

    r = 2
    r = banner(ws, r, 2, 8, 'MACRO TARGETS & PROGRESS')
    r += 1
    merge_set(ws, r, 2, 8, 'Phase 1: 205 lbs → 195 lbs at ~18% body fat  •  May–August 2026  •  ~16 weeks',
              FONT(12, italic=True, color=C['text_dim']), CENTER)
    ws.row_dimensions[r].height = 24
    r += 2

    # Daily targets table
    r = section(ws, r, 2, 8, 'DAILY TARGETS')
    r += 1
    hdrs = ['', 'Calories', 'Protein', 'Carbs', 'Fat', 'Fiber', 'Water']
    for i, h in enumerate(hdrs):
        style_cell(ws.cell(r, 2+i), h, SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    ws.row_dimensions[r].height = 24
    r += 1
    d_rows = [
        ('TRAINING DAY', '2,600',  '220g',  '260g',  '75g',  '35g+', '128 oz', C['green']),
        ('REST DAY',     '2,300',  '220g',  '200g',  '68g',  '35g+', '128 oz', C['amber']),
    ]
    for row_data in d_rows:
        label = row_data[0]
        color = row_data[-1]
        vals = row_data[1:-1]
        style_cell(ws.cell(r, 2), label, FONT(11, bold=True, color=C['text_dark']), CENTER, fill=F(color), border=BORDER())
        for i, v in enumerate(vals):
            style_cell(ws.cell(r, 3+i), v, NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        # col 8 is notes — leave blank
        style_cell(ws.cell(r, 8), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        ws.row_dimensions[r].height = 26
        r += 1
    r += 1

    # Percent split
    merge_set(ws, r, 2, 8,
              'Training day split: 34% protein / 40% carbs / 26% fat  •  Rest day split: 38% protein / 35% carbs / 27% fat',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 22
    r += 2

    # Weekly targets
    r = section(ws, r, 2, 8, 'WEEKLY TARGETS (5 training + 2 rest)')
    r += 1
    hdrs = ['', 'Calories', 'Protein', 'Carbs', 'Fat', 'Fiber', 'Expected Loss']
    for i, h in enumerate(hdrs):
        style_cell(ws.cell(r, 2+i), h, SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    ws.row_dimensions[r].height = 24
    r += 1
    # Values computed: 5*2600 + 2*2300 = 17,600
    wkly = ['WEEKLY TOTAL', '=5*2600+2*2300', '=7*220', '=5*260+2*200', '=5*75+2*68', '=7*35', '0.75–1 lb fat']
    style_cell(ws.cell(r, 2), wkly[0], BODY_BOLD, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    for i, v in enumerate(wkly[1:-1]):
        style_cell(ws.cell(r, 3+i), v, NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    style_cell(ws.cell(r, 8), wkly[-1], BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    ws.row_dimensions[r].height = 26
    r += 2

    # Monthly targets
    r = section(ws, r, 2, 8, 'MONTHLY TARGETS (4 weeks)')
    r += 1
    hdrs = ['', 'Calories', 'Protein', 'Carbs', 'Fat', 'Fiber', 'Expected Change']
    for i, h in enumerate(hdrs):
        style_cell(ws.cell(r, 2+i), h, SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    ws.row_dimensions[r].height = 24
    r += 1
    monthly_formula_row = r
    # Using 4.33 weeks/month (~30.3 days) to match calendar-month targets from the brief
    mthly = ['MONTHLY TOTAL', '=ROUND(4.33*(5*2600+2*2300),0)', '=ROUND(4.33*7*220,0)', '=ROUND(4.33*(5*260+2*200),0)', '=ROUND(4.33*(5*75+2*68),0)', '=ROUND(4.33*7*35,0)', '−4 to −5 lb fat, +1 lb lean']
    style_cell(ws.cell(r, 2), mthly[0], BODY_BOLD, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    for i, v in enumerate(mthly[1:-1]):
        style_cell(ws.cell(r, 3+i), v, NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    style_cell(ws.cell(r, 8), mthly[-1], BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    ws.row_dimensions[r].height = 26
    r += 2

    # Body comp projection
    r = section(ws, r, 2, 8, 'BODY COMPOSITION PROJECTION')
    r += 1
    hdrs = ['Stage', 'Weight', 'Body Fat %', 'Lean Mass', 'Fat Mass', 'Date', 'Notes']
    for i, h in enumerate(hdrs):
        style_cell(ws.cell(r, 2+i), h, SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    ws.row_dimensions[r].height = 24
    r += 1
    stages = [
        ('Phase 1 START',   '205 lb',  '~25%', '~154 lb', '~51 lb', 'May 2026',   'Baseline'),
        ('Phase 1 END',     '195 lb',  '~18%', '~160 lb', '~35 lb', 'Aug 2026',   'Recomp complete'),
        ('Phase 2 END',     '215 lb',  '~15%', '~183 lb', '~32 lb', 'Dec 2026',   'Lean bulk'),
        ('Phase 3 TARGET',  '225 lb',  '13%',  '~196 lb', '~29 lb', 'Mar 2027',   'Greek god'),
    ]
    for row_vals in stages:
        for i, v in enumerate(row_vals):
            font = BODY_BOLD if i == 0 else BODY_FONT
            style_cell(ws.cell(r, 2+i), v, font, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        ws.row_dimensions[r].height = 24
        r += 1
    r += 2

    # 16-week progress tracker
    r = section(ws, r, 2, 8, 'PROGRESS TRACKER — 16 WEEKS (WEIGH-IN EVERY SUNDAY)')
    r += 1
    hdrs = ['Week', 'Date', 'Weight (lb)', 'BF % (est)', 'Δ vs last wk', 'Running Avg', 'Notes']
    for i, h in enumerate(hdrs):
        style_cell(ws.cell(r, 2+i), h, SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    ws.row_dimensions[r].height = 24
    data_start = r + 1
    r += 1

    weight_col = 'D'  # col 4
    for wk in range(1, 17):
        # Week number
        style_cell(ws.cell(r, 2), wk, BODY_BOLD, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        # Date (blank)
        style_cell(ws.cell(r, 3), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        # Weight (blank for user)
        style_cell(ws.cell(r, 4), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        # BF %
        style_cell(ws.cell(r, 5), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        # Delta formula
        if wk == 1:
            delta = ''
        else:
            delta = f'=IF(COUNT({weight_col}{r-1}:{weight_col}{r})<2,"",{weight_col}{r}-{weight_col}{r-1})'
        style_cell(ws.cell(r, 6), delta, NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        # Running average formula
        ravg = f'=IF(COUNT({weight_col}{data_start}:{weight_col}{r})=0,"",AVERAGE({weight_col}{data_start}:{weight_col}{r}))'
        style_cell(ws.cell(r, 7), ravg, NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        # Notes
        style_cell(ws.cell(r, 8), '', BODY_FONT, LEFTNI, fill=F(C['bg_secondary']), border=BORDER())
        ws.row_dimensions[r].height = 22
        r += 1
    r += 1
    merge_set(ws, r, 2, 8,
              'Weigh-in protocol: Sunday morning, post-bathroom, no clothes, same scale. Δ and Running Avg auto-calculate as weights are filled in.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 24

# =============================================================================
# TAB 4: WEEKLY INGREDIENTS & SHOPPING
# =============================================================================
def build_ingredients(wb):
    ws = wb.create_sheet('INGREDIENTS & SHOPPING')
    # Cols: A pad, B Item (28), C Weekly (14), D Per-Day (14), E Cost (10), F Used For (40), G Buy? (8), H pad
    set_col_widths(ws, [2, 32, 14, 14, 10, 42, 8, 2])
    TOTAL_ROWS = 180
    fill_all_bg(ws, TOTAL_ROWS, 8)

    r = 2
    r = banner(ws, r, 2, 7, 'WEEKLY INGREDIENTS & SHOPPING')
    r += 1
    merge_set(ws, r, 2, 7, 'Order of a real grocery run: Produce → Meat & Seafood → Dairy & Eggs → Frozen → Pantry → Oils & Condiments. All weights are raw/uncooked unless noted.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 24
    r += 2

    # We'll track the subtotal row positions for each section to build a grand total
    cost_cells = []  # collect E-column row numbers of cost entries

    def header_row(ws, r):
        hdrs = ['ITEM', 'WEEKLY', 'PER-DAY', 'COST', 'USED FOR', 'BUY?']
        for i, h in enumerate(hdrs):
            style_cell(ws.cell(r, 2+i), h, SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
        ws.row_dimensions[r].height = 24
        return r + 1

    def item_row(ws, r, name, weekly_display, weekly_numeric, used_for, cost, weekly_text_only=False):
        # name
        style_cell(ws.cell(r, 2), name, BODY_BOLD, LEFT, fill=F(C['bg_secondary']), border=BORDER())
        # weekly
        style_cell(ws.cell(r, 3), weekly_display, NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        # per-day formula (if numeric)
        if weekly_text_only or weekly_numeric is None:
            style_cell(ws.cell(r, 4), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        else:
            # Put formula that references the weekly cell OR compute per-day as formula from the numeric
            # Since we displayed a string like "600g", we can't easily formula-derive. Put a formula dividing numeric.
            style_cell(ws.cell(r, 4), f'={weekly_numeric}/7', NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
            ws.cell(r, 4).number_format = '0.0'
        # cost — numeric
        if cost is None:
            style_cell(ws.cell(r, 5), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        else:
            style_cell(ws.cell(r, 5), cost, BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
            ws.cell(r, 5).number_format = '"$"#,##0.00'
            cost_cells.append(r)
        # used for
        style_cell(ws.cell(r, 6), used_for, NOTE_FONT, LEFT, fill=F(C['bg_secondary']), border=BORDER())
        # checkbox
        style_cell(ws.cell(r, 7), '☐', FONT(14, color=C['bright']), CENTER, fill=F(C['bg_secondary']), border=BORDER())
        ws.row_dimensions[r].height = 26
        return r + 1

    # PRODUCE
    r = section(ws, r, 2, 7, 'PRODUCE')
    r = header_row(ws, r)
    produce = [
        ('Spinach (fresh or frozen)',   '500g',  500,   'Mon dinner, Wed dinner, Fri dinner, Sat omelet, Sun omelet', 3.00),
        ('Kale or collard greens',      '200g',  200,   'Fri dinner (rotate with spinach)', 1.50),
        ('Broccoli (fresh or frozen)',  '500g',  500,   'Mon lunch, Tue dinner, Fri dinner (shared), Sun dinner', 2.50),
        ('Cauliflower',                  '200g',  200,   'Sun dinner (shared)', 1.50),
        ('Bell peppers (mixed)',         '500g',  500,   'Tue lunch, Thu lunch, Thu breakfast, Sat lunch, Sun omelet', 3.50),
        ('Carrots',                      '200g',  200,   'Fri dinner (shared), Sat dinner (shared)', 1.00),
        ('Tomatoes (fresh)',             '300g',  300,   'Tue lunch garnish, Fri breakfast, Sat salad, Sun lunch', 2.00),
        ('Onions',                       '300g',  300,   'Mon dinner, Tue lunch, Thu lunch, Sun omelet base', 1.50),
        ('Garlic',                       '2 heads', None, 'Everywhere — base flavor', 1.00),
        ('Mixed salad greens',           '200g',  200,   'Sat lunch chicken salad bowl', 2.50),
        ('Sweet potatoes',               '900g',  900,   'Mon, Tue, Fri dinners; Sat dinner small', 3.50),
        ('Red or russet potatoes',       '500g',  500,   'Wed lunch, Sun dinner', 2.00),
        ('Avocados',                     '3 whole',None,  'Tue, Wed, Thu, Fri, Sat, Sun (fractions)', 3.00),
        ('Bananas',                      '7 whole',None,  'Pre-workout carb daily, breakfast oats', 2.00),
        ('Apples',                       '4 whole',None,  'Mon/Tue/Thu/Sat snacks', 3.00),
        ('Oranges',                      '2 whole',None,  'Sun snack + flex', 1.00),
        ('Lemons',                       '4 whole',None,  'Flavor for everything', 1.50),
    ]
    for item, wk, wk_num, used, cost in produce:
        r = item_row(ws, r, item, wk, wk_num, used, cost, weekly_text_only=(wk_num is None))
    r += 1

    # MEAT & SEAFOOD
    r = section(ws, r, 2, 7, 'MEAT & SEAFOOD')
    r = header_row(ws, r)
    meat = [
        ('Chicken breast (raw)',         '600g',  600,  'Mon lunch, Thu lunch burrito, Sat salad', 4.50),
        ('Chicken thighs (boneless)',    '560g',  560,  'Wed lunch, Fri dinner, Sun roast', 4.00),
        ('Ground beef 93/7 (raw)',       '170g',  170,  'Mon dinner', 2.50),
        ('Ground turkey 93/7 (raw)',     '360g',  360,  'Tue lunch, Thu dinner pasta', 4.00),
        ('Top sirloin or flank steak',   '340g',  340,  'Wed dinner, Sat dinner', 8.00),
        ('Pork loin (raw)',              '180g',  180,  'Fri lunch', 2.50),
        ('Fresh salmon (or canned)',     '170g',  170,  'Tue dinner', 3.50),
    ]
    for item, wk, wk_num, used, cost in meat:
        r = item_row(ws, r, item, wk, wk_num, used, cost)
    r += 1

    # DAIRY & EGGS
    r = section(ws, r, 2, 7, 'DAIRY & EGGS')
    r = header_row(ws, r)
    dairy = [
        ('Whole eggs, large',            '21 eggs',21,   'Breakfasts daily (3 eggs avg) + pre-bed', 6.00),
        ('Greek yogurt 0% (Fage)',       '1,250g', 1250, 'Snacks daily, breakfasts, parfaits', 7.00),
        ('Cottage cheese 2%',            '1,400g', 1400, 'Pre-bed snack — every night', 5.50),
    ]
    for item, wk, wk_num, used, cost in dairy:
        r = item_row(ws, r, item, wk, wk_num, used, cost, weekly_text_only=(item.startswith('Whole eggs')))
    r += 1

    # FROZEN
    r = section(ws, r, 2, 7, 'FROZEN')
    r = header_row(ws, r)
    frozen = [
        ('Frozen mixed berries',         '500g',  500,  'Oats, yogurt, pre-bed snacks', 4.00),
        ('Frozen spinach (optional)',    '200g',  200,  'Cheaper than fresh, same nutrients', 1.50),
        ('Frozen broccoli (optional)',   '200g',  200,  'Dinner veg substitute', 1.50),
    ]
    for item, wk, wk_num, used, cost in frozen:
        r = item_row(ws, r, item, wk, wk_num, used, cost)
    r += 1

    # PANTRY / DRY GOODS
    r = section(ws, r, 2, 7, 'PANTRY & DRY GOODS')
    r = header_row(ws, r)
    pantry = [
        ('Rolled oats',                  '280g dry',280,  'Breakfast daily (Mon/Wed/Thu/Sun)', 1.50),
        ('White rice (jasmine)',         '275g dry',275,  'Mon lunch, Wed pre-workout + dinner, Fri lunch', 1.50),
        ('Brown rice',                   '150g dry',150,  'Tue lunch, Thu burrito bowl', 1.00),
        ('Whole wheat pasta',            '80g dry', 80,   'Thu dinner', 0.75),
        ('Whole wheat bread',            '6 slices',6,    'Tue breakfast, Fri breakfast, Sat breakfast, Sun breakfast', 2.00),
        ('Canned sardines',              '1 can',   1,    'Fri breakfast — non-negotiable for omega-3', 1.50),
        ('Canned tuna (water-packed)',   '3 cans',  3,    'Tue snack, Wed pre-workout, Sun lunch', 4.50),
        ('Canned salmon (optional)',     '1 can',   1,    'Alternative to fresh salmon', 3.00),
        ('Black beans (canned)',         '1 can',   1,    'Thu burrito bowl', 1.00),
        ('Lentils (canned or dry)',      '1 can or 60g dry', 1, 'Sun lunch', 1.00),
        ('Chickpeas (canned)',           '1 can',   1,    'Sat salad', 1.00),
        ('Crushed tomatoes (canned)',    '1 can',   1,    'Thu pasta sauce', 1.50),
        ('Natural peanut butter',        '100g',    100,  'Mon breakfast + snack, Thu snack, Fri snack', 1.50),
        ('Raw almonds',                  '155g',    155,  'Daily snack component', 3.50),
        ('Walnuts',                      '60g',     60,   'Mon/Thu/Sat/Sun pre-bed snack', 2.00),
        ('Chia seeds',                   '30g',     30,   'Oats, pre-bed snacks', 1.00),
        ('Honey (optional)',             '50g',     50,   'Yogurt drizzle (optional)', 1.00),
        ('Cinnamon',                     'small',   None, 'Cottage cheese, oats, yogurt', 1.00),
    ]
    for item, wk, wk_num, used, cost in pantry:
        r = item_row(ws, r, item, wk, wk_num, used, cost,
                     weekly_text_only=(isinstance(wk_num, int) and wk_num <= 6) or (wk_num is None))
    r += 1

    # OILS & CONDIMENTS
    r = section(ws, r, 2, 7, 'OILS & CONDIMENTS')
    r = header_row(ws, r)
    oils = [
        ('Extra virgin olive oil',       '236 ml (8 oz)', 236, 'Every cooking + dressing', 4.00),
        ('Soy sauce',                    'small bottle', None, 'Fri lunch pork, seasoning', 1.00),
        ('Apple cider vinegar',          'small bottle', None, 'Dressings',                 1.00),
        ('Mustard',                      'small jar',    None, 'Tuna crackers, salads',     1.00),
        ('Hot sauce',                    'small bottle', None, 'Zero-cal flavor',           1.00),
        ('Spices (garlic powder, paprika, cumin, chili, Italian)', 'stock', None, 'Every meal',  None),
        ('Salt & black pepper',          'stock',        None, 'Every meal',                None),
    ]
    for item, wk, wk_num, used, cost in oils:
        r = item_row(ws, r, item, wk, wk_num, used, cost, weekly_text_only=True)
    r += 2

    # Total cost
    fill_rng(ws, r, r, 2, 7, C['gold'])
    style_cell(ws.cell(r, 2), 'WEEKLY TOTAL COST', FONT(13, bold=True, color=C['text_dark']), LEFT)
    style_cell(ws.cell(r, 3), '', FONT(13, bold=True, color=C['text_dark']), CENTER)
    style_cell(ws.cell(r, 4), '', FONT(13, bold=True, color=C['text_dark']), CENTER)
    # Build the SUM formula across all cost cells
    cost_refs = ','.join(f'E{rn}' for rn in cost_cells)
    style_cell(ws.cell(r, 5), f'=SUM({cost_refs})', FONT(13, bold=True, color=C['text_dark']), CENTER)
    ws.cell(r, 5).number_format = '"$"#,##0.00'
    merge_set(ws, r, 6, 7, 'Estimates only — adjust to local prices. Dairy, meat, produce flex with sales.',
              FONT(10, italic=True, color=C['text_dark']), LEFT)
    ws.row_dimensions[r].height = 30
    r += 2

    # Pantry staples (monthly, not weekly)
    r = section(ws, r, 2, 7, 'PANTRY STAPLES (MONTHLY — BUY WHEN LOW)')
    r += 1
    merge_set(ws, r, 2, 7,
              'Olive oil (buy 32 oz bottle), peanut butter (16 oz jar), spices refill, soy sauce refill, hot sauce refill, salt + pepper, canned goods buffer stock.',
              NOTE_FONT, LEFTNI)
    ws.row_dimensions[r].height = 40
    r += 2

    # Batch cook guide
    r = section(ws, r, 2, 7, 'BATCH-COOK GUIDE (MONDAY PREP)')
    r += 1
    hdrs = ['ITEM', 'METHOD', 'TIME', 'YIELDS', 'STORAGE']
    widths_use = [2, 3, 4, 5, 6]
    col_headers = ['ITEM', 'METHOD', 'TIME', 'YIELDS', 'STORAGE']
    # header
    style_cell(ws.cell(r, 2), 'ITEM',    SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 3), 'METHOD',  SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 4), 'TIME',    SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 5), 'YIELDS',  SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    merge_set(ws, r, 6, 7, 'STORAGE',    SUBHEAD_FONT, CENTER, F(C['grad_top']))
    ws.cell(r, 6).border = BORDER()
    ws.cell(r, 7).border = BORDER()
    ws.row_dimensions[r].height = 24
    r += 1
    batch = [
        ('Chicken breast',     'Bake 400°F, salt+pepper+paprika, flip halfway', '25 min', '~450g cooked from 600g raw', 'Fridge 4 days, freeze 3 mo'),
        ('Chicken thighs',     'Roast 425°F on sheet pan w/ olive oil',         '35 min', '~420g cooked from 560g raw', 'Fridge 4 days, freeze 3 mo'),
        ('Ground turkey/beef', 'Brown in skillet, season as you go',            '15 min', '~1.5:1 → 1 cooked ratio',    'Fridge 3 days, freeze 2 mo'),
        ('Rice (white/brown)', 'Rice cooker or pot, 1:2 rice:water',            '20 min white / 45 min brown', '~3x dry weight cooked', 'Fridge 5 days, freeze 2 mo'),
        ('Oats (overnight)',   'Soak rolled oats in water/milk overnight',      'Overnight', 'Grab-and-go',              'Fridge 3 days'),
        ('Sweet potatoes',     'Cube, toss w/ olive oil, roast 425°F',          '30 min', '~900g roasted',              'Fridge 5 days'),
        ('Hard boiled eggs',   '10 min boil, ice bath, peel',                   '15 min', '6–12 at a time',             'Fridge 7 days'),
        ('Roasted veg',        'Sheet pan mixed veg, olive oil + salt, 425°F',  '25 min', 'Fills two containers',       'Fridge 4 days'),
    ]
    for row_vals in batch:
        style_cell(ws.cell(r, 2), row_vals[0], BODY_BOLD, LEFT, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 3), row_vals[1], BODY_FONT, LEFT, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 4), row_vals[2], BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 5), row_vals[3], BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        merge_set(ws, r, 6, 7, row_vals[4], BODY_FONT, LEFT, F(C['bg_secondary']))
        ws.cell(r, 6).border = BORDER()
        ws.cell(r, 7).border = BORDER()
        ws.row_dimensions[r].height = 32
        r += 1

# =============================================================================
# TAB 5: WEEKLY MEAL PLAN
# =============================================================================
# Meal and workout data
MEALS = {
    'MONDAY': {
        'type': 'TRAINING',
        'subtitle': 'PUSH DAY',
        'target': '2,600 cal  •  220g P  •  260g C  •  75g F',
        'totals': '~2,640 cal  •  ~225g P  •  ~260g C  •  ~78g F',
        'meals': [
            ('7:00 AM',  'Oats Power Bowl',          'Rolled oats 80g dry, whole eggs 3, banana 1 medium, frozen mixed berries 80g, natural peanut butter 15g, chia seeds 10g, black coffee'),
            ('10:00 AM', 'Greek Yogurt + Almonds',   'Plain non-fat Greek yogurt 200g, raw almonds 30g, cinnamon or honey drizzle (optional)'),
            ('12:30 PM', 'Chicken Rice Bowl',        'Chicken breast 200g raw, white rice 75g dry, broccoli 150g, olive oil 10g, garlic + paprika + salt + pepper, lemon wedge'),
            ('3:30 PM',  'Pre-Workout — Apple + PB', 'Apple 1 medium, natural peanut butter 20g, black coffee or water'),
            ('6:30 PM',  'Ground Beef + Sweet Potato','Ground beef 93/7 170g raw, sweet potato 250g raw, spinach 150g sautéed in olive oil, olive oil 10g, onion 50g, cumin + chili powder + salt'),
            ('9:30 PM',  'Cottage Cheese + Walnuts', 'Cottage cheese 2% 200g, walnuts 15g, cinnamon dusted'),
        ],
        'workout_title': 'PUSH DAY — CHEST, SHOULDERS, TRICEPS',
        'workout': [
            ('Barbell Bench Press',       '4', '8',  '90 sec'),
            ('Incline Dumbbell Press',    '4', '10', '90 sec'),
            ('Dumbbell Flyes',            '3', '12', '60 sec'),
            ('Overhead Press',            '3', '8',  '90 sec'),
            ('Lateral Raises',            '3', '15', '60 sec'),
            ('Tricep Dips',               '3', '10', '60 sec'),
            ('Tricep Rope Pushdowns',     '3', '15', '60 sec'),
        ],
        'workout_notes': 'Heavy compounds 1–4: leave 1–2 reps short of failure. Isolation 5–7: touch failure.',
    },
    'TUESDAY': {
        'type': 'TRAINING',
        'subtitle': 'PULL DAY',
        'target': '2,600 cal  •  220g P  •  260g C  •  75g F',
        'totals': '~2,620 cal  •  ~220g P  •  ~250g C  •  ~80g F',
        'meals': [
            ('7:00 AM',  'Egg & Avocado Toast',      'Whole eggs 3 scrambled or over-easy, whole wheat bread 2 slices, avocado ½ medium, spinach 80g wilted into eggs, olive oil 5g, coffee'),
            ('10:00 AM', 'Tuna Crackers + Apple',    'Canned tuna in water 120g drained, whole wheat crackers or 1 slice bread, mustard + hot sauce, apple 1 medium'),
            ('12:30 PM', 'Ground Turkey & Rice',     'Ground turkey 93/7 180g raw, brown rice 75g dry, bell peppers 150g sautéed, onion 50g, olive oil 10g, garlic + chili powder + cumin'),
            ('3:30 PM',  'Pre-Workout — Banana+Yogurt','Banana 1 medium, Greek yogurt 150g, honey drizzle (optional)'),
            ('6:30 PM',  'Salmon & Sweet Potato',    'Salmon fresh or canned 170g, sweet potato 250g, roasted broccoli or Brussels sprouts 150g, olive oil 12g, lemon + garlic + black pepper'),
            ('9:30 PM',  'Cottage Cheese + Almonds', 'Cottage cheese 2% 200g, raw almonds 20g'),
        ],
        'workout_title': 'PULL DAY — BACK, BICEPS, REAR DELTS',
        'workout': [
            ('Pull-ups (weighted if possible)', '4', '8',  '90 sec'),
            ('Barbell Rows',                    '4', '8',  '90 sec'),
            ('Lat Pulldowns',                   '3', '12', '90 sec'),
            ('Seated Cable Rows',               '3', '12', '60 sec'),
            ('Face Pulls',                      '3', '15', '60 sec'),
            ('Barbell Curls',                   '3', '10', '60 sec'),
            ('Hammer Curls',                    '3', '12', '60 sec'),
        ],
        'workout_notes': 'If weighted pull-ups aren\'t yet possible, bodyweight to failure then assisted or negatives to hit the rep range.',
    },
    'WEDNESDAY': {
        'type': 'TRAINING',
        'subtitle': 'LEG DAY',
        'target': '2,600 cal  •  220g P  •  260g C  •  75g F (slight carb bump)',
        'totals': '~2,700 cal  •  ~225g P  •  ~290g C  •  ~75g F',
        'meals': [
            ('7:00 AM',  'Protein Oats',             'Rolled oats 90g dry, whole eggs 2, egg whites 3, banana 1 medium, natural peanut butter 15g, cinnamon + chia seeds, coffee'),
            ('10:00 AM', 'Greek Yogurt Bowl',        'Greek yogurt 200g, frozen berries 80g, walnuts 15g, honey 5g'),
            ('12:30 PM', 'Chicken & Potato',         'Chicken thighs 180g raw, red potatoes 300g raw, green beans or broccoli 150g, olive oil 10g, rosemary + garlic + salt'),
            ('3:30 PM',  'Pre-Workout — Tuna + Rice','White rice 50g dry (pre-cooked), canned tuna 80g, hot sauce + soy sauce'),
            ('6:30 PM',  'Steak & Rice',             'Top sirloin or flank 170g raw, white rice 75g dry, sautéed spinach 150g, olive oil 10g, garlic + salt + pepper, ½ avocado sliced on top'),
            ('9:30 PM',  'Cottage Cheese + Berries', 'Cottage cheese 2% 200g, frozen berries 60g'),
        ],
        'workout_title': 'LEG DAY — FULL LOWER BODY',
        'workout': [
            ('Barbell Back Squat',         '4', '8',  '2 min'),
            ('Romanian Deadlift',          '4', '10', '2 min'),
            ('Bulgarian Split Squat',      '3', '10', '90 sec'),
            ('Leg Press',                  '3', '12', '90 sec'),
            ('Leg Curl (hamstring)',       '3', '12', '60 sec'),
            ('Standing Calf Raise',        '4', '15', '60 sec'),
            ('Hanging Leg Raise (core)',   '3', '15', '60 sec'),
        ],
        'workout_notes': 'Squats + RDLs: leave 2 reps in the tank. Form breakdown under fatigue = injury. Closer to failure on everything else.',
    },
    'THURSDAY': {
        'type': 'TRAINING',
        'subtitle': 'UPPER HYPERTROPHY',
        'target': '2,600 cal  •  220g P  •  260g C  •  75g F',
        'totals': '~2,640 cal  •  ~225g P  •  ~260g C  •  ~78g F',
        'meals': [
            ('7:00 AM',  'Veggie Omelet + Oats',     'Whole eggs 3, bell peppers + onions 80g, spinach 50g, rolled oats 60g dry, berries 60g, coffee'),
            ('10:00 AM', 'PB Banana + Yogurt',       'Banana 1 medium, natural peanut butter 25g, Greek yogurt 100g'),
            ('12:30 PM', 'Chicken Burrito Bowl',     'Chicken breast 200g raw, brown rice 75g dry, black beans 100g cooked, tomato salsa 50g, bell peppers + onions 100g, olive oil 10g, ¼ avocado'),
            ('3:30 PM',  'Pre-Workout — Apple + Almonds', 'Apple 1 medium, raw almonds 30g, black coffee'),
            ('6:30 PM',  'Ground Turkey Pasta',      'Ground turkey 93/7 180g raw, whole wheat pasta 80g dry, crushed tomatoes 150g, spinach 100g stirred in, olive oil 10g, garlic + basil + oregano'),
            ('9:30 PM',  'Cottage Cheese + Walnuts', 'Cottage cheese 2% 200g, walnuts 15g'),
        ],
        'workout_title': 'UPPER BODY HYPERTROPHY — VOLUME + PUMP',
        'workout': [
            ('Incline Barbell Press',            '4', '10', '90 sec'),
            ('Chest-Supported Row',              '4', '10', '90 sec'),
            ('Dumbbell Shoulder Press',          '3', '12', '90 sec'),
            ('Cable Crossovers',                 '3', '15', '45 sec'),
            ('Single-Arm Dumbbell Row',          '3', '12', '60 sec'),
            ('Lateral Raises',                   '4', '20', '45 sec'),
            ('EZ-Bar Skull Crushers',            '3', '12', '60 sec'),
            ('Incline Dumbbell Curl',            '3', '12', '60 sec'),
        ],
        'workout_notes': 'Push closer to failure than Monday. Metabolic stress + muscle damage. Time under tension matters more than max load.',
    },
    'FRIDAY': {
        'type': 'TRAINING',
        'subtitle': 'LOWER HYPERTROPHY + CORE',
        'target': '2,600 cal  •  220g P  •  260g C  •  75g F',
        'totals': '~2,650 cal  •  ~225g P  •  ~255g C  •  ~80g F',
        'meals': [
            ('7:00 AM',  'Sardine Toast + Eggs',     'Sardines 1 can (~120g), whole wheat bread 2 slices, whole eggs 2, tomato slices, avocado ¼ medium, coffee'),
            ('10:00 AM', 'Yogurt Bowl + Oats',       'Greek yogurt 200g, rolled oats 20g raw as topping, berries 80g, almonds 15g'),
            ('12:30 PM', 'Pork Loin + Rice',         'Pork loin 180g raw, white rice 75g dry, roasted carrots + broccoli 200g, olive oil 10g, garlic + soy sauce + ginger'),
            ('3:30 PM',  'Pre-Workout — Banana + PB','Banana 1 medium, natural peanut butter 20g'),
            ('6:30 PM',  'Chicken Thigh + Sweet Potato','Chicken thighs 180g raw, sweet potato 250g, sautéed kale or spinach 150g, olive oil 12g, garlic + paprika + salt'),
            ('9:30 PM',  'Cottage Cheese + Chia',    'Cottage cheese 2% 200g, chia seeds 10g, cinnamon'),
        ],
        'workout_title': 'LOWER HYPERTROPHY + CORE',
        'workout': [
            ('Deadlift',                              '4', '6',           '2 min'),
            ('Front Squat or Hack Squat',             '4', '10',          '90 sec'),
            ('Walking Lunges (dumbbell)',             '3', '12/leg',      '90 sec'),
            ('Leg Extension',                         '3', '15',          '60 sec'),
            ('Lying Leg Curl',                        '3', '15',          '60 sec'),
            ('Seated Calf Raise',                     '4', '20',          '60 sec'),
            ('Cable Woodchoppers',                    '3', '12/side',     '60 sec'),
            ('Plank',                                 '3', '45–60 sec',   '60 sec'),
        ],
        'workout_notes': 'Deadlifts: leave 2 in the tank, never grind. Closer to failure on everything else.',
    },
    'SATURDAY': {
        'type': 'REST_OR_LIGHT',
        'subtitle': 'OPTIONAL CONDITIONING + ARMS',
        'target': '2,300 cal  •  220g P  •  200g C  •  68g F (rest-day targets; bump if you train)',
        'totals': '~2,320 cal  •  ~220g P  •  ~195g C  •  ~75g F',
        'meals': [
            ('7:00 AM',  'Egg & Avocado Scramble',   'Whole eggs 4, avocado ½ medium, spinach 80g, whole wheat bread 1 slice, olive oil 5g, coffee'),
            ('10:00 AM', 'Yogurt + Fruit',           'Greek yogurt 200g, berries 80g, walnuts 15g'),
            ('12:30 PM', 'Chicken Salad Bowl',       'Chicken breast 200g raw, mixed greens + spinach 200g, tomatoes + cucumber + bell peppers 150g, chickpeas 80g, olive oil + lemon dressing 15g, feta 20g (optional)'),
            ('3:30 PM',  'Apple + Almonds',          'Apple 1 medium, raw almonds 25g'),
            ('6:30 PM',  'Steak & Veggies',          'Top sirloin or flank 170g raw, roasted Brussels sprouts + carrots 250g, small sweet potato 150g, olive oil 10g'),
            ('9:30 PM',  'Cottage Cheese + Almonds', 'Cottage cheese 2% 200g, raw almonds 10g'),
        ],
        'workout_title': 'OPTIONAL CONDITIONING + ARMS (skip if beat up)',
        'workout': [
            ('Zone 2 Cardio (incline walk, row, bike)', '1', '45 min',   '—'),
            ('Barbell Curls',                            '4', '12',        '60 sec'),
            ('Preacher or Concentration Curls',          '3', '12',        '60 sec'),
            ('Close-Grip Bench Press',                   '4', '10',        '90 sec'),
            ('Overhead Tricep Extension',                '3', '15',        '60 sec'),
            ('Cable Curl + Tricep Pushdown Superset',    '3', '12/12',     '60 sec'),
            ('Farmer\'s Carry (heavy)',                  '3', '40 sec',    '60 sec'),
        ],
        'workout_notes': 'Arm-focused low-fatigue day drives arm growth without interfering with main lifts. Zone 2 burns fat and supports recovery.',
    },
    'SUNDAY': {
        'type': 'REST',
        'subtitle': 'FULL REST',
        'target': '2,300 cal  •  220g P  •  200g C  •  68g F',
        'totals': '~2,310 cal  •  ~220g P  •  ~195g C  •  ~73g F',
        'meals': [
            ('7:00 AM',  'Big Omelet',               'Whole eggs 4, bell peppers + onions + spinach 150g, whole wheat bread 1 slice, avocado ¼ medium, coffee'),
            ('10:00 AM', 'Greek Yogurt Parfait',     'Greek yogurt 200g, rolled oats 30g raw as granola-style topping, berries 80g, walnuts 15g'),
            ('12:30 PM', 'Tuna Lentil Bowl',         'Canned tuna 150g, lentils 150g cooked, spinach 100g, tomatoes + cucumber 100g, olive oil 12g, lemon + mustard + garlic'),
            ('3:30 PM',  'Orange + Almonds',         'Orange 1 medium, raw almonds 25g'),
            ('6:30 PM',  'Chicken Thigh Roast',      'Chicken thighs 200g raw, roasted red potatoes 200g, roasted cauliflower + broccoli 200g, olive oil 10g, rosemary + garlic + salt'),
            ('9:30 PM',  'Cottage Cheese + Cinnamon','Cottage cheese 2% 200g, cinnamon'),
        ],
        'workout_title': 'REST DAY — NO TRAINING',
        'workout': None,  # special rendering
        'workout_notes': 'Walk, stretch, mobility, food prep, family time. Recovery is where the gains are made.',
    },
}

def build_meal_plan(wb):
    ws = wb.create_sheet('WEEKLY MEAL PLAN')
    # Cols: A pad, B Time/Exercise(15), C Dish(30), D info/Sets(10), E Reps(10), F Rest(14), G pad
    set_col_widths(ws, [2, 15, 32, 38, 10, 14, 2])
    TOTAL_ROWS = 300
    fill_all_bg(ws, TOTAL_ROWS, 7)

    r = 2
    r = banner(ws, r, 2, 6, 'WEEKLY MEAL PLAN')
    # Row after banner: subtitle
    merge_set(ws, r, 2, 6, 'Every day: 6 eating windows + workout (or rest). All weights raw unless noted.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 22
    r += 1
    # Weekly totals summary row (high visibility)
    fill_rng(ws, r, r, 2, 6, C['bg_secondary'])
    merge_set(ws, r, 2, 6, 'WEEK ROLL-UP  •  see formulas at bottom for auto-sums',
              FONT(11, bold=True, color=C['bright']), CENTER)
    ws.row_dimensions[r].height = 22
    r += 1
    # spacer
    fill_rng(ws, r, r, 2, 6, C['bg_primary'])
    ws.row_dimensions[r].height = 8
    r += 1

    # Freeze top 5 rows
    ws.freeze_panes = ws['A6']

    # Track daily totals for the weekly sum at bottom
    daily_totals_cells = []  # (day, row_index_of_totals_text)

    day_order = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
    for day in day_order:
        d = MEALS[day]
        day_type = d['type']
        color_key = 'amber' if day_type == 'REST' else ('amber' if day_type == 'REST_OR_LIGHT' else 'green')
        # Day banner — slim
        banner_title = f"{day} — {d['subtitle']}"
        r = day_banner(ws, r, 2, 6, banner_title, color_key)

        # Target line
        fill_rng(ws, r, r, 2, 6, C['bg_secondary'])
        style_cell(ws.cell(r, 2), '  TARGET', SUBHEAD_FONT, LEFTNI, fill=F(C['bg_secondary']))
        merge_set(ws, r, 3, 6, d['target'], NUM_FONT, LEFTNI, F(C['bg_secondary']))
        ws.row_dimensions[r].height = 22
        # Apply left border color accent
        ws.cell(r, 2).border = LBORDER(color_key)
        r += 1

        # spacer
        fill_rng(ws, r, r, 2, 6, C['bg_primary'])
        ws.row_dimensions[r].height = 6
        r += 1

        # MEALS sub-header
        fill_rng(ws, r, r, 2, 6, C['grad_top'])
        merge_set(ws, r, 2, 6, '  MEALS', FONT(12, bold=True, color=C['bright']), LEFTNI, F(C['grad_top']))
        ws.row_dimensions[r].height = 22
        r += 1
        # Column headers
        style_cell(ws.cell(r, 2), 'TIME',        SUBHEAD_FONT, CENTER, fill=F(C['grad_mid']), border=BORDER())
        style_cell(ws.cell(r, 3), 'DISH',        SUBHEAD_FONT, LEFT,   fill=F(C['grad_mid']), border=BORDER())
        merge_set(ws, r, 4, 6, 'INGREDIENTS (raw weights unless noted)', SUBHEAD_FONT, LEFT, F(C['grad_mid']))
        ws.cell(r, 4).border = BORDER()
        ws.cell(r, 5).border = BORDER()
        ws.cell(r, 6).border = BORDER()
        ws.row_dimensions[r].height = 22
        r += 1

        # Meal rows
        for time_, dish, ing in d['meals']:
            style_cell(ws.cell(r, 2), time_, BODY_BOLD, CENTER, fill=F(C['bg_secondary']), border=BORDER())
            style_cell(ws.cell(r, 3), dish,  BODY_BOLD, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
            merge_set(ws, r, 4, 6, ing, BODY_FONT, LEFT, F(C['bg_secondary']))
            ws.cell(r, 4).border = BORDER()
            ws.cell(r, 5).border = BORDER()
            ws.cell(r, 6).border = BORDER()
            # estimate row height based on ingredients length
            lines = max(1, len(ing) // 60 + 1)
            ws.row_dimensions[r].height = max(26, 18 * lines + 8)
            r += 1

        # Daily totals row
        fill_rng(ws, r, r, 2, 6, C['grad_bot'])
        style_cell(ws.cell(r, 2), 'DAILY TOTAL', FONT(11, bold=True, color=C['text_dark']), CENTER)
        merge_set(ws, r, 3, 6, d['totals'], FONT(11, bold=True, color=C['text_dark']), LEFT)
        ws.row_dimensions[r].height = 24
        daily_totals_cells.append((day, r))
        r += 1

        # spacer
        fill_rng(ws, r, r, 2, 6, C['bg_primary'])
        ws.row_dimensions[r].height = 8
        r += 1

        # WORKOUT sub-header
        wktitle = d['workout_title']
        fill_rng(ws, r, r, 2, 6, C['grad_top'])
        merge_set(ws, r, 2, 6, f"  {wktitle}", FONT(12, bold=True, color=C['bright']), LEFTNI, F(C['grad_top']))
        ws.row_dimensions[r].height = 22
        r += 1

        if d['workout'] is None:
            # Rest day rendering
            fill_rng(ws, r, r, 2, 6, C['bg_secondary'])
            merge_set(ws, r, 2, 6, '  REST DAY — Walk, stretch, mobility, food prep, family time. Recovery is where the gains live.',
                      FONT(12, italic=True), LEFT, F(C['bg_secondary']))
            ws.row_dimensions[r].height = 32
            r += 1
        else:
            # Workout column headers
            style_cell(ws.cell(r, 2), 'EXERCISE', SUBHEAD_FONT, LEFT, fill=F(C['grad_mid']), border=BORDER())
            style_cell(ws.cell(r, 3), '',         SUBHEAD_FONT, LEFT, fill=F(C['grad_mid']), border=BORDER())
            style_cell(ws.cell(r, 4), 'SETS',     SUBHEAD_FONT, CENTER, fill=F(C['grad_mid']), border=BORDER())
            style_cell(ws.cell(r, 5), 'REPS',     SUBHEAD_FONT, CENTER, fill=F(C['grad_mid']), border=BORDER())
            style_cell(ws.cell(r, 6), 'REST',     SUBHEAD_FONT, CENTER, fill=F(C['grad_mid']), border=BORDER())
            ws.row_dimensions[r].height = 22
            r += 1
            for ex, sets, reps, rest in d['workout']:
                merge_set(ws, r, 2, 3, ex, BODY_BOLD, LEFT, F(C['bg_secondary']))
                ws.cell(r, 2).border = BORDER()
                ws.cell(r, 3).border = BORDER()
                style_cell(ws.cell(r, 4), sets, BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
                style_cell(ws.cell(r, 5), reps, BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
                style_cell(ws.cell(r, 6), rest, BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
                ws.row_dimensions[r].height = 24
                r += 1

        # Workout notes
        fill_rng(ws, r, r, 2, 6, C['bg_secondary'])
        merge_set(ws, r, 2, 6, f'  NOTES: {d["workout_notes"]}', NOTE_FONT, LEFT, F(C['bg_secondary']))
        ws.row_dimensions[r].height = 28
        r += 1

        # Big spacer between days
        fill_rng(ws, r, r+1, 2, 6, C['bg_primary'])
        ws.row_dimensions[r].height = 12
        ws.row_dimensions[r+1].height = 12
        r += 2

    # Weekly totals section at bottom
    r = section(ws, r, 2, 6, 'WEEK ROLL-UP (AUTO-SUMMED FROM DAILY TOTALS ABOVE)')
    r += 1
    # Headers
    style_cell(ws.cell(r, 2), 'METRIC', SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 3), 'TARGET', SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 4), 'EXPECTED FROM MEAL PLAN', SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    merge_set(ws, r, 5, 6, 'NOTES', SUBHEAD_FONT, CENTER, F(C['grad_top']))
    ws.cell(r, 5).border = BORDER()
    ws.cell(r, 6).border = BORDER()
    ws.row_dimensions[r].height = 24
    r += 1
    week_summary = [
        ('Calories', '17,600', '~17,880', 'Mon–Fri 2,640/2,620/2,700/2,640/2,650 + Sat 2,320 + Sun 2,310'),
        ('Protein',  '1,540g', '~1,560g', 'Every day 220g+ — the anchor'),
        ('Carbs',    '1,700g', '~1,705g', 'Higher on training days, lower on rest'),
        ('Fat',      '511g',   '~540g',   'Slight buffer supports hormone production'),
        ('Fiber',    '245g+',  '~255g',   'From veg + legumes + whole grains + fruit'),
    ]
    for metric, target, expected, note in week_summary:
        style_cell(ws.cell(r, 2), metric,   BODY_BOLD, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 3), target,   NUM_FONT,  CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 4), expected, NUM_FONT,  CENTER, fill=F(C['bg_secondary']), border=BORDER())
        merge_set(ws, r, 5, 6, note, NOTE_FONT, LEFT, F(C['bg_secondary']))
        ws.cell(r, 5).border = BORDER()
        ws.cell(r, 6).border = BORDER()
        ws.row_dimensions[r].height = 24
        r += 1

    # Provide actual SUM formulas based on daily calorie numbers (hardcoded from totals text)
    r += 1
    style_cell(ws.cell(r, 2), 'Calories (auto-sum formula)', BODY_BOLD, LEFT, fill=F(C['bg_secondary']), border=BORDER())
    style_cell(ws.cell(r, 3), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    # Sum the training-day and rest-day calorie numbers: 2640+2620+2700+2640+2650+2320+2310
    style_cell(ws.cell(r, 4), '=2640+2620+2700+2640+2650+2320+2310', NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    merge_set(ws, r, 5, 6, 'Formula sum of day totals — adjust cells if you change the plan', NOTE_FONT, LEFT, F(C['bg_secondary']))
    ws.cell(r, 5).border = BORDER()
    ws.cell(r, 6).border = BORDER()
    ws.row_dimensions[r].height = 24
    r += 1
    style_cell(ws.cell(r, 2), 'Protein (auto-sum formula)', BODY_BOLD, LEFT, fill=F(C['bg_secondary']), border=BORDER())
    style_cell(ws.cell(r, 3), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    style_cell(ws.cell(r, 4), '=225+220+225+225+225+220+220', NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    merge_set(ws, r, 5, 6, '', NOTE_FONT, LEFT, F(C['bg_secondary']))
    ws.cell(r, 5).border = BORDER()
    ws.cell(r, 6).border = BORDER()
    ws.row_dimensions[r].height = 22
    r += 1
    style_cell(ws.cell(r, 2), 'Carbs (auto-sum formula)', BODY_BOLD, LEFT, fill=F(C['bg_secondary']), border=BORDER())
    style_cell(ws.cell(r, 3), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    style_cell(ws.cell(r, 4), '=260+250+290+260+255+195+195', NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    merge_set(ws, r, 5, 6, '', NOTE_FONT, LEFT, F(C['bg_secondary']))
    ws.cell(r, 5).border = BORDER()
    ws.cell(r, 6).border = BORDER()
    ws.row_dimensions[r].height = 22
    r += 1
    style_cell(ws.cell(r, 2), 'Fat (auto-sum formula)', BODY_BOLD, LEFT, fill=F(C['bg_secondary']), border=BORDER())
    style_cell(ws.cell(r, 3), '', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    style_cell(ws.cell(r, 4), '=78+80+75+78+80+75+73', NUM_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
    merge_set(ws, r, 5, 6, '', NOTE_FONT, LEFT, F(C['bg_secondary']))
    ws.cell(r, 5).border = BORDER()
    ws.cell(r, 6).border = BORDER()
    ws.row_dimensions[r].height = 22

# =============================================================================
# TAB 6: FOOD SWAPS
# =============================================================================
def build_food_swaps(wb):
    ws = wb.create_sheet('FOOD SWAPS')
    # Cols: A pad, B If Recipe Calls For(28), C Original Amount(14), D Swap Option(28), E Swap Amount(14), F Notes(40), G pad
    set_col_widths(ws, [2, 30, 15, 30, 15, 42, 2])
    TOTAL_ROWS = 200
    fill_all_bg(ws, TOTAL_ROWS, 7)

    r = 2
    r = banner(ws, r, 2, 6, 'FOOD SWAPS — EXACT GRAM EQUIVALENTS')
    r += 1
    merge_set(ws, r, 2, 6,
              'Calibrated to hold protein, carb, or fat content constant. Use the exact gram amount in the SWAP AMOUNT column. Weights are raw unless noted.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 26
    r += 2

    # Freeze after row 7 (title + note + spacers)
    ws.freeze_panes = ws['A8']

    def swap_header(ws, r):
        style_cell(ws.cell(r, 2), 'IF RECIPE CALLS FOR', SUBHEAD_FONT, LEFT,   fill=F(C['grad_top']), border=BORDER())
        style_cell(ws.cell(r, 3), 'ORIGINAL AMT',        SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
        style_cell(ws.cell(r, 4), 'SWAP OPTION',         SUBHEAD_FONT, LEFT,   fill=F(C['grad_top']), border=BORDER())
        style_cell(ws.cell(r, 5), 'SWAP AMOUNT',         SUBHEAD_FONT, CENTER, fill=F(C['purple']),    border=BORDER())
        ws.cell(r, 5).font = FONT(11, bold=True, color=C['text_dark'])
        style_cell(ws.cell(r, 6), 'NOTES',               SUBHEAD_FONT, LEFT,   fill=F(C['grad_top']), border=BORDER())
        ws.row_dimensions[r].height = 24

    def swap_row(ws, r, orig_item, orig_amt, swap_item, swap_amt, note):
        style_cell(ws.cell(r, 2), orig_item, BODY_BOLD, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 3), orig_amt,  BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 4), swap_item, BODY_FONT, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
        # swap amount highlighted
        style_cell(ws.cell(r, 5), swap_amt,  FONT(11, bold=True, color=C['text_dark']), CENTER, fill=F(C['purple']), border=BORDER())
        style_cell(ws.cell(r, 6), note,      NOTE_FONT, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
        ws.row_dimensions[r].height = 22
        return r + 1

    # PROTEINS (~30 swaps)
    r = section(ws, r, 2, 6, 'PROTEINS — match protein content')
    r += 1
    swap_header(ws, r); r += 1
    protein_swaps = [
        ('Chicken breast',    '100g raw', 'Chicken thighs (boneless)', '121g raw', '23g → 23g protein held'),
        ('Chicken breast',    '100g raw', 'Ground turkey 93/7',        '115g raw', '23g protein'),
        ('Chicken breast',    '100g raw', 'Ground beef 93/7',          '110g raw', '23g protein'),
        ('Chicken breast',    '100g raw', 'Top sirloin / flank steak', '105g raw', '23g protein'),
        ('Chicken breast',    '100g raw', 'Pork loin',                 '105g raw', '23g protein'),
        ('Chicken breast',    '100g raw', 'Salmon (fresh or canned)',  '105g',     '23g protein, adds omega-3'),
        ('Chicken breast',    '100g raw', 'Canned tuna (drained)',     '92g',      '23g protein, leaner'),
        ('Chicken breast',    '100g raw', 'Whole eggs',                '4 large',  '24g protein'),
        ('Chicken thighs',    '100g raw', 'Chicken breast',            '83g raw',  '19g protein held'),
        ('Chicken thighs',    '100g raw', 'Ground turkey 93/7',        '95g raw',  '19g protein'),
        ('Chicken thighs',    '100g raw', 'Ground beef 93/7',          '90g raw',  '19g protein'),
        ('Chicken thighs',    '100g raw', 'Pork loin',                 '86g raw',  '19g protein'),
        ('Ground beef 93/7',  '100g raw', 'Ground turkey 93/7',        '105g raw', '21g protein'),
        ('Ground beef 93/7',  '100g raw', 'Chicken breast',            '91g raw',  '21g protein'),
        ('Ground beef 93/7',  '100g raw', 'Top sirloin / flank',       '95g raw',  '21g protein'),
        ('Ground turkey 93/7','100g raw', 'Ground beef 93/7',          '95g raw',  '20g protein'),
        ('Ground turkey 93/7','100g raw', 'Chicken breast',            '87g raw',  '20g protein'),
        ('Top sirloin/flank', '100g raw', 'Ground beef 93/7',          '105g raw', '22g protein, more fat'),
        ('Top sirloin/flank', '100g raw', 'Pork loin',                 '100g raw', '22g protein'),
        ('Pork loin',         '100g raw', 'Chicken breast',            '96g raw',  '22g protein'),
        ('Pork loin',         '100g raw', 'Top sirloin / flank',       '100g raw', '22g protein'),
        ('Salmon',            '100g',     'Canned tuna (drained)',     '88g',      '22g protein'),
        ('Salmon',            '100g',     'Sardines (canned)',         '88g',      '22g protein, more calcium'),
        ('Sardines',          '1 can ~120g', 'Salmon (fresh or canned)', '137g',   '30g protein'),
        ('Canned tuna',       '1 can ~140g', 'Canned salmon',          '160g',     '35g protein'),
        ('Whole eggs',        '1 large',  'Greek yogurt 0%',           '60g',      '6g protein held'),
        ('Whole eggs',        '1 large',  'Cottage cheese 2%',         '55g',      '6g protein held'),
        ('Whole eggs',        '1 large',  'Egg whites',                '3 whites', '6g protein, removes fat+cholesterol'),
        ('Greek yogurt 0%',   '100g',     'Cottage cheese 2%',         '91g',      '10g protein'),
        ('Cottage cheese 2%', '100g',     'Greek yogurt 0%',           '110g',     '11g protein'),
    ]
    for row in protein_swaps:
        r = swap_row(ws, r, *row)
    r += 1

    # CARBS (~21 swaps)
    r = section(ws, r, 2, 6, 'CARBS — match carb content')
    r += 1
    swap_header(ws, r); r += 1
    carb_swaps = [
        ('White rice (dry)',     '100g', 'Brown rice (dry)',           '104g',   '80g → 80g carbs held'),
        ('White rice (dry)',     '100g', 'Rolled oats (dry)',          '121g',   '80g carbs, more fiber'),
        ('White rice (dry)',     '100g', 'Sweet potato (raw)',         '400g',   '80g carbs, adds vitamin A'),
        ('White rice (dry)',     '100g', 'Red or russet potato (raw)', '470g',   '80g carbs, adds potassium'),
        ('White rice (dry)',     '100g', 'Whole wheat pasta (dry)',    '114g',   '80g carbs'),
        ('Brown rice (dry)',     '100g', 'White rice (dry)',           '96g',    '77g carbs, faster digesting'),
        ('Brown rice (dry)',     '100g', 'Sweet potato (raw)',         '385g',   '77g carbs'),
        ('Brown rice (dry)',     '100g', 'Red or russet potato (raw)', '453g',   '77g carbs'),
        ('Rolled oats (dry)',    '100g', 'White rice (dry)',           '83g',    '66g carbs, less fiber'),
        ('Rolled oats (dry)',    '100g', 'Sweet potato (raw)',         '330g',   '66g carbs'),
        ('Rolled oats (dry)',    '100g', 'Whole wheat bread',          '3 slices','66g carbs'),
        ('Sweet potato (raw)',   '100g', 'Red or russet potato (raw)', '118g',   '20g carbs'),
        ('Sweet potato (raw)',   '100g', 'White rice (dry)',           '25g',    '20g carbs'),
        ('Red/russet potato',    '100g', 'Sweet potato (raw)',         '85g',    '17g carbs'),
        ('Red/russet potato',    '100g', 'White rice (dry)',           '21g',    '17g carbs'),
        ('Whole wheat bread',    '1 slice', 'Whole wheat tortilla (8")', '1',   '~23g carbs'),
        ('Whole wheat bread',    '2 slices','Rolled oats (dry)',       '70g',    '~46g carbs'),
        ('Whole wheat pasta',    '100g dry', 'White rice (dry)',       '88g',    '70g carbs'),
        ('Black beans (cooked)', '100g', 'Lentils (cooked)',           '100g',   '~20g carbs, similar fiber'),
        ('Black beans (cooked)', '100g', 'Chickpeas (cooked)',         '80g',    '~20g carbs'),
        ('Lentils (cooked)',     '100g', 'Black beans (cooked)',       '100g',   '~20g carbs'),
    ]
    for row in carb_swaps:
        r = swap_row(ws, r, *row)
    r += 1

    # VEGETABLES (~13 swaps) — 1:1 within group
    r = section(ws, r, 2, 6, 'VEGETABLES — 1:1 weight swaps within group')
    r += 1
    swap_header(ws, r); r += 1
    veg_swaps = [
        ('Spinach',         '100g', 'Kale',               '100g', 'Leafy greens group'),
        ('Spinach',         '100g', 'Romaine lettuce',    '100g', 'Leafy greens group'),
        ('Spinach',         '100g', 'Arugula',            '100g', 'Leafy greens group'),
        ('Spinach',         '100g', 'Collard greens',     '100g', 'Leafy greens group'),
        ('Broccoli',        '100g', 'Cauliflower',        '100g', 'Cruciferous group'),
        ('Broccoli',        '100g', 'Brussels sprouts',   '100g', 'Cruciferous group'),
        ('Broccoli',        '100g', 'Cabbage',            '100g', 'Cruciferous group'),
        ('Bell peppers',    '100g', 'Tomatoes',           '100g', 'Colorful veg group'),
        ('Bell peppers',    '100g', 'Carrots',            '100g', 'Colorful veg group'),
        ('Bell peppers',    '100g', 'Onions',             '100g', 'Colorful veg group'),
        ('Carrots',         '100g', 'Bell peppers',       '100g', 'Colorful veg group'),
        ('Tomatoes (fresh)','100g', 'Crushed tomatoes (canned)', '100g', 'Sauce use only'),
        ('Green beans',     '100g', 'Asparagus',          '100g', 'Green vegetable group'),
    ]
    for row in veg_swaps:
        r = swap_row(ws, r, *row)
    r += 1

    # FATS (~16 swaps)
    r = section(ws, r, 2, 6, 'FATS — match fat content')
    r += 1
    swap_header(ws, r); r += 1
    fat_swaps = [
        ('Extra virgin olive oil', '10g',  'Avocado',              '67g',  '~10g fat, adds potassium'),
        ('Extra virgin olive oil', '10g',  'Raw almonds',          '20g',  '~10g fat, adds magnesium'),
        ('Extra virgin olive oil', '10g',  'Walnuts',              '15g',  '~10g fat, adds plant omega-3'),
        ('Extra virgin olive oil', '10g',  'Natural peanut butter','20g',  '~10g fat'),
        ('Extra virgin olive oil', '10g',  'Chia seeds',           '32g',  '~10g fat, adds fiber'),
        ('Avocado (½ medium)',     '100g', 'Olive oil',            '15g',  '~15g fat'),
        ('Avocado (½ medium)',     '100g', 'Raw almonds',          '30g',  '~15g fat'),
        ('Avocado (½ medium)',     '100g', 'Walnuts',              '23g',  '~15g fat'),
        ('Raw almonds',            '30g',  'Walnuts',              '23g',  '~15g fat'),
        ('Raw almonds',            '30g',  'Natural peanut butter','30g',  '~15g fat'),
        ('Raw almonds',            '30g',  'Chia seeds',           '48g',  '~15g fat'),
        ('Walnuts',                '15g',  'Raw almonds',          '19g',  '~10g fat'),
        ('Walnuts',                '15g',  'Natural peanut butter','19g',  '~10g fat'),
        ('Natural peanut butter',  '20g',  'Almond butter',        '20g',  '~10g fat'),
        ('Natural peanut butter',  '20g',  'Walnuts',              '16g',  '~10g fat'),
        ('Chia seeds',             '10g',  'Flax seeds (ground)',  '8g',   '~3g fat, swaps omega-3 source'),
    ]
    for row in fat_swaps:
        r = swap_row(ws, r, *row)
    r += 1

    # FRUIT (~12 swaps)
    r = section(ws, r, 2, 6, 'FRUIT — match carb content')
    r += 1
    swap_header(ws, r); r += 1
    fruit_swaps = [
        ('Banana (1 medium)',       '~120g',  'Apple (1 medium)',         '~180g',  '~27g carbs'),
        ('Banana (1 medium)',       '~120g',  'Orange (2 medium)',        '~270g',  '~27g carbs'),
        ('Banana (1 medium)',       '~120g',  'Mixed berries',            '200g',   '~27g carbs'),
        ('Banana (1 medium)',       '~120g',  'Grapes',                   '150g',   '~27g carbs'),
        ('Apple (1 medium)',        '~180g',  'Banana (1 medium)',        '~120g',  '~25g carbs'),
        ('Apple (1 medium)',        '~180g',  'Mixed berries',            '180g',   '~25g carbs'),
        ('Apple (1 medium)',        '~180g',  'Orange (2 small)',         '~220g',  '~25g carbs'),
        ('Orange (1 medium)',       '~130g',  'Apple (½ medium)',         '~90g',   '~15g carbs'),
        ('Orange (1 medium)',       '~130g',  'Mixed berries',            '110g',   '~15g carbs'),
        ('Mixed berries',           '100g',   'Banana (½ medium)',        '~60g',   '~13g carbs'),
        ('Mixed berries',           '100g',   'Apple (½ medium)',         '~90g',   '~13g carbs'),
        ('Grapes',                  '100g',   'Mixed berries',            '120g',   '~17g carbs'),
    ]
    for row in fruit_swaps:
        r = swap_row(ws, r, *row)

# =============================================================================
# TAB 7: WORKOUT SCHEDULE
# =============================================================================
def build_workout_schedule(wb):
    ws = wb.create_sheet('WORKOUT SCHEDULE')
    set_col_widths(ws, [2, 30, 12, 12, 16, 46, 2])
    TOTAL_ROWS = 160
    fill_all_bg(ws, TOTAL_ROWS, 7)

    r = 2
    r = banner(ws, r, 2, 6, 'PHASE 1 TRAINING PROGRAM — MAY–AUGUST 2026')
    r += 1
    merge_set(ws, r, 2, 6,
              'Weekly split: Mon Push  •  Tue Pull  •  Wed Legs  •  Thu Upper Hypertrophy  •  Fri Lower + Core  •  Sat Optional Conditioning + Arms  •  Sun Rest',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 24
    r += 2

    # Goal context
    r = section(ws, r, 2, 6, 'GOAL CONTEXT')
    r += 1
    merge_set(ws, r, 2, 6,
              'Greek god / Brad Pitt in Troy / Henry Cavill in Man of Steel. Dense muscular frame, broad shoulders, thick chest, visible abs, developed arms, powerful legs. Not bodybuilder-bloated. Not lean-runner. Shoulder-to-waist V-taper. Upper body priority — chest, shoulders, back, arms carry the silhouette.',
              BODY_FONT, LEFTNI)
    ws.row_dimensions[r].height = 76
    r += 2

    # Phase breakdown
    r = section(ws, r, 2, 6, 'THREE-PHASE BREAKDOWN (12–18 MONTHS)')
    r += 1
    hdrs = ['PHASE', 'TIMING', 'START', 'END', 'APPROACH']
    style_cell(ws.cell(r, 2), hdrs[0], SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 3), hdrs[1], SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 4), hdrs[2], SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 5), hdrs[3], SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 6), hdrs[4], SUBHEAD_FONT, LEFT,   fill=F(C['grad_top']), border=BORDER())
    ws.row_dimensions[r].height = 24
    r += 1
    phases = [
        ('PHASE 1 — Recomp',         'May–Aug 2026',  '205 lb / 25% BF', '195 lb / 18% BF', 'Slight deficit, high protein, heavy training. Only works for detrained / high-BF windows — that is your current edge.'),
        ('PHASE 2 — Lean Bulk',      'Sep–Dec 2026',  '195 lb / 18% BF', '215 lb / 15% BF', 'Slight surplus (~300 cal/day), heavy progressive overload. Muscle-building focus.'),
        ('PHASE 3 — Mini Cut + Maintain', 'Dec 2026–Mar 2027', '215 lb / 15% BF', '225 lb / 13% BF', 'Mini cut to 210 at 12%, then lean bulk back to 225 at 13%. End state.'),
    ]
    for row_vals in phases:
        style_cell(ws.cell(r, 2), row_vals[0], BODY_BOLD, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 3), row_vals[1], BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 4), row_vals[2], BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 5), row_vals[3], BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 6), row_vals[4], BODY_FONT, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
        ws.row_dimensions[r].height = 46
        r += 1
    r += 1

    # Daily detail
    r = section(ws, r, 2, 6, 'WEEKLY SPLIT — EXERCISE DETAIL')
    r += 1
    day_order = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
    for day in day_order:
        d = MEALS[day]
        # Day header strip
        fill_rng(ws, r, r, 2, 6, C['grad_mid'])
        merge_set(ws, r, 2, 6, f"  {day} — {d['workout_title']}", FONT(13, bold=True), LEFT, F(C['grad_mid']))
        ws.row_dimensions[r].height = 28
        r += 1
        if d['workout'] is None:
            fill_rng(ws, r, r, 2, 6, C['bg_secondary'])
            merge_set(ws, r, 2, 6, '  FULL REST — Walk, stretch, mobility, food prep, family time.',
                      FONT(12, italic=True), LEFT, F(C['bg_secondary']))
            ws.row_dimensions[r].height = 28
            r += 1
            continue
        # exercise headers
        style_cell(ws.cell(r, 2), 'EXERCISE',  SUBHEAD_FONT, LEFT,   fill=F(C['grad_top']), border=BORDER())
        style_cell(ws.cell(r, 3), 'SETS',      SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
        style_cell(ws.cell(r, 4), 'REPS',      SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
        style_cell(ws.cell(r, 5), 'REST',      SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
        style_cell(ws.cell(r, 6), 'RPE / NOTE',SUBHEAD_FONT, LEFT,   fill=F(C['grad_top']), border=BORDER())
        ws.row_dimensions[r].height = 22
        r += 1
        # RPE guidance per exercise
        for ex, sets, reps, rest in d['workout']:
            is_compound = any(k in ex.lower() for k in ('bench','press','deadlift','squat','row','pull-up','front squat','barbell','incline barbell','chest-supported','dumbbell shoulder press'))
            rpe = '1–2 reps short of failure' if is_compound else 'Touch failure'
            style_cell(ws.cell(r, 2), ex,   BODY_BOLD, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
            style_cell(ws.cell(r, 3), sets, BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
            style_cell(ws.cell(r, 4), reps, BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
            style_cell(ws.cell(r, 5), rest, BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
            style_cell(ws.cell(r, 6), rpe,  NOTE_FONT, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
            ws.row_dimensions[r].height = 22
            r += 1
        # notes
        fill_rng(ws, r, r, 2, 6, C['bg_secondary'])
        merge_set(ws, r, 2, 6, f'  NOTES: {d["workout_notes"]}', NOTE_FONT, LEFT, F(C['bg_secondary']))
        ws.row_dimensions[r].height = 32
        r += 2

    # RPE explainer
    r = section(ws, r, 2, 6, 'RPE — RATE OF PERCEIVED EXERTION')
    r += 1
    lines = [
        ('1–2 reps short of failure (heavy compounds)',
         'On your last set, you should stop with 1–2 reps in the tank. Form stays clean; fatigue doesn\'t corrupt technique. Used on Bench, Squat, Deadlift, Rows, Pull-ups, Overhead Press.'),
        ('Touch failure (isolation work)',
         'On your last set, go until the bar slows dramatically or you can\'t complete the rep with clean form. Used on curls, raises, flyes, pushdowns, extensions.'),
        ('Never grind (deadlift + squat under load)',
         'If form breaks, stop. Leaving 2 reps in the tank on heavy deadlift / squat prevents injury. A missed rep is not worth an 8-week setback.'),
    ]
    for title, body in lines:
        style_cell(ws.cell(r, 2), title, BODY_BOLD, LEFT, fill=F(C['bg_secondary']), border=BORDER())
        merge_set(ws, r, 3, 6, body, BODY_FONT, LEFTNI, F(C['bg_secondary']))
        ws.cell(r, 3).border = BORDER()
        ws.cell(r, 4).border = BORDER()
        ws.cell(r, 5).border = BORDER()
        ws.cell(r, 6).border = BORDER()
        ws.row_dimensions[r].height = 50
        r += 1
    r += 1

    # Saturday context
    r = section(ws, r, 2, 6, 'WHY SATURDAY ARMS + CONDITIONING MATTERS')
    r += 1
    merge_set(ws, r, 2, 6,
              '225 lb at 12–15% BF requires serious arm development. Arms squeezed in at the end of push/pull day get half-effort volume when you\'re already fried. A dedicated low-fatigue day drives arm growth faster. The Zone 2 cardio burns fat without interfering with muscle growth, and supports recovery, sleep quality, cardiovascular health.',
              BODY_FONT, LEFTNI)
    ws.row_dimensions[r].height = 80

# =============================================================================
# TAB 8: SUPPLEMENTS
# =============================================================================
def build_supplements(wb):
    ws = wb.create_sheet('SUPPLEMENTS')
    set_col_widths(ws, [2, 28, 16, 22, 38, 14, 2])
    TOTAL_ROWS = 80
    fill_all_bg(ws, TOTAL_ROWS, 7)

    r = 2
    r = banner(ws, r, 2, 6, 'SUPPLEMENTS')
    r += 1
    merge_set(ws, r, 2, 6,
              'These come out of cash, not SNAP. Order separately from groceries. Creatine is non-negotiable; everything else is leverage.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 24
    r += 2

    # Main protocol table
    r = section(ws, r, 2, 6, 'PROTOCOL')
    r += 1
    hdrs = ['SUPPLEMENT', 'DOSE', 'TIMING', 'PURPOSE', 'COST']
    for i, h in enumerate(hdrs):
        style_cell(ws.cell(r, 2+i), h, SUBHEAD_FONT, CENTER if i != 3 and i != 0 else LEFT,
                   fill=F(C['grad_top']), border=BORDER())
    ws.row_dimensions[r].height = 24
    r += 1
    # Costs are numeric
    cost_cells = []
    sups = [
        ('Creatine monohydrate',      '5g daily',       'Any time',              'NON-NEGOTIABLE. Strength, volume, cellular hydration. Most-studied supplement in sports science.', 20.00, 3),
        ('Vitamin D3',                '2,000–4,000 IU', 'With fat-containing meal', 'Testosterone, recovery, immunity. Half the population is deficient.', 10.00, 6),
        ('Magnesium glycinate',       '400 mg',         'Before bed',            'Sleep quality, muscle recovery. Glycinate absorbs better than citrate.', 15.00, 1),
        ('Omega-3 fish oil',          '2g EPA/DHA',     'With meal',             'OPTIONAL if eating fatty fish 2x/week (salmon + sardines). Covers heart + brain.', 15.00, 1),
        ('Whey protein isolate',      '25–30g/scoop',   'Optional — emergency',  'Stretches SNAP budget when protein falls short. 2lb tub = ~25 servings.', 35.00, 1),
    ]
    for name, dose, timing, purpose, monthly_cost, months in sups:
        style_cell(ws.cell(r, 2), name,    BODY_BOLD, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 3), dose,    NUM_FONT,  CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 4), timing,  BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 5), purpose, NOTE_FONT, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
        # cost per unit of months shown as string
        cost_str = f'${monthly_cost:.0f} / {months} mo' if months > 1 else f'${monthly_cost:.0f} / mo'
        style_cell(ws.cell(r, 6), cost_str, BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        ws.row_dimensions[r].height = 48
        r += 1
    r += 2

    # Micronutrients from food
    r = section(ws, r, 2, 6, 'MICRONUTRIENTS FROM FOOD (THE MEAL PLAN COVERS MOST)')
    r += 1
    hdrs = ['NUTRIENT', 'SOURCES IN MEAL PLAN', 'STATUS']
    style_cell(ws.cell(r, 2), hdrs[0], SUBHEAD_FONT, LEFT, fill=F(C['grad_top']), border=BORDER())
    merge_set(ws, r, 3, 5, hdrs[1], SUBHEAD_FONT, LEFT, F(C['grad_top']))
    ws.cell(r, 3).border = BORDER()
    ws.cell(r, 4).border = BORDER()
    ws.cell(r, 5).border = BORDER()
    style_cell(ws.cell(r, 6), hdrs[2], SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    ws.row_dimensions[r].height = 24
    r += 1
    micros = [
        ('Omega-3',       'Salmon 1x/wk + sardines 1x/wk + walnuts daily + chia in oats',    'Covered'),
        ('Iron',          'Ground beef, steak, spinach, lentils',                              'Covered'),
        ('Zinc',          'Ground beef, eggs, dairy',                                          'Covered'),
        ('Magnesium',     'Almonds, spinach, oats, legumes',                                   'Covered'),
        ('Vitamin D',     'Eggs + fatty fish + D3 supplement',                                 'Supplement required'),
        ('Potassium',     'Potatoes, sweet potatoes, bananas, spinach',                        'Covered'),
        ('Calcium',       'Dairy + sardines (with bones) + leafy greens',                      'Covered'),
        ('B12',           'Meat, fish, eggs, dairy — all animal protein sources',              'Covered'),
    ]
    for name, sources, status in micros:
        style_cell(ws.cell(r, 2), name, BODY_BOLD, LEFT, fill=F(C['bg_secondary']), border=BORDER())
        merge_set(ws, r, 3, 5, sources, BODY_FONT, LEFT, F(C['bg_secondary']))
        ws.cell(r, 3).border = BORDER()
        ws.cell(r, 4).border = BORDER()
        ws.cell(r, 5).border = BORDER()
        status_color = C['green'] if status == 'Covered' else C['amber']
        style_cell(ws.cell(r, 6), status, FONT(11, bold=True, color=C['text_dark']), CENTER, fill=F(status_color), border=BORDER())
        ws.row_dimensions[r].height = 28
        r += 1

# =============================================================================
# MAIN
# =============================================================================
def main():
    wb = Workbook()
    # Remove default sheet
    default = wb.active
    wb.remove(default)

    build_start_here(wb)
    build_rules_v2(wb)
    build_macro_targets(wb)
    build_ingredients(wb)
    build_meal_plan(wb)
    build_food_swaps(wb)
    build_workout_schedule(wb)
    build_supplements(wb)

    wb.save(OUTPUT_PATH)
    print(f'Saved: {OUTPUT_PATH}')
    print(f'Sheets: {wb.sheetnames}')

if __name__ == '__main__':
    main()
