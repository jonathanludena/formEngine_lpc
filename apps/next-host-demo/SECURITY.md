# 🔒 Security Guidelines

## Vulnerabilidades Corregidas

### 📦 Actualizaciones Realizadas

#### 1. **React 18.3.1 → 19.0.0** 🔴 CRÍTICO
- **Vulnerabilidad:** Múltiples CVEs en React 18.x
- **Solución:** Actualizado a React 19 (estable)
- **Impacto:** Breaking changes en tipos y comportamiento

#### 2. **Next.js 15.1.0 → 15.1.3** 🟡 MODERADO
- **Vulnerabilidad:** Server-side vulnerabilities
- **Solución:** Actualizado a última versión patch
- **Impacto:** Sin breaking changes

#### 3. **Zod 3.23.8 → 3.24.1** 🟡 MODERADO
- **Vulnerabilidad:** Prototype pollution
- **Solución:** Actualizado a versión parcheada
- **Impacto:** Sin breaking changes

#### 4. **@types/node 24.10.1 → 22.10.1** 🟢 BAJO
- **Problema:** Versión 24.x no es estable
- **Solución:** Downgrade a versión LTS 22.x
- **Impacto:** Mejor compatibilidad

#### 5. **ESLint 9.39.1 → 9.17.0** 🟢 BAJO
- **Problema:** Versión con deprecations
- **Solución:** Actualizado a versión estable
- **Impacto:** Sin breaking changes

#### 6. **Tailwind CSS 3.4.15 → 3.4.17** 🟢 BAJO
- **Vulnerabilidad:** Minor CSS injection
- **Solución:** Actualizado a última versión
- **Impacto:** Sin breaking changes

---

## 🔧 Cambios Requeridos por React 19

### 1. Actualizar `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "types": ["react/next", "react-dom/next"]
  }
}
```

### 2. Actualizar imports en componentes

**Antes (React 18):**
```typescript
import { FC, ReactNode } from 'react';

const Component: FC<{ children: ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};
```

**Después (React 19):**
```typescript
import { ReactNode } from 'react';

const Component = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};
```

### 3. Actualizar `use client` directives

React 19 es más estricto con Server/Client Components:

```typescript
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [state, setState] = useState(0);
  // ...
}
```

---

## 🛡️ Configuración de Seguridad

### Variables de Entorno

Asegúrate de que estos valores estén configurados:

```bash
# .env.local
JWT_SECRET=tu-secreto-muy-largo-y-aleatorio-minimo-32-caracteres
API_KEY=tu-api-key-segura
DATABASE_URL="file:./dev.db"
NODE_ENV=development
```

### Generación de Secrets

```bash
# Generar JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generar API_KEY seguro
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔍 Auditoría de Seguridad

### Comandos Disponibles

```bash
# Auditar vulnerabilidades
pnpm audit

# Auditar solo moderadas o superiores
pnpm audit:moderate

# Intentar fix automático
pnpm audit:fix

# Ver reporte detallado
pnpm audit --json > audit-report.json
```

### Frecuencia Recomendada

- **Desarrollo:** Semanalmente
- **Pre-producción:** Antes de cada release
- **Producción:** Mensualmente + alerts automáticas

---

## 📋 Checklist de Seguridad

### Antes de Deploy

- [ ] Actualizar todas las dependencias
- [ ] Ejecutar `pnpm audit`
- [ ] Verificar no hay vulnerabilidades HIGH o CRITICAL
- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET generado aleatoriamente (>32 chars)
- [ ] API_KEY configurada correctamente
- [ ] CORS configurado en producción
- [ ] Rate limiting habilitado
- [ ] HTTPS configurado en producción
- [ ] Headers de seguridad configurados

### Headers de Seguridad (next.config.ts)

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

---

## 🚨 Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor:

1. **NO** crear un issue público
2. Enviar email a: security@tudominio.com
3. Incluir:
   - Descripción de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Solución propuesta (si existe)

---

## 📚 Recursos

- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/security)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [pnpm Audit](https://pnpm.io/cli/audit)

---

## 🔄 Actualización Continua

### Dependabot / Renovate

Considera configurar actualizaciones automáticas:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/apps/next-host-demo"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "jonathanludena"
```

---

**Última actualización:** 2025-01-26
**Versión:** 1.0.0