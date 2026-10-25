# Intent — ecommerce personalization demo

A dependency-free interactive MVP with a merchant dashboard, adaptive Forma storefront, transparent intent signals, simulated experiment reporting, and a revenue opportunity calculator.

## Run

```sh
npm run dev
```

Open http://localhost:3000. Use `PORT=3001 npm run dev` to change the port. Run model checks with `npm test`.

## Demonstrate the full journey

1. Start on Overview. The historical dashboard and experiment metrics are explicitly simulated.
2. Open Live storefront and switch between the four persona previews. “Why this experience?” explains each adaptation and distinguishes preview overrides from observed events.
3. Reset the session and use Auto-detect. Set two budget filters to infer value intent; compare two products to infer researcher intent; search for a specific product twice to infer focused shopping. Product detail views, repeat views, and 10-second consideration time also create signals. Only the latest 16 events influence the hypothesis. Below 60% confidence the default experience remains visible.
4. Add an item to the bag, change quantities, and complete a simulated purchase. No payment or personal information is collected. Bag and demo order count persist locally; Reset session clears them.
5. Inspect Audience signals, then the mock experiment comparison. Export the simulated results to CSV. The personalization toggle controls the demo storefront, not historical data.
6. Edit the revenue calculator. Forecast = unique abandoned shoppers × incremental purchase probability × average order value. Forecasts are separate from measured-style mock experiment results.

## Measurement assumptions

The experiment uses two hypothetical groups of 24,000 eligible visitors. Default: 768 purchases, $73,728 revenue, $3.072 revenue per visitor. Personalized: 984 purchases, $94,464 revenue, $3.936 revenue per visitor. Incremental revenue is $20,736, relative revenue-per-visitor lift is 28.125%, and conversion lift is 0.9 percentage points. Both groups contain 19,200 product viewers. Cart additions are 4,944 versus 6,576, resulting in browse abandonment of 74.25% versus 65.75%. Aggregate browse abandonment is 70%, or 26,880 unique simulated product viewers.

Daily chart trends and persona breakdowns are illustrative. No confidence interval or significance claim is made. Returns are preliminary. Production experiments require stable randomized assignment, visitor/order deduplication, mature attribution windows, statistical analysis, consent-aware first-party collection, and backend commerce integration.

## Implementation

- `app.mjs`: UI rendering, navigation, local session interactions and exports.
- `model.mjs`: product catalog, deterministic intent inference, ranking/filtering and revenue calculations.
- `styles.css`: responsive dashboard and storefront, keyboard focus and reduced-motion support.
- `server.mjs`: minimal local HTTP server. No build or dependency installation required.
- `tests/model.test.mjs`: calculation, low-confidence fallback, recent-evidence adaptation and combined product filtering checks.

Google Fonts and Unsplash product imagery require internet access. Typography has local fallbacks. Product names, details, prices, reviews, stock, delivery statements and store policies are fictional demo content. The heuristic confidence score is not a calibrated probability. Gift recipient and occasion selections change recommendation ranking; delivery windows filter the catalog using simulated delivery times. All recommendations use transparent deterministic rules, not a production machine-learning model.
