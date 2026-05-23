"""Apply corrections to Dan's Phase 1 Integrated Workbook in place.

1. Rebuild INGREDIENTS & SHOPPING tab with DAILY INGREDIENT GRID (critical fix)
2. Apply background fill to every non-merged cell
3. Update MACRO TARGETS delta + running avg formulas to IFERROR-wrapped form
4. Verify freeze panes
5. Verify no stale 'Brett'/'Dan's job' language
"""
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.cell.cell import MergedCell

PATH = r"C:\Users\iAmiK\Downloads\Dan_Phase1_Integrated_Workbook.xlsx"

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
    return Font(name='Calibri', size=size, bold=bold, italic=italic, color=color or C['text'])
def BORDER():
    s = Side(style='thin', color=C['border'])
    return Border(left=s, right=s, top=s, bottom=s)

TITLE_FONT   = FONT(18, bold=True)
HEADER_FONT  = FONT(13, bold=True)
SUBHEAD_FONT = FONT(11, bold=True, color=C['bright'])
BODY_FONT    = FONT(11)
BODY_BOLD    = FONT(11, bold=True)
NOTE_FONT    = FONT(10, italic=True, color=C['text_dim'])
NUM_FONT     = FONT(11, bold=True, color=C['bright'])

CENTER = Alignment(horizontal='center', vertical='center', wrap_text=True)
LEFT   = Alignment(horizontal='left',   vertical='center', wrap_text=True, indent=1)
LEFTNI = Alignment(horizontal='left',   vertical='center', wrap_text=True)

def fill_rng(ws, r1, r2, c1, c2, color):
    f = F(color)
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            cell = ws.cell(row=r, column=c)
            if not isinstance(cell, MergedCell):
                cell.fill = f

def fill_all_bg(ws, rows, cols, color=None):
    color = color or C['bg_primary']
    fill_rng(ws, 1, rows, 1, cols, color)
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
    fill_rng(ws, row, row, c1, c2, C['grad_top'])
    ws.row_dimensions[row].height = 10
    fill_rng(ws, row+1, row+1, c1, c2, C['grad_mid'])
    ws.row_dimensions[row+1].height = 38
    merge_set(ws, row+1, c1, c2, title, TITLE_FONT, CENTER)
    fill_rng(ws, row+2, row+2, c1, c2, C['grad_bot'])
    ws.row_dimensions[row+2].height = 10
    return row + 3

def section(ws, row, c1, c2, title):
    fill_rng(ws, row, row, c1, c2, C['grad_top'])
    ws.row_dimensions[row].height = 6
    fill_rng(ws, row+1, row+1, c1, c2, C['grad_mid'])
    ws.row_dimensions[row+1].height = 26
    merge_set(ws, row+1, c1, c2, title, HEADER_FONT, LEFT)
    return row + 2

def set_col_widths(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

def style_cell(cell, value=None, font=None, align=None, fill=None, border=None):
    if isinstance(cell, MergedCell):
        return cell
    if value is not None: cell.value = value
    if font is not None: cell.font = font
    if align is not None: cell.alignment = align
    if fill is not None: cell.fill = fill
    if border is not None: cell.border = border
    return cell

# =============================================================================
# INGREDIENTS & SHOPPING — full rebuild with daily grid
# =============================================================================
def rebuild_ingredients(wb):
    # Cols: A pad | B item(30) | C-I days/weekly/used-for-merged(10 each) | J buy?/weekly(12) | K pad
    # Layout allows both top table and daily grid to share columns
    # Top table:   B=Item | C=Weekly | D=Cost | E-I merged=Used For | J=Buy?
    # Daily grid:  B=Item | C=MON | D=TUE | E=WED | F=THU | G=FRI | H=SAT | I=SUN | J=WEEKLY

    idx = wb.sheetnames.index('INGREDIENTS & SHOPPING')
    del wb['INGREDIENTS & SHOPPING']
    ws = wb.create_sheet('INGREDIENTS & SHOPPING', idx)

    set_col_widths(ws, [2, 30, 11, 11, 11, 11, 11, 11, 11, 13, 2])
    TOTAL_ROWS = 220
    fill_all_bg(ws, TOTAL_ROWS, 11)

    r = 2
    r = banner(ws, r, 2, 10, 'WEEKLY INGREDIENTS & SHOPPING')
    r += 1
    merge_set(ws, r, 2, 10,
              'Grocery order: Produce → Meat & Seafood → Dairy & Eggs → Frozen → Pantry → Oils & Condiments. Raw weights unless noted. Daily grid below shows exact amounts per day.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 24
    r += 2

    cost_cells = []

    def header_row(ws, r):
        style_cell(ws.cell(r, 2),  'ITEM',      SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
        style_cell(ws.cell(r, 3),  'WEEKLY',    SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
        style_cell(ws.cell(r, 4),  'COST',      SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
        merge_set(ws, r, 5, 9, 'USED FOR', SUBHEAD_FONT, CENTER, F(C['grad_top']))
        for c in range(5, 10):
            ws.cell(r, c).border = BORDER()
        style_cell(ws.cell(r, 10), 'BUY?',      SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
        ws.row_dimensions[r].height = 24
        return r + 1

    def item_row(ws, r, name, weekly, used_for, cost):
        style_cell(ws.cell(r, 2),  name,    BODY_BOLD, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 3),  weekly,  NUM_FONT,  CENTER, fill=F(C['bg_secondary']), border=BORDER())
        if cost is None:
            style_cell(ws.cell(r, 4), '—', BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        else:
            style_cell(ws.cell(r, 4), cost, BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
            ws.cell(r, 4).number_format = '"$"#,##0.00'
            cost_cells.append(r)
        merge_set(ws, r, 5, 9, used_for, NOTE_FONT, LEFT, F(C['bg_secondary']))
        for c in range(5, 10):
            ws.cell(r, c).border = BORDER()
        style_cell(ws.cell(r, 10), '[ ]',  FONT(11, color=C['bright']), CENTER, fill=F(C['bg_secondary']), border=BORDER())
        ws.row_dimensions[r].height = 26
        return r + 1

    # --- PRODUCE ---
    r = section(ws, r, 2, 10, 'PRODUCE')
    r = header_row(ws, r)
    for item, wk, used, cost in [
        ('Spinach (fresh or frozen)',  '500g',    'Mon dinner, Wed dinner, Fri dinner, Sat omelet, Sun omelet', 3.00),
        ('Kale or collard greens',     '200g',    'Fri dinner (rotate with spinach)', 1.50),
        ('Broccoli (fresh or frozen)', '500g',    'Mon lunch, Tue dinner, Fri dinner, Sun dinner', 2.50),
        ('Cauliflower',                 '200g',    'Sun dinner (shared with broccoli)', 1.50),
        ('Bell peppers (mixed)',        '500g',    'Tue lunch, Thu lunch, Thu breakfast, Sat lunch, Sun omelet', 3.50),
        ('Carrots',                     '200g',    'Fri dinner (shared), Sat dinner (shared)', 1.00),
        ('Tomatoes (fresh)',            '300g',    'Tue garnish, Fri breakfast, Sat salad, Sun lunch', 2.00),
        ('Onions',                      '300g',    'Mon dinner, Tue lunch, Thu lunch, Sun omelet base', 1.50),
        ('Garlic',                      '2 heads', 'Everywhere — base flavor', 1.00),
        ('Mixed salad greens',          '200g',    'Sat lunch chicken salad bowl', 2.50),
        ('Sweet potatoes',              '900g',    'Mon, Tue, Fri dinners + Sat dinner small', 3.50),
        ('Red or russet potatoes',      '500g',    'Wed lunch, Sun dinner', 2.00),
        ('Avocados',                    '3 whole', 'Tue, Wed, Thu, Fri, Sat, Sun (fractions)', 3.00),
        ('Bananas',                     '7 whole', 'Pre-workout carb daily, breakfast oats', 2.00),
        ('Apples',                      '4 whole', 'Mon / Tue / Thu / Sat snacks', 3.00),
        ('Oranges',                     '2 whole', 'Sun snack + flex', 1.00),
        ('Lemons',                      '4 whole', 'Flavor for everything', 1.50),
    ]:
        r = item_row(ws, r, item, wk, used, cost)
    r += 1

    # --- MEAT & SEAFOOD ---
    r = section(ws, r, 2, 10, 'MEAT & SEAFOOD')
    r = header_row(ws, r)
    for item, wk, used, cost in [
        ('Chicken breast (raw)',       '600g', 'Mon lunch, Thu burrito, Sat salad', 4.50),
        ('Chicken thighs (boneless)',  '560g', 'Wed lunch, Fri dinner, Sun roast',  4.00),
        ('Ground beef 93/7 (raw)',     '170g', 'Mon dinner',                         2.50),
        ('Ground turkey 93/7 (raw)',   '360g', 'Tue lunch, Thu dinner pasta',        4.00),
        ('Top sirloin or flank steak', '340g', 'Wed dinner, Sat dinner',             8.00),
        ('Pork loin (raw)',            '180g', 'Fri lunch',                          2.50),
        ('Fresh salmon (or canned)',   '170g', 'Tue dinner',                         3.50),
    ]:
        r = item_row(ws, r, item, wk, used, cost)
    r += 1

    # --- DAIRY & EGGS ---
    r = section(ws, r, 2, 10, 'DAIRY & EGGS')
    r = header_row(ws, r)
    for item, wk, used, cost in [
        ('Whole eggs, large',   '21 eggs + 3 whites', 'Breakfasts daily + Wed egg whites',      6.00),
        ('Greek yogurt 0%',     '1,250g',             'Daily snacks + breakfasts + parfaits',   7.00),
        ('Cottage cheese 2%',   '1,400g',             'Pre-bed snack — every night',            5.50),
    ]:
        r = item_row(ws, r, item, wk, used, cost)
    r += 1

    # --- FROZEN ---
    r = section(ws, r, 2, 10, 'FROZEN')
    r = header_row(ws, r)
    for item, wk, used, cost in [
        ('Frozen mixed berries',        '500g', 'Oats, yogurt, pre-bed snacks',          4.00),
        ('Frozen spinach (optional)',   '200g', 'Cheaper than fresh, same nutrients',    1.50),
        ('Frozen broccoli (optional)',  '200g', 'Dinner veg substitute',                  1.50),
    ]:
        r = item_row(ws, r, item, wk, used, cost)
    r += 1

    # --- PANTRY & DRY GOODS ---
    r = section(ws, r, 2, 10, 'PANTRY & DRY GOODS')
    r = header_row(ws, r)
    for item, wk, used, cost in [
        ('Rolled oats',                '280g dry',        'Breakfast Mon/Wed/Thu/Sun',      1.50),
        ('White rice (jasmine)',       '275g dry',        'Mon lunch, Wed + Fri',           1.50),
        ('Brown rice',                 '150g dry',        'Tue lunch, Thu burrito bowl',    1.00),
        ('Whole wheat pasta',          '80g dry',         'Thu dinner',                     0.75),
        ('Whole wheat bread',          '6 slices',        'Tue, Fri, Sat, Sun breakfasts',  2.00),
        ('Canned sardines',            '1 can',           'Fri breakfast — omega-3',        1.50),
        ('Canned tuna (water-packed)', '3 cans',          'Tue, Wed, Sun',                  4.50),
        ('Canned salmon (optional)',   '1 can',           'Alt to fresh salmon',            3.00),
        ('Black beans (canned)',       '1 can',           'Thu burrito bowl',               1.00),
        ('Lentils (canned or dry)',    '1 can or 60g',    'Sun lunch',                      1.00),
        ('Chickpeas (canned)',         '1 can',           'Sat salad',                      1.00),
        ('Crushed tomatoes (canned)',  '1 can (150g)',    'Thu pasta sauce',                1.50),
        ('Natural peanut butter',      '~95g',            'Mon, Wed, Thu, Fri snacks',      1.50),
        ('Raw almonds',                '145g',            'Daily snack component',          3.50),
        ('Walnuts',                    '60g',             'Mon/Wed/Thu/Sun pre-bed snack',  2.00),
        ('Chia seeds',                 '25g',             'Oats, pre-bed snacks',           1.00),
        ('Honey (optional)',           '10g',             'Yogurt / oats drizzle',          1.00),
        ('Cinnamon',                   'small jar',       'Cottage cheese, oats, yogurt',   1.00),
    ]:
        r = item_row(ws, r, item, wk, used, cost)
    r += 1

    # --- OILS & CONDIMENTS ---
    r = section(ws, r, 2, 10, 'OILS & CONDIMENTS')
    r = header_row(ws, r)
    for item, wk, used, cost in [
        ('Extra virgin olive oil',       '236 ml (8 oz)',  'Every cooking + dressing',                4.00),
        ('Soy sauce',                    'small bottle',   'Fri pork, seasoning',                      1.00),
        ('Apple cider vinegar',          'small bottle',   'Dressings',                                1.00),
        ('Mustard',                      'small jar',      'Tuna crackers, salads',                    1.00),
        ('Hot sauce',                    'small bottle',   'Zero-cal flavor',                          1.00),
        ('Spices (garlic, paprika, cumin, chili, Italian)', 'stock', 'Every meal — restock monthly', None),
        ('Salt & black pepper',          'stock',          'Every meal',                               None),
    ]:
        r = item_row(ws, r, item, wk, used, cost)
    r += 2

    # --- Total cost row ---
    fill_rng(ws, r, r, 2, 10, C['gold'])
    style_cell(ws.cell(r, 2), 'WEEKLY TOTAL COST', FONT(13, bold=True, color=C['text_dark']), LEFT)
    style_cell(ws.cell(r, 3), '', FONT(13, bold=True, color=C['text_dark']), CENTER)
    cost_refs = ','.join(f'D{rn}' for rn in cost_cells)
    style_cell(ws.cell(r, 4), f'=SUM({cost_refs})', FONT(13, bold=True, color=C['text_dark']), CENTER)
    ws.cell(r, 4).number_format = '"$"#,##0.00'
    merge_set(ws, r, 5, 10, 'Estimates only — adjust to local prices. Dairy, meat, produce flex with sales.',
              FONT(10, italic=True, color=C['text_dark']), LEFT)
    ws.row_dimensions[r].height = 30
    r += 2

    # --- Pantry staples note ---
    r = section(ws, r, 2, 10, 'PANTRY STAPLES (MONTHLY — BUY WHEN LOW)')
    r += 1
    merge_set(ws, r, 2, 10,
              'Olive oil (32 oz), peanut butter (16 oz), spices refill, soy sauce, hot sauce, salt + pepper, canned goods buffer stock.',
              NOTE_FONT, LEFTNI)
    ws.row_dimensions[r].height = 28
    r += 2

    # --- Batch cook guide ---
    r = section(ws, r, 2, 10, 'BATCH-COOK GUIDE (MONDAY PREP)')
    r += 1
    style_cell(ws.cell(r, 2),  'ITEM',    SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 3),  'METHOD',  SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    merge_set(ws, r, 4, 5, 'METHOD (cont)', SUBHEAD_FONT, CENTER, F(C['grad_top']))
    ws.cell(r, 4).border = BORDER(); ws.cell(r, 5).border = BORDER()
    style_cell(ws.cell(r, 6),  'TIME',    SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    style_cell(ws.cell(r, 7),  'YIELDS',  SUBHEAD_FONT, CENTER, fill=F(C['grad_top']), border=BORDER())
    merge_set(ws, r, 8, 10, 'STORAGE',    SUBHEAD_FONT, CENTER, F(C['grad_top']))
    ws.cell(r, 8).border = BORDER(); ws.cell(r, 9).border = BORDER(); ws.cell(r, 10).border = BORDER()
    ws.row_dimensions[r].height = 24
    r += 1
    batch = [
        ('Chicken breast',     'Bake 400°F, salt+pepper+paprika, flip halfway', '25 min', '~450g cooked from 600g raw', 'Fridge 4 days, freeze 3 mo'),
        ('Chicken thighs',     'Roast 425°F on sheet pan w/ olive oil',         '35 min', '~420g cooked from 560g raw', 'Fridge 4 days, freeze 3 mo'),
        ('Ground turkey/beef', 'Brown in skillet, season as you go',            '15 min', '~1.5:1 raw:cooked ratio',    'Fridge 3 days, freeze 2 mo'),
        ('Rice (white/brown)', 'Rice cooker or pot, 1:2 rice:water',            '20 / 45 min', '~3x dry weight cooked',  'Fridge 5 days, freeze 2 mo'),
        ('Overnight oats',     'Soak rolled oats in water/milk overnight',      'Overnight', 'Grab-and-go',              'Fridge 3 days'),
        ('Sweet potatoes',     'Cube, toss w/ olive oil, roast 425°F',          '30 min', '~900g roasted',              'Fridge 5 days'),
        ('Hard boiled eggs',   '10 min boil, ice bath, peel',                   '15 min', '6–12 at a time',             'Fridge 7 days'),
        ('Roasted veg',        'Sheet pan mixed veg, olive oil + salt, 425°F',  '25 min', 'Fills two containers',       'Fridge 4 days'),
    ]
    for item, method, time_, yields, storage in batch:
        style_cell(ws.cell(r, 2), item,    BODY_BOLD, LEFT,   fill=F(C['bg_secondary']), border=BORDER())
        merge_set(ws, r, 3, 5, method, BODY_FONT, LEFT, F(C['bg_secondary']))
        ws.cell(r, 3).border = BORDER(); ws.cell(r, 4).border = BORDER(); ws.cell(r, 5).border = BORDER()
        style_cell(ws.cell(r, 6), time_,   BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        style_cell(ws.cell(r, 7), yields,  BODY_FONT, CENTER, fill=F(C['bg_secondary']), border=BORDER())
        merge_set(ws, r, 8, 10, storage, BODY_FONT, LEFT, F(C['bg_secondary']))
        ws.cell(r, 8).border = BORDER(); ws.cell(r, 9).border = BORDER(); ws.cell(r, 10).border = BORDER()
        ws.row_dimensions[r].height = 32
        r += 1
    r += 2

    # =========================================================================
    # DAILY INGREDIENT GRID — THE CRITICAL FIX
    # =========================================================================
    r = banner(ws, r, 2, 10, 'DAILY INGREDIENT GRID — EXACT AMOUNTS PER DAY')
    r += 1
    merge_set(ws, r, 2, 10,
              'Exact raw amounts per day, derived from the actual meal plan. Pull these out of the fridge/pantry each morning. Empty cell = not used that day.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 28
    r += 2

    # Column headers for the grid
    grid_hdr_row = r
    headers = ['INGREDIENT', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', 'WEEKLY']
    for i, h in enumerate(headers):
        col = 2 + i
        fill_color = C['grad_mid'] if i > 0 and i < 8 else C['grad_top']
        style_cell(ws.cell(r, col), h, SUBHEAD_FONT, CENTER, fill=F(fill_color), border=BORDER())
    ws.row_dimensions[r].height = 26
    r += 1

    def grid_category(r, label):
        """Insert a category header spanning the full grid width."""
        fill_rng(ws, r, r, 2, 10, C['grad_top'])
        ws.row_dimensions[r].height = 6
        fill_rng(ws, r+1, r+1, 2, 10, C['grad_mid'])
        ws.row_dimensions[r+1].height = 26
        merge_set(ws, r+1, 2, 10, label, FONT(12, bold=True), LEFT)
        return r + 2

    def grid_row(r, data, alt=False):
        """Data row for the grid. data = [item, mon, tue, wed, thu, fri, sat, sun, weekly]."""
        bg = C['bg_secondary'] if alt else C['bg_primary']
        # Item
        style_cell(ws.cell(r, 2), data[0], BODY_BOLD, LEFT, fill=F(C['bg_secondary']), border=BORDER())
        # Days
        for i, val in enumerate(data[1:8]):
            display = val if val else '—'
            color = C['text'] if val else C['text_dim']
            style_cell(ws.cell(r, 3+i), display,
                       FONT(11, color=color),
                       CENTER, fill=F(bg), border=BORDER())
        # Weekly (highlight)
        style_cell(ws.cell(r, 10), data[8], FONT(11, bold=True, color=C['bright']), CENTER, fill=F(C['grad_top']), border=BORDER())
        ws.row_dimensions[r].height = 22
        return r + 1

    # PROTEINS
    r = grid_category(r, 'PROTEINS')
    proteins = [
        ('Chicken breast (raw)',        '200g', '',    '',     '200g', '',    '200g', '',    '600g'),
        ('Chicken thighs (raw)',        '',    '',    '180g',  '',    '180g', '',    '200g', '560g'),
        ('Ground beef 93/7 (raw)',      '170g',  '',    '',     '',    '',    '',    '',    '170g'),
        ('Ground turkey 93/7 (raw)',    '',    '180g','',      '180g','',    '',    '',    '360g'),
        ('Top sirloin or flank (raw)',  '',    '',    '170g',  '',    '',    '170g','',    '340g'),
        ('Pork loin (raw)',             '',    '',    '',      '',    '180g','',    '',    '180g'),
        ('Salmon (canned or fresh)',    '',    '170g','',      '',    '',    '',    '',    '170g'),
        ('Canned sardines',             '',    '',    '',      '',    '1 can (~120g)','',    '',    '120g'),
        ('Canned tuna (drained)',       '',    '120g','80g',   '',    '',    '',    '150g','350g'),
        ('Whole eggs (large)',          '3',   '3',   '2 + 3 whites','3','2','4','4',   '21 + 3 w'),
        ('Greek yogurt 0%',             '200g','150g','200g', '100g','200g','200g','200g','1,250g'),
        ('Cottage cheese 2%',           '200g','200g','200g', '200g','200g','200g','200g','1,400g'),
    ]
    for i, row in enumerate(proteins):
        r = grid_row(r, row, alt=(i % 2 == 1))

    # CARBS
    r = grid_category(r, 'CARBS')
    carbs = [
        ('Rolled oats (dry)',           '80g', '',    '90g',   '60g', '20g', '',    '30g', '280g'),
        ('White rice (dry)',            '75g', '',    '50+75g','',   '75g', '',    '',    '275g'),
        ('Brown rice (dry)',            '',    '75g', '',      '75g', '',    '',    '',    '150g'),
        ('Whole wheat pasta (dry)',     '',    '',    '',      '80g', '',    '',    '',    '80g'),
        ('Whole wheat bread (slices)',  '',    '2',   '',      '',    '2',   '1',   '1',   '6'),
        ('Sweet potato (raw)',          '250g','250g','',      '',    '250g','150g','',    '900g'),
        ('Red / russet potato (raw)',   '',    '',    '300g',  '',    '',    '',    '200g','500g'),
        ('Black beans (cooked)',        '',    '',    '',      '100g','',    '',    '',    '100g'),
        ('Lentils (cooked)',            '',    '',    '',      '',    '',    '',    '150g','150g'),
        ('Chickpeas (cooked)',          '',    '',    '',      '',    '',    '80g', '',    '80g'),
        ('Crushed tomatoes (canned)',   '',    '',    '',      '150g','',    '',    '',    '150g'),
    ]
    for i, row in enumerate(carbs):
        r = grid_row(r, row, alt=(i % 2 == 1))

    # VEGGIES
    r = grid_category(r, 'VEGGIES')
    veggies = [
        ('Spinach',                     '150g','80g', '150g',  '100g','150g (kale alt)','200g (mixed)','100g','~930g'),
        ('Broccoli',                    '150g','150g','',      '',    '100g (w/ carrots)','',    '200g (w/ cauli)','~600g'),
        ('Cauliflower',                 '',    '',    '',      '',    '',    '',    '200g','200g'),
        ('Bell peppers',                '',    '150g','',      '100g','',    '150g','',    '~400g'),
        ('Onions',                      '50g', '50g', '',      '100g','',    '',    '50g', '~250g'),
        ('Carrots',                     '',    '',    '',      '',    '100g','125g','',    '~225g'),
        ('Tomatoes (fresh)',            '',    '30g', '',      '',    '50g', '75g', '100g','~255g'),
        ('Mixed greens / salad',        '',    '',    '',      '',    '',    '200g','',    '200g'),
        ('Garlic',                      'pinch','pinch','pinch','pinch','pinch','pinch','pinch','~2 heads'),
    ]
    for i, row in enumerate(veggies):
        r = grid_row(r, row, alt=(i % 2 == 1))

    # FATS
    r = grid_category(r, 'FATS')
    fats = [
        ('Olive oil',                   '20g', '15g', '20g',   '20g', '22g', '15g', '22g', '~134g'),
        ('Avocado (fractions)',         '',    '½',   '½',     '¼',   '¼',   '½',   '¼',   '~2.25'),
        ('Raw almonds',                 '30g', '20g', '',      '30g', '15g', '25g', '25g', '~145g'),
        ('Walnuts',                     '15g', '',    '15g',   '15g', '',    '',    '15g', '60g'),
        ('Natural peanut butter',       '35g (15+20)','','15g','25g','20g', '',    '',    '~95g'),
        ('Chia seeds',                  '10g', '',    'few',   '',    '10g', '',    '',    '~25g'),
    ]
    for i, row in enumerate(fats):
        r = grid_row(r, row, alt=(i % 2 == 1))

    # FRUIT
    r = grid_category(r, 'FRUIT')
    fruit = [
        ('Banana (whole)',              '1',   '1',   '1',     '1',   '1',   '',    '',    '5'),
        ('Apple (whole)',               '1',   '1',   '',      '1',   '',    '1',   '',    '4'),
        ('Orange (whole)',              '',    '',    '',      '',    '',    '',    '1',   '1'),
        ('Frozen mixed berries',        '80g', '',    '60g',   '60g', '80g', '80g', '80g', '~440g'),
    ]
    for i, row in enumerate(fruit):
        r = grid_row(r, row, alt=(i % 2 == 1))

    # OTHER
    r = grid_category(r, 'OTHER')
    other = [
        ('Coffee',                      'daily','daily','daily','daily','daily','daily','daily', '—'),
        ('Lemon (wedges)',              '1',   '1',   '1',     '1',   '1',   '1',   '1',   '~7'),
        ('Honey (optional)',            '',    '5g (opt)','5g','',    '',    '',    '',    '~10g'),
        ('Cinnamon',                    'dust','',    'dust',  '',    'dust','',    'dust','pinch'),
    ]
    for i, row in enumerate(other):
        r = grid_row(r, row, alt=(i % 2 == 1))

    # Padding at the bottom
    r += 2
    merge_set(ws, r, 2, 10,
              'Scale is the law: weigh everything raw before cooking. Grid shows TOTAL per day across all meals.',
              NOTE_FONT, CENTER)
    ws.row_dimensions[r].height = 22

# =============================================================================
# BACKGROUND FILL SWEEP — apply fill to every non-merged cell
# =============================================================================
def sweep_backgrounds(wb):
    DEEP = F(C['bg_deep'])
    MAIN = F(C['bg_primary'])
    UNFILLED_VALUES = (None, '00000000', 'FFFFFFFF', '00FFFFFF')

    totals = {}
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        filled_now = 0
        skipped_merged = 0
        for r in range(1, ws.max_row + 1):
            for c in range(1, ws.max_column + 1):
                cell = ws.cell(r, c)
                if isinstance(cell, MergedCell):
                    skipped_merged += 1
                    continue
                fill = cell.fill
                current = None
                if fill is not None and fill.start_color is not None:
                    current = fill.start_color.value
                if current in UNFILLED_VALUES:
                    cell.fill = DEEP if c == 1 else MAIN
                    filled_now += 1
        totals[sheet_name] = (filled_now, skipped_merged)
    return totals

# =============================================================================
# MACRO TARGETS — update delta + running avg formulas to IFERROR-wrapped
# =============================================================================
def update_macro_formulas(wb):
    ws = wb['MACRO TARGETS']
    # Find the progress tracker rows: columns F (delta) and G (running avg)
    # Scan for existing formulas and rewrite with IFERROR wrapping
    weight_col = 'D'  # weight is in col 4
    # Find first row of tracker data — look for rows where col B contains int 1..16
    data_rows = []
    for r in range(1, ws.max_row + 1):
        v = ws.cell(r, 2).value
        if isinstance(v, int) and 1 <= v <= 16:
            data_rows.append(r)
    if len(data_rows) < 16:
        return f'WARN: only found {len(data_rows)} tracker rows'
    data_start = data_rows[0]
    for i, r in enumerate(data_rows):
        # Delta (col F, index 6)
        if i == 0:
            delta = ''
        else:
            delta = f'=IFERROR(IF(COUNT({weight_col}{r-1}:{weight_col}{r})=2,{weight_col}{r}-{weight_col}{r-1},""),"")'
        ws.cell(r, 6).value = delta
        # Running avg (col G, index 7)
        ravg = f'=IFERROR(AVERAGE({weight_col}${data_start}:{weight_col}{r}),"")'
        ws.cell(r, 7).value = ravg
    return f'updated {len(data_rows)} tracker rows'

# =============================================================================
# LANGUAGE SCAN — check for stale 'Brett'/'Dan's job' language
# =============================================================================
def scan_language(wb):
    flags = []
    forbidden = ['Dan\'s job', 'Brett\'s job', 'your responsibility', 'you\'ll need']
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        for row in ws.iter_rows():
            for cell in row:
                v = cell.value
                if isinstance(v, str):
                    for f_ in forbidden:
                        if f_ in v:
                            flags.append((sheet_name, cell.coordinate, f_, v[:60]))
    return flags

# =============================================================================
# MAIN
# =============================================================================
def main():
    wb = load_workbook(PATH)
    print(f'Loaded: {PATH}')
    print(f'Sheets: {wb.sheetnames}')
    print()

    print('Step 1: rebuilding INGREDIENTS & SHOPPING tab with daily grid...')
    rebuild_ingredients(wb)
    print('  done.')

    print('Step 2: updating MACRO TARGETS progress-tracker formulas (IFERROR-wrapped)...')
    msg = update_macro_formulas(wb)
    print(f'  {msg}')

    print('Step 3: verifying freeze panes...')
    if wb['WEEKLY MEAL PLAN'].freeze_panes != 'A6':
        wb['WEEKLY MEAL PLAN'].freeze_panes = 'A6'
        print('  set WEEKLY MEAL PLAN.freeze_panes = A6')
    else:
        print('  WEEKLY MEAL PLAN: A6 (ok)')
    if wb['FOOD SWAPS'].freeze_panes != 'A8':
        wb['FOOD SWAPS'].freeze_panes = 'A8'
        print('  set FOOD SWAPS.freeze_panes = A8')
    else:
        print('  FOOD SWAPS: A8 (ok)')

    print('Step 4: scanning for stale language...')
    flags = scan_language(wb)
    if flags:
        print(f'  FOUND {len(flags)} flags:')
        for f in flags: print(f'    {f}')
    else:
        print('  clean.')

    print('Step 5: applying background sweep to every non-merged cell...')
    totals = sweep_backgrounds(wb)
    for sheet, (filled, skipped) in totals.items():
        print(f'  {sheet}: filled {filled} cells, skipped {skipped} merged-inner')

    wb.save(PATH)
    print(f'\nSaved: {PATH}')
    print(f'Sheets after corrections: {wb.sheetnames}')

if __name__ == '__main__':
    main()
