# Project Architecture & Coding Guidelines

This document outlines the strict rules for development within this project. Follow these guidelines for all code generation and modification.

## 1. Directory Structure & Responsibilities

### `app/`
- **Purpose**: Routing and Page Layouts ONLY.
- **Restrictions**: Do not define complex UI components or business logic here.

### `modules/[module_name]/`
- **Purpose**: Encapsulated features (e.g., `transactions`, `account`).
- **Structure**: Each module must be self-contained with its own:
  - `components/`: React Native components specific to the module.
  - `hooks/`: Module-specific hooks.
  - `utils/`: Module-specific utilities.
  - `store/`: Zustand stores for module data/caching.
  - `services/`: Module-specific services.

### Root Directories (`components/`, `hooks/`, `store/`, `services/`, `utils/`)
- **Purpose**: Shared resources used across multiple modules or the entire application.

## 2. Architecture & Data Flow

- **UI ↔ Domain**: The UI must communicate with Domain logic **exclusively** through **Use Cases**.
- **Hook Abstraction**:
  - Do not call Use Cases directly from UI components.
  - Create a custom hook (e.g., `useCreateTransaction`) that wraps the Use Case.
  - The UI interacts only with this custom hook.

## 3. Styling & Theming

- **Primary Method**: Use **NativeWind** classes (`className`) whenever possible.
- **Fallback Method**: Use the `style` prop or component-specific props only when NativeWind is insufficient.
- **Colors**:
  - **Source of Truth**: `tailwind.config.js`.
  - **Usage**: Use Tailwind utility classes (e.g., `bg-primary`, `text-text-secondary`).
  - **JS Access**: If you need color values in JavaScript/TypeScript, use the `hooks/useTheme.ts` hook.
  - **Prohibition**: 
    - Do NOT hardcode hex values or use colors not defined in the theme.
    - Do NOT use the `shadow-sm` className. Use `elevation` (Android) or `shadow` props/styles (iOS) appropriately, or other shadow utilities if available, but `shadow-sm` is strictly forbidden.

## 4. Localization (i18n)

- **Access**: Use the `hooks/useTranslations.ts` hook.
- **Workflow for Adding Text**:
  1. **Update Schema**: Add the new key to `localization/schema.ts` (Zod schema).
  2. **Update JSONs**: Add translations for the new key in ALL JSON files within the `localization/` directory.
- **Organization**: Keep translation keys logical and separated from application logic.

## 5. UI/UX & Platform Guidelines

- **Cross-Platform**: Ensure all code works flawlessly on both **iOS** and **Android**.
- **Design**:
  - Implement modern, trending UI designs.
  - Adhere strictly to the app's theme.
- **Animations**: Always include transitions and animations where feasible to enhance user experience.
- **Safe Area**:
  - Use `react-native-safe-area-context` for handling safe areas (status bar, navigation bar).
  - Do not use other packages for this purpose.
