# Changelog - @jonathanludena/forms

All notable changes to the forms package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
