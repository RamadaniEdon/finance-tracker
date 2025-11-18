# Finance Tracker Mobile App

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Node and npm versions

   Use Node version greater than 18. Use Node version greater than 20 for best results.

   Use npm version greater than 10 if possible. The project works with lower versions, but newer versions reduce install issues.
   ```bash
   node --version # >18 preferably >20
   npm --version # >10
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Dependency Notes

If something in the project does not work and you have tried everything else, check if upgrading any of these packages helps. The versions below were recommended in the NativeWind documentation, but some may require updates to work with your environment:

```
react-native-reanimated@~3.17.4  (we upgraded to 4.1.1 due to issues)
react-native-safe-area-context@5.4.0
tailwindcss@^3.4.17
prettier-plugin-tailwindcss@^0.5.11
```

Adjust versions as needed if you encounter compatibility issues.
However, if you change the versions and the problem still persists, make sure to revert the version changes.

## Project Structure and Development Rules

This project follows a modular structure. Each domain has its own isolated module under the modules directory. Every module includes its own components, hooks, services, store, and validation. This keeps domain logic isolated and avoids cross-feature dependencies.

Top level directories contain shared logic used across the entire app. Shared code never depends on module code.

Structure rules:
- app contains all routes. Route files render screens only. No business logic.
- modules contains isolated domain logic. Each module has its own components, hooks, services, store, and validation. Example modules include auth and stores.
- components contains shared UI components used by multiple modules.
- hooks contains shared hooks that apply to the whole application.
- services contains shared service logic such as apiClient and notificationService.
- store contains shared Zustand stores used across modules.
- utils contains shared helpers, formatters, and constants.
- assets contains images and static files.

Coding rules:
- All domain logic stays inside its module. For example, authentication logic stays under modules/auth.
- Shared logic goes to top level. Modules do not import from each other, but both can import from shared directories.
- Do not write API code inside screens. Screens only call hooks or services.
- Stores handle business state. Hooks connect screens to stores and services.
- Services perform all network calls and data formatting for their module.
- Validation stays inside the module, never in screens.

This structure lets you replace APIs or change implementation details in one place. Modules stay independent and the shared layer stays clean and stable.
