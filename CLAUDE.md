# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite, localhost:5173)
npm run build      # Type-check + build for production
npm run preview    # Preview production build
```

No test runner is configured.

## Project Overview

A drone mission planning wizard UI for MRR Drones. The app is a fixed 640×360px panel (tablet/embedded form factor) built with React 18 + TypeScript + Vite + Tailwind CSS v3. All UI text is in Dutch.

## Architecture

State and navigation live entirely in `src/App.tsx`. There is no router — `screen` is a `Screen` string union that drives conditional rendering. `WizardState` holds in-progress mission data and is passed down to step components via props.

**Flow:**
- `home` → `mission-list` (view/edit existing) or `wizard-step1..4` (new mission)
- `wizard-step1` (home point, map) → `wizard-step2` (area, map) → `wizard-step3` (settings) → `wizard-step4` (confirm/name) → `wizard-ready`
- Editing an existing mission skips steps 1–2 and enters at `wizard-step3`

**Key files:**
- `src/types.ts` — `Mission`, `WizardState`, `Screen`, `AppName` types
- `src/data.ts` — `mockMissions` seed data (no backend; state is in-memory)
- `src/components/WizardBar.tsx` — shared top bar for wizard steps; renders step circles, back button, hints toggle
- `src/components/Toggle.tsx`, `Button.tsx`, `MapPlaceholder.tsx` — shared primitives

## Design Tokens (Tailwind)

Custom colors: `primary` (#3D5AF2), `bg-secondary` (#F8F8F8), `title` (#23262F), `body` (#5A5A5A), `negative`, `positive`, `border` (#E0E0E0).  
Custom font sizes: `display`, `h1`–`h3`, `body-lg`, `body`, `label`.  
Border radii: `btn` (5px), `card` (10px).  
Font: DM Sans (loaded from Google Fonts in `index.html`).

Inline styles are used alongside Tailwind where Tailwind classes alone aren't expressive enough (e.g. pixel-precise sizes, dynamic colors).

## Adding a New Wizard Step

1. Add the new screen name to the `Screen` union in `src/types.ts`.
2. Create the component under `src/screens/wizard/`.
3. Wire it into `App.tsx`: add it to `STEP_SCREENS`, render it conditionally, and update `totalSteps` passed to `WizardBar`.
4. Pass `wizardBarProps` (hintsVisible, onToggleHints, onStepClick) to `WizardBar` inside the new step.

## Extending AppName

`AppName` in `src/types.ts` is currently a single-value union (`'OpenDroneMap'`). The comment marks it as intentionally extensible — add new app names there, then add entries to the `APPS` array in `Step3_Settings.tsx`.
