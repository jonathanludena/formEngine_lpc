# Release Process - @jonathanludena/forms

Este documento explica el proceso de versionado y publicación del paquete de formularios.

## 📋 Tabla de Contenidos

- [Configuración](#configuración)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Conventional Commits](#conventional-commits)
- [Comandos de Release](#comandos-de-release)
- [Publicación](#publicación)
- [Troubleshooting](#troubleshooting)

## 🔧 Configuración

### Archivos de Configuración

El paquete `packages/forms` tiene su propia configuración de release independiente:

```
packages/forms/
├── .release-it.json       # Configuración de release-it
├── commitlint.config.cjs  # Reglas de commits
├── CHANGELOG.md           # Changelog del paquete
└── package.json           # Scripts de release
```

### Scripts Disponibles

```json
{
  "release": "release-it",
  "release:patch": "release-it patch",
  "release:minor": "release-it minor",
  "release:major": "release-it major"
}
```

## 🔄 Flujo de Trabajo

### 1. Desarrollo

Trabaja en tu feature/fix con commits siguiendo Conventional Commits:

```bash
cd packages/forms

# Ejemplo: Nueva característica
git commit -m "feat(forms): add phone validation to ClaimForm"

# Ejemplo: Bug fix
git commit -m "fix(events): correct type inference for FormStartDetail"

# Ejemplo: Breaking change
git commit -m "feat(quote)!: change insurance type enum values"
```

### 2. Build y Tests

Antes de hacer release, verifica que todo funciona:

```bash
cd packages/forms

# Build
pnpm build

# Tests
pnpm test

# Lint
pnpm lint
```

### 3. Release

Ejecuta el comando de release apropiado:

```bash
cd packages/forms

# Interactivo (recomendado para la primera vez)
pnpm release

# O específico
pnpm release:patch  # 3.0.0 → 3.0.1
pnpm release:minor  # 3.0.0 → 3.1.0
pnpm release:major  # 3.0.0 → 4.0.0
```

### 4. Publicación

Después del release, publica a GitHub Packages:

```bash
cd packages/forms

# Asegúrate de estar autenticado
npm login --registry=https://npm.pkg.github.com

# Publica
pnpm publish
```

## 📝 Conventional Commits

### Formato

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type       | Changelog Section | Bump  |
| ---------- | ----------------- | ----- |
| `feat`     | ✨ Features       | MINOR |
| `fix`      | 🐛 Bug Fixes      | PATCH |
| `perf`     | ⚡ Performance    | PATCH |
| `refactor` | ♻️ Refactoring    | -     |
| `docs`     | 📚 Documentation  | -     |
| `style`    | 🎨 Styling        | -     |
| `test`     | 🧪 Tests          | -     |
| `build`    | 🏗️ Build System   | -     |
| `ci`       | 👷 CI             | -     |
| `chore`    | (oculto)          | -     |

### Scopes Obligatorios

**Todos los commits deben incluir un scope:**

- `forms` - Cambios generales en formularios
- `claim` - ClaimForm específico
- `quote` - InsuranceQuoteForm específico
- `events` - Sistema de CustomEvents
- `components` - Componentes compartidos
- `atoms` - Componentes atómicos
- `molecules` - Componentes moleculares
- `ui` - Componentes UI base
- `schemas` - Schemas de validación Zod
- `types` - Tipos TypeScript
- `theme` - Design tokens y estilos
- `build` - Configuración de build
- `deps` - Dependencias
- `release` - Proceso de release

### Ejemplos

```bash
# Feature nueva
git commit -m "feat(claim): add occupation field to health claims"

# Bug fix
git commit -m "fix(schemas): correct phone number regex pattern"

# Breaking change
git commit -m "feat(events)!: rename form:start to form:init

BREAKING CHANGE: event name changed from 'form:start' to 'form:init'
Update all event listeners accordingly."

# Performance
git commit -m "perf(forms): optimize re-renders with React.memo"

# Refactoring
git commit -m "refactor(atoms): extract common input logic"

# Documentation
git commit -m "docs(readme): add CustomEvents flow diagram"

# Dependencies
git commit -m "chore(deps): update zod to 3.23.9"
```

## 🚀 Comandos de Release

### release-it Interactivo

```bash
pnpm release
```

Te preguntará:

1. ¿Qué versión? (patch/minor/major)
2. ¿Generar changelog? (yes)
3. ¿Hacer commit? (yes)
4. ¿Crear tag? (yes)
5. ¿Hacer push? (yes)

### Release Automático

```bash
# Patch (3.0.0 → 3.0.1)
pnpm release:patch

# Minor (3.0.0 → 3.1.0)
pnpm release:minor

# Major (3.0.0 → 4.0.0)
pnpm release:major
```

### Dry Run

Para ver qué haría sin ejecutar:

```bash
pnpm release --dry-run
```

### Ver Próxima Versión

```bash
pnpm release --release-version
```

## 📦 Publicación

### Primera Vez: Autenticación

```bash
# Crear token en GitHub:
# Settings → Developer settings → Personal access tokens → Tokens (classic)
# Permisos: write:packages, read:packages, delete:packages

# Login
npm login --registry=https://npm.pkg.github.com
# Username: tu-username
# Password: ghp_token_aqui
# Email: tu-email
```

### Publicar

```bash
cd packages/forms
pnpm publish
```

### Verificar Publicación

```bash
# Ver versiones publicadas
npm view @jonathanludena/forms versions

# Ver última versión
npm view @jonathanludena/forms version

# Ver info completa
npm view @jonathanludena/forms
```

## 🎯 Proceso Completo Paso a Paso

```bash
# 1. Asegúrate de estar en main/master
git checkout main
git pull origin main

# 2. Ve al paquete forms
cd packages/forms

# 3. Verifica que todo compila
pnpm build

# 4. Ejecuta tests
pnpm test

# 5. Ejecuta release (interactivo)
pnpm release

# 6. Publica a GitHub Packages
pnpm publish

# 7. Verifica la publicación
npm view @jonathanludena/forms version
```

## 🔍 Qué Hace release-it

Cuando ejecutas `pnpm release`, release-it:

1. **Verifica** que el working directory esté limpio
2. **Ejecuta** `pnpm build` (hook before:init)
3. **Determina** la próxima versión basada en commits
4. **Genera** el CHANGELOG.md automáticamente
5. **Actualiza** version en package.json
6. **Hace commit** con mensaje "chore(forms): release vX.Y.Z"
7. **Crea tag** con formato `forms-vX.Y.Z`
8. **Hace push** del commit y tag
9. **Muestra** resumen del release

## 🐛 Troubleshooting

### Error: Working directory not clean

```bash
# Ver cambios pendientes
git status

# Commitea o stash
git add .
git commit -m "chore(forms): prepare for release"
```

### Error: No commits since last release

```bash
# Verifica commits
git log --oneline

# Asegúrate de tener commits después del último tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

### Error: Authentication failed (npm publish)

```bash
# Re-login
npm logout --registry=https://npm.pkg.github.com
npm login --registry=https://npm.pkg.github.com
```

### Error: Package already exists

```bash
# La versión ya fue publicada
# Incrementa la versión y vuelve a publicar
pnpm release:patch
pnpm publish
```

### Revertir un release (antes de push)

```bash
# Deshacer último commit (mantiene cambios)
git reset --soft HEAD~1

# Eliminar tag local
git tag -d forms-vX.Y.Z
```

### Revertir un release (después de push)

```bash
# Crea un nuevo release que revierte
git revert HEAD

# O crea hotfix
pnpm release:patch
```

## 📊 Ejemplos de CHANGELOG Generado

```markdown
## [3.1.0](https://github.com/.../compare/forms-v3.0.0...forms-v3.1.0) (2025-11-26)

### ✨ Features

- **claim:** add occupation field to health claims ([a1b2c3d](commit-url))
- **events:** add form:cancel event ([e4f5g6h](commit-url))

### 🐛 Bug Fixes

- **schemas:** correct phone validation regex ([i7j8k9l](commit-url))
- **ui:** fix button disabled state styling ([m1n2o3p](commit-url))

### 📚 Documentation

- **readme:** update CustomEvents examples ([q4r5s6t](commit-url))
```

## 🎓 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [release-it Documentation](https://github.com/release-it/release-it)
- [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog)

---

**Última actualización:** Noviembre 2025  
**Mantenedor:** LPC Team
