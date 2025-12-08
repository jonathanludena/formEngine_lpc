# Changelog - @jonathanludena/form-engine

All notable changes to the form-engine package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.6.0](///compare/forms-v3.5.0...forms-v3.6.0) (2025-12-08)

### Features

- add CSS module declaration and update tsconfig for type exclusions b10ce5d
- implement health claim loading and configuration logic 07682ee
- refactor dropdown rendering logic in Select component for improved readability 77af35f

### Bug Fixes

- add redirects from /home to / for improved navigation f07c156
- convert (app) layout to Server Component to resolve client-reference-manifest error e9bc3c6
- eliminar route group (app) para resolver error de manifest en Vercel 914873f
- forzar limpieza completa de cache en Vercel 80fb204
- remove outdated deployment and security documentation for Vercel and Turso 607bd56
- remove standalone output mode to fix client-reference-manifest error in Vercel 87b8bfc
- update dependency versions to remove caret (^) for consistency 09f4930
- update import paths and remove unused insurance type state in InsuranceQuoteForm 591f120

# Changelog - @jonathanludena/form-engine

All notable changes to the form-engine package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.5.0](///compare/forms-v3.4.0...forms-v3.5.0) (2025-12-02)

### Bug Fixes

- add conditional postinstall script to avoid Prisma errors during package publish 21b1c03

# Changelog - @jonathanludena/form-engine

All notable changes to the form-engine package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.4.0](///compare/forms-v3.3.0...forms-v3.4.0) (2025-12-02)

### Features

- Add GitHub Actions workflow to publish forms package 5d060e8
- Add migration and seeding scripts for Turso database integration 23cb02a
- Add Next.js TypeScript configuration and new Button and Card UI components 27903b7
- Update package.json and vercel.json for improved Prisma setup and build commands 92d907a

### Bug Fixes

- correct form-engine package import path in globals.css e7a1b66

# Changelog - @jonathanludena/form-engine

All notable changes to the form-engine package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.3.0](///compare/forms-v3.2.0...forms-v3.3.0) (2025-12-01)

### Features

- initialize demo app with insurance quote and claim pages, and setup forms package 8322eee

# Changelog - @jonathanludena/forms

All notable changes to the forms package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.0](///compare/forms-v3.1.0...forms-v3.2.0) (2025-12-01)

### Features

- add new `@jonathanludena/forms` package configuration e3995f9

# Changelog - @jonathanludena/forms

All notable changes to the forms package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0](///compare/2.3.1...forms-v3.1.0) (2025-12-01)

### Features

- Add demo app with its dependencies and update pnpm lockfile b187090
- add file upload components and integrate into claim forms c9997c4
- Add GitHub Actions workflow for publishing forms package be92957
- add pre-push hook to run form build 5382ede
- field phone fix validations maxlength and test 7c3b4df
- Refactor code structure and remove redundant sections 1534f52

### Bug Fixes

- update favicon link in index.html and add favicon.ico file 0cf0de9

## 2.3.1 (2025-11-25)

### Bug Fixes

- update dependencies in package-lock.json for improved compatibility 6e3c456
- update navigation paths to remove base path for consistency b306d5e

## 2.3.0 (2025-11-25)

### Features

- add predeploy script and update gh-pages dependency 33f86a3

### Bug Fixes

- update navigation paths to include base path for consistency 04c57da
- update route paths to include base path for navigation 3ae6456

## 2.2.1 (2025-11-25)

### Bug Fixes

- update dts plugin configuration to insert types entry 9ca1434

## 2.2.0 (2025-11-25)

### Features

- add accessibility attributes to Select component for improved usability 09715c7
- add dropdownRef to Select component for improved click outside handling dfc4b64
- add pre-existing conditions handling in InsuranceQuoteForm and update schemas 18f46ad
- create useClaimPage hook for improved state management in ClaimPage b2d3f32
- define font family and apply styles to body in globals.css a7df66c
- enhance ClaimForm and InsuranceQuoteForm with improved accessibility 375061f
- enhance ClaimForm and pages with improved error handling and state management 6c3a245
- enhance form behavior by disabling submit button until validation 6ba35f8
- enhance routing and state management for insurance types in pages 686573c
- extract useUnifiedQuotePage hook for improved state management 0b22614
- implement Sidebar component for navigation and enhance HomePage layout 0787613
- implement useHomePage hook for centralized feature and claim options management 0bebc67
- improved validation and user experience 503269d
- integrate DOMPurify and html-react-parser for enhanced content rendering in TermsModal 69fa418
- refactor routing and state management in ClaimPage and UnifiedQuotePage 841cf78
- remove unused parameter from handleSubmit in ClaimPage ed605fd
- update FormCheckbox to support link text and improve label handling in InsuranceQuoteForm 76fbcea
- update FormSelect component to use combobox role and add id prop for accessibility aac430c
- update phone number handling in forms and schemas for improved validation and user experience 19981a6
- update terms and conditions in brand-copies for clarity and compliance 0f04b0d

### Bug Fixes

- adjust layout and positioning of Sidebar and footer elements for improved responsiveness f247d22
- refine type handling in InsuranceQuoteForm for improved type safety a4e12da
- **release:** correct release-it configuration 489454a
- update sidebar description and footer year for accuracy b544e63

## [Unreleased]

### ✨ Features

- Complete monorepo migration with CustomEvents architecture
- ClaimForm with forwardRef and CustomEvents communication (form:start, form:submit, form:result)
- InsuranceQuoteForm base implementation with CustomEvents
- Rollup bundler with tree-shaking (ESM + CJS outputs)
- Type-safe event definitions with TypeScript interfaces
- Event constants for consistency (FORM_EVENTS)
- Exported design tokens and theme CSS
- Health and vehicle claim support with dynamic fields
- Zod schemas for validation (healthClaimSchema, vehicleClaimSchema, quoteSchema)

### 🏗️ Build System

- Rollup configuration with terser minification
- PostCSS plugin for CSS extraction
- Type declarations generation with rollup-plugin-dts
- Peer dependencies externalized
- sideEffects: false for optimal tree-shaking

### 📚 Documentation

- Package README with installation and usage examples
- CustomEvents communication pattern documented
- Export structure documented (ESM, CJS, Types, CSS)

---

## Getting Started

This is the first release in the new monorepo architecture. The package is designed to be consumed by Next.js or other SSR frameworks using CustomEvents for communication.

### Installation

```bash
npm install @jonathanludena/forms
```

### Usage

```tsx
import { ClaimForm } from '@jonathanludena/forms';
import '@jonathanludena/forms/styles.css';

function MyComponent() {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = formRef.current;
    if (!element) return;

    // Send initial config
    element.dispatchEvent(
      new CustomEvent('form:start', {
        detail: { brand: 'default', feature: 'claim', insurance: 'health' },
      })
    );

    // Listen for submissions
    const handleSubmit = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      console.log('Form data:', detail.data);
    };

    element.addEventListener('form:submit', handleSubmit);
    return () => element.removeEventListener('form:submit', handleSubmit);
  }, []);

  return <ClaimForm ref={formRef} />;
}
```

---

**Note**: This package is part of the `formEngine_lpc` monorepo. For host application examples, see `apps/next-host-demo`.
