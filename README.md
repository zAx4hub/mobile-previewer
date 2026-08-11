# Mobile Previewer

> Browser device lab

**Author:** zAx4hub

## Problem

Responsive QA needs consistent device profiles, UA strings, DPR, and network presets — not ad-hoc DevTools clicks.

## Solution

`mobile-previewer` resolves a browser device lab: viewports, orientation swaps, CSS media hints, and network profiles for automation harnesses.

## Why different

- Built-in phone/tablet/foldable/desktop catalog
- Portrait/landscape dimension rules
- Network RTT/downlink presets
- Owned and credited to **zAx4hub**

## Quickstart

```bash
cd mobile-previewer
npm install
npm test
npm run demo
npm start -- run examples/sample-input.json
```

## Features

- Device catalog + viewport resolver
- Multi-device preview reports
- CLI + Vitest + CI

## Architecture

Profiles live in `DEVICES`; `run()` aggregates viewports and scoring for coverage.

## Contributing

PRs welcome — keep changes focused and add tests.

## Credits

Built and maintained by **zAx4hub**.

## License

MIT © 2026 zAx4hub
