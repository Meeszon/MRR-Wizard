# MRR Drones — Remote First

A full redesign of the MRR Drones frontend, built **remote first**: every screen is designed for the **640×360px DJI RC controller display** before anything else.

## What's here

A control panel for drone survey operations. From the home screen you can start a flight, create a new mission, manage saved missions, or review the flight log.

**Start Flight** lets you pick a drone and a saved mission, preview the flight area and estimated metrics, then launch. **Create Mission** walks through a 4-step wizard: home point, survey area, flight settings (altitude, quality, RTK, app), and confirm. Completed flights are stored in the **Flight Log** with date, duration, and photo count.

## Stack

- React 18 (JavaScript)
- React Router v6 (HashRouter)
- Vite
- Tailwind CSS v3
- SCSS modules for component styles

No backend. Missions are held in memory via React Context.

## Run locally

```bash
npm install
npm run dev       # localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

Set your browser devtools display size to **640×360px** to match the DJI RC controller view.

## Code quality

ESLint and Prettier run automatically on every commit via Husky + lint-staged. Only staged files are checked.

## Project structure

```
src/
  pages/          # Route-level page components
    wizard/       # Step1–Step4 wizard pages
  components/     # Shared UI primitives (Button, Toggle, WizardBar, …)
  context/        # React Context providers (App, Missions, Wizard)
  hooks/          # Custom hooks (useWizard, useMissions, useAppPrefs)
  services/       # Mission data helpers (build/update mission objects)
  utils/          # Pure utility functions
  data/           # Mock seed data
  styles/         # Global SCSS + design token variables/mixins
```
