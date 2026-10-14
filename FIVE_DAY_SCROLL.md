# Five-day scrolling forecast

Based on TheWillMiller/tide-wise v0.9.8, commit 16c8f56eaaab15fd69ba7bab733093b5fdb089b5.

## Behavior

- Opens on a 12-hour forecast from now.
- Swipe left on the graph, drag left with a mouse, use horizontal trackpad scrolling, or focus the chart and use arrow keys to look ahead.
- The final viewport ends five days (120 hours) from now.
- Preserves the current card styling, chart height, colors, typography, controls and YAML configuration.
- Current tide, next high/low and fishing summary continue describing current conditions. Future graph labels include weekdays; the NOW marker is shown only when now is in view.
- Keeps your scroll offset during the existing minute/15-minute refreshes and redraws when the card changes width.
- NOAA and CHS requests cover the extended horizon. Home Assistant tide entities can only show the future data their integration provides. No extra predictions are invented beyond available data.
- Optional future fishing colors retain upstream scoring behavior, which can use current/fallback environmental inputs. These are not five-day weather predictions.

## Fractional zoom rendering

The graph canvas now accounts for its on-screen dimensions, device pixel ratio and twofold supersampling. This targets blurry canvas labels at fractional dashboard zoom (such as 1.05x) without changing font sizes or colors. Browser resize also redraws the graph. Actual appearance must still be checked on the user's browser; text elsewhere on the dashboard is outside this card's control.

## Manual Home Assistant install

1. Back up the existing `tidewise-card.js`.
2. Copy this package's `tidewise-card.js` to `/config/www/tidewise-card.js` using your file editor or file transfer method.
3. In Settings → Dashboards → Resources (three-dot menu; Advanced Mode may be needed), change the existing TideWise resource to `/local/tidewise-card.js?v=five-day-5`, type JavaScript module. Do not load both versions together.
4. Refresh the dashboard/browser or fully reopen the companion app. Your existing `custom:tidewise-card` YAML stays the same.

To undo: restore the original resource URL/file and refresh. HACS updates can overwrite a directly replaced HACS file, so the separate manual resource above is preferable until using the fork through HACS.

## Validation

`npm run check` and `npm test` cover syntax, the existing generic/Canadian/safe-tide tests, and new forecast-range/provider-request regressions. Browser interaction validation requires a working Chromium installation; no live Home Assistant instance is available in this workspace.

## Display settings

The visual card editor includes independent checkboxes for **Show card title**, **Show station ID / name**, **Show next low tide**, and **Show next high tide**. All default to checked. Hiding both items in a section removes that section's empty space; a single remaining tide panel fills the row. The graph retains its high/low markers.

Y-axis labels are now 11px instead of 9px, with additional left padding to prevent clipping.

Optional YAML equivalents: `show_title`, `show_station`, `show_next_low`, and `show_next_high` (set to `false` to hide).

## Whole-card text rendering diagnostic (revision 4)

Removed the backdrop blur/saturation from the container holding all card text. The gradient, fonts, sizes, colors and layout remain. The translucent background no longer blurs objects behind the card. This is a targeted diagnostic for whole-card text softening at 1.05x zoom, not a confirmed fix until checked in the affected browser. Previous canvas supersampling remains enabled.

## Compact vertical spacing (revision 5)

Vertical padding, margins and row gaps are reduced by approximately half (rounded up to whole pixels), including narrow-card layouts. Horizontal spacing, font sizes, line heights and graph height are retained. Panels remain content-sized so text can determine their height; no fixed-height text boxes are introduced. The backdrop-filter fix remains in place.
