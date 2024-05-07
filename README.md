# FMB Housing Costs - Proof of Work Location

## Initiating app

- Clone the repository
- Add the `GOOGLE_API_KEY` to a .env file in the root of the repository
- Run `npm install`

## Running the app

```npm start```

## Packaging the app

```npm run make```

The installation file (Windows Installer Package) is found in ./out/make/wix/x64

## Code structure

```
├── out
│   ├── make
│   │   ├── wix
│   │   │   ├── x64
│   │   │   │   ├── FMB Housing Costs - Proof of Work Location.msi
├── src
│   ├── assets
│   │   ├── fonts
│   │   ├── icons
│   │   ├── images
│   │   ├── react-datepicker-stylesheets
│   │   └── Styles.scss
│   ├── axios
│   │   └── GetCoordinates.js
│   ├── components
│   │   ├── CalendarComponents
│   │   │   ├── DayItem.tsx
│   │   │   ├── LocationDropdown.tsx
│   │   │   ├── MonthPicker.tsx
│   │   │   ├── SplitDayToggle.tsx
│   │   │   ├── WorkdayList.tsx
│   │   │   └── WorkdayTypeRadioButtons.tsx
│   │   ├── AddressList.tsx
│   │   ├── AlertModal.tsx
│   │   ├── Attachments.tsx
│   │   ├── Calendar.tsx
│   │   ├── Collapsible.tsx
│   │   ├── Disclaimer.tsx
│   │   ├── EligibilityMessage.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Maps.tsx
│   │   ├── ResidentialAddress.tsx
│   │   ├── Save.tsx
│   │   ├── SubmitAndExportPDF.tsx
│   │   ├── UserName.tsx
│   │   └── WorkplaceAddress.tsx
│   ├── models
│   │   ├── enums.ts
│   │   └── types.tsx
│   ├── tests
│   │   ├── components
│   │   └── setup.ts
│   ├── utils
│   │   ├── getDistance.ts
│   │   ├── toBase64.ts
│   │   └── useLocalStorage.ts
│   ├── App.tsx
│   ├── electronApp.tsx
│   ├── index.html
│   ├── index.ts
│   ├── react-app-env.d.ts
│   └── renderer.tsx
├── .env (to be added by user)
├── .eslintrc.json
├── .gitignore
├── README.md
├── babel.config.js
├── forge.config.ts
├── make-msi.ts
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vitest.config.ts
├── webpack.main.config.ts
├── webpack.plugins.ts
├── webpack.renderer.config.ts
└── webpack.rules.ts
```