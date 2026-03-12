# Flag That - Development Guidelines

## Design System

### Typography
- **Two font families only** — no exceptions.
  - `LibreBaskerville` — display/editorial headings, wordmark, big numbers
  - `Barlow` — everything else (body, labels, buttons, gameplay, UI)
- Homepage wordmark ("FlagThat") uses LibreBaskerville at ~23px, single line. "Flag" in ink, "That" in italic gold.

### Visual Rules
- Rounded corners on cards and interactive elements (sm-xl scale).
- No gradients. Flat color planes.
- No drop shadows except offset hard shadows on CTA buttons.
- Gold (`colors.goldBright` / `colors.gold`) is the primary CTA accent color.
- Red reserved for errors, hard difficulty, and wrong-answer feedback.
- No emoji anywhere in the UI. Use SVG icons from `src/components/Icons.tsx`.
- No em dashes in user-facing text. Use hyphens or commas.
- No circles in procedurally generated fake flags (impostor mode).

### Colors
- All colors defined in `src/utils/theme.ts` — single source of truth.
- Warm-neutral palette: warm parchment background, midnight ink text, gold CTA accent, green/red/blue/purple pops.
- Dark surfaces use `colors.ink` (#1A1820).
- Background uses `colors.background` (#F5EFE6).
- Primary CTA buttons use `colors.gold` (#9A5C0A) with white text.
- Streak indicators and active states use `colors.goldBright` (#E9BA4C).
- Difficulty colors: Easy=green, Medium=gold, Hard=red (use `colors.diffEasy/diffMedium/diffHard`).
- Game mode bars use `colors.modeRed/modeGold/modeBlue/modeGreen/modePurple`.

### Component Patterns
- **Streak badge**: Pill with streak number + "Day streak" label + pip dots (max 7).
- **Play/CTA button**: Gold background, white text, hard shadow below.
- **Difficulty buttons**: 3-column grid, colored when active (green/gold/red).
- **Mode list**: Rows with colored sidebar bar (3px), title, tag, and chevron.
- **Stats hero**: 3-column card (streak/accuracy/mastered) with dividers.
- **Bottom nav**: Gold active indicator bar at top of active tab.
- **Region/filter chips**: Gold background when active.

## Architecture
- React Native / Expo SDK 55 (iOS, Android, Web)
- Local-first: all data stored via AsyncStorage, no backend
- Navigation: React Navigation native stack
- State: local component state + AsyncStorage persistence

## Key Files
- `src/utils/theme.ts` — colors, spacing, typography, font families
- `src/utils/storage.ts` — all AsyncStorage persistence
- `src/utils/gameEngine.ts` — question generation, scoring, daily challenge
- `src/utils/badges.ts` — badge definitions and evaluation engine
- `src/utils/feedback.ts` — sound and haptics with runtime toggles
- `src/components/Icons.tsx` — all SVG icons (no emoji)
- `src/components/BottomNav.tsx` — shared bottom navigation

## Conventions
- DRY: shared components in `src/components/`, shared logic in `src/utils/`
- BottomNav on all non-game screens (Home, Stats, Settings, Browse, Results, GameSetup)
- All screens use SafeAreaView with `colors.background`
- Game screens have Exit button + no bottom nav
- TypeScript strict mode, no `any` types
