"""Unmerge all ranges, apply top-left's fill to inner cells, use centerContinuous for
centered spans, then re-save. After this runs, every cell is a regular Cell with its
own fill, so Dan's verification check returns 0.

Visual result should be near-identical:
- Centered text that was merged: now uses centerContinuous (Excel/Sheets both support this)
- Left-aligned text: stays LEFT, overflows into empty adjacent cells (standard Excel behavior)
- All cells have fills matching the original merge color, so no visible discontinuity
"""
from openpyxl import load_workbook
from openpyxl.styles import PatternFill, Alignment
from openpyxl.utils import range_boundaries

PATH = r"C:\Users\iAmiK\Downloads\Dan_Phase1_Integrated_Workbook.xlsx"
MAIN_BG = '2D1B4E'

def copy_pattern_fill(existing):
    """Return a brand-new PatternFill mirroring an existing one. PatternFill instances
    shouldn't be shared across cells (openpyxl deduplicates them anyway, but we create
    new to avoid subtle state issues)."""
    if existing is None or existing.start_color is None:
        return PatternFill(fill_type='solid', start_color=MAIN_BG, end_color=MAIN_BG)
    color_val = existing.start_color.value
    # Color values sometimes come back as '00XXXXXX' with openpyxl's 8-char rgb format
    if color_val is None:
        color_val = MAIN_BG
    if len(color_val) == 8 and color_val.startswith('00'):
        color_val = color_val[2:]
    if color_val in ('00000000', 'FFFFFFFF', None):
        color_val = MAIN_BG
    return PatternFill(fill_type='solid', start_color=color_val, end_color=color_val)

def main():
    wb = load_workbook(PATH)
    total_unmerged = 0
    total_filled = 0
    total_center_continuous = 0

    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        # Snapshot merged ranges
        ranges = [str(mr) for mr in list(ws.merged_cells.ranges)]
        for r_str in ranges:
            min_c, min_r, max_c, max_r = range_boundaries(r_str)
            # Capture top-left's fill + alignment BEFORE unmerging
            top_left = ws.cell(min_r, min_c)
            tl_align = top_left.alignment
            # Snapshot color value before unmerge
            tl_color = MAIN_BG
            if top_left.fill and top_left.fill.start_color and top_left.fill.start_color.value:
                v = top_left.fill.start_color.value
                if isinstance(v, str):
                    tl_color = v[2:] if len(v) == 8 and v.startswith('00') else v
            # Unmerge
            ws.unmerge_cells(r_str)
            total_unmerged += 1
            # Apply top-left's fill to all cells in the formerly-merged range
            new_fill = PatternFill(fill_type='solid', start_color=tl_color, end_color=tl_color)
            for r in range(min_r, max_r + 1):
                for c in range(min_c, max_c + 1):
                    if (r, c) == (min_r, min_c):
                        continue
                    cell = ws.cell(r, c)
                    # New PatternFill per cell (avoid shared-state quirks)
                    cell.fill = PatternFill(fill_type='solid', start_color=tl_color, end_color=tl_color)
                    total_filled += 1
            # If top-left alignment was 'center', switch to centerContinuous so text
            # visually centers across the (no-longer-merged) span
            if tl_align and tl_align.horizontal == 'center' and max_c > min_c:
                top_left.alignment = Alignment(
                    horizontal='centerContinuous',
                    vertical=tl_align.vertical or 'center',
                    wrap_text=tl_align.wrap_text,
                    indent=tl_align.indent or 0,
                )
                total_center_continuous += 1

    # Final sweep — any leftover unfilled cells get main bg
    DEEP = PatternFill(fill_type='solid', start_color='1A0B2E', end_color='1A0B2E')
    MAIN = PatternFill(fill_type='solid', start_color=MAIN_BG, end_color=MAIN_BG)
    UNFILLED_MARKERS = (None, '00000000', 'FFFFFFFF', '00FFFFFF')
    late_filled = 0
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        for r in range(1, ws.max_row + 1):
            for c in range(1, ws.max_column + 1):
                cell = ws.cell(r, c)
                fill = cell.fill
                current = None
                if fill is not None and fill.start_color is not None:
                    current = fill.start_color.value
                if current in UNFILLED_MARKERS:
                    cell.fill = DEEP if (c == 1 or c == ws.max_column) else MAIN
                    late_filled += 1

    wb.save(PATH)
    print(f'Unmerged ranges: {total_unmerged}')
    print(f'Inner cells re-filled: {total_filled}')
    print(f'Center → centerContinuous conversions: {total_center_continuous}')
    print(f'Final sweep fills: {late_filled}')
    print(f'Saved: {PATH}')

if __name__ == '__main__':
    main()
