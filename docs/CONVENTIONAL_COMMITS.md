# 📝 Guía de Conventional Commits y Releases

## 🎯 Objetivo

Este proyecto usa **Conventional Commits** para mantener un historial de cambios estructurado y generar automáticamente el CHANGELOG.

## 📋 Formato de Commits

### Estructura

```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[notas de pie opcional]
```

### Tipos Principales

| Tipo | Descripción | Bump de Versión |
|------|-------------|-----------------|
| `feat` | Nueva característica | `minor` (0.X.0) |
| `fix` | Corrección de bug | `patch` (0.0.X) |
| `docs` | Solo cambios de documentación | - |
| `style` | Formato, puntos y comas, etc. | - |
| `refactor` | Refactorización de código | - |
| `perf` | Mejora de performance | `patch` |
| `test` | Agregar o corregir tests | - |
| `build` | Cambios en build o dependencias | - |
| `ci` | Cambios en CI/CD | - |
| `chore` | Tareas de mantenimiento | - |
| `revert` | Revertir un commit anterior | - |

### Breaking Changes

Para cambios que rompen compatibilidad:

```bash
feat!: eliminar soporte para React 17

BREAKING CHANGE: ahora requiere React 18+
```

## ✅ Ejemplos de Commits Correctos

```bash
# Nueva característica
feat(accordion): agregar componente Accordion collapsable

# Corrección de bug
fix(select): corregir cierre de dropdown con Escape

# Mejora de performance
perf(form): optimizar validación de formularios grandes

# Breaking change
feat(components)!: eliminar componentes legacy

BREAKING CHANGE: HealthQuoteForm y VehicleQuoteForm fueron removidos.
Usar InsuranceQuoteForm en su lugar.

# Documentación
docs(readme): actualizar guía de instalación

# Refactor
refactor(utils): simplificar función cn()

# Build
build(deps): actualizar vite a 6.4.1

# Múltiples cambios
feat(forms): agregar validación de RUC ecuatoriano

- Agregar regex para validación
- Agregar tests
- Actualizar documentación
```

## ❌ Ejemplos de Commits Incorrectos

```bash
# ❌ Sin tipo
actualizar formulario

# ❌ Tipo inválido
update(form): cambiar estilos

# ❌ Primera letra mayúscula
Feat: agregar botón

# ❌ Punto final
feat: agregar botón.

# ❌ Descripción muy larga (>100 caracteres)
feat: agregar un nuevo componente que permite a los usuarios seleccionar múltiples opciones de una lista

# ✅ Correcto
feat: agregar componente de selección múltiple
```

## 🔒 Hooks de Git Configurados

### Pre-commit (`lint-staged`)

Se ejecuta **antes de cada commit**:
- ✅ ESLint en archivos `.ts` y `.tsx`
- ✅ Prettier en archivos `.json`, `.md`, `.yml`

```bash
git add src/components/MyComponent.tsx
git commit -m "feat: agregar MyComponent"
# → Ejecuta lint-staged automáticamente
```

### Commit-msg (`commitlint`)

Valida **el mensaje del commit**:
- ✅ Formato: `tipo(ámbito): descripción`
- ✅ Tipos válidos: feat, fix, docs, etc.
- ✅ Longitud máxima: 100 caracteres

```bash
git commit -m "agregar componente"
# ❌ Error: mensaje no sigue conventional commits

git commit -m "feat: agregar componente"
# ✅ Válido
```

### Pre-push

Se ejecuta **antes de push**:
- ✅ Build de librería (`npm run build:lib`)
- ✅ Verifica que compile sin errores

```bash
git push
# → Ejecuta npm run build:lib
# → Si falla, el push es rechazado
```

## 🚀 Generación de Releases

### Comandos Disponibles

```bash
# Release automático (detecta el tipo de bump según commits)
npm run release

# Patch release (0.0.X) - Solo fixes
npm run release:patch

# Minor release (0.X.0) - Nuevas características
npm run release:minor

# Major release (X.0.0) - Breaking changes
npm run release:major
```

### Proceso de Release

1. **Preparación**
   ```bash
   # Asegúrate de estar en main y actualizado
   git checkout main
   git pull
   ```

2. **Ejecutar Release**
   ```bash
   npm run release
   ```

3. **Release-it hará:**
   - ✅ Detectar commits desde último tag
   - ✅ Determinar nueva versión (basado en commits)
   - ✅ Generar/actualizar `CHANGELOG.md`
   - ✅ Actualizar `package.json` con nueva versión
   - ✅ Crear commit: `chore: release X.Y.Z`
   - ✅ Crear tag git: `X.Y.Z`
   - ⚠️ **NO hace push** (manual)

4. **Push Manual**
   ```bash
   # Revisar cambios
   git log --oneline -5
   git show HEAD
   
   # Push con tags
   git push
   git push --tags
   ```

### Ejemplo Completo

```bash
# 1. Desarrollo
git checkout -b feat/new-component
# ... hacer cambios ...
git add .
git commit -m "feat(components): agregar Tooltip component"

# 2. Merge a main
git checkout main
git merge feat/new-component
git push

# 3. Release
npm run release
# Release-it detecta "feat" → bump minor
# 2.1.0 → 2.2.0
# Genera CHANGELOG.md con el nuevo feat

# 4. Push del release
git push
git push --tags

# 5. Publicar paquete (manual)
npm publish
```

## 📊 CHANGELOG Automático

El `CHANGELOG.md` se genera **automáticamente** con:

- ✅ **Features** (`feat:`) → Sección "Features"
- ✅ **Fixes** (`fix:`) → Sección "Bug Fixes"
- ✅ **Breaking Changes** → Sección destacada al inicio
- ✅ **Performance** (`perf:`) → Sección "Performance"
- ✅ Links a commits en GitHub

**Ejemplo de entrada generada:**

```markdown
## [2.2.0] - 2025-11-24

### Features

* **components:** agregar Tooltip component ([abc1234](https://github.com/USER/repo/commit/abc1234))
* **forms:** agregar validación de RUC ([def5678](https://github.com/USER/repo/commit/def5678))

### Bug Fixes

* **select:** corregir cierre de dropdown ([xyz9012](https://github.com/USER/repo/commit/xyz9012))
```

## 🛠️ Configuración

### .release-it.json

```json
{
  "git": {
    "commitMessage": "chore: release ${version}",
    "tagName": "${version}",
    "requireUpstream": false,
    "push": false,  // Push manual para revisión
    "tag": true
  },
  "npm": {
    "publish": false  // Publicación manual
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "conventionalcommits",
      "infile": "CHANGELOG.md"
    }
  }
}
```

### commitlint.config.js

```javascript
module.exports = { 
  extends: ['@commitlint/config-conventional'] 
};
```

### .lintstagedrc.json

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

## 🚨 Troubleshooting

### Error: "commit message does not follow conventional format"

```bash
# ❌ Error
git commit -m "update form"

# ✅ Solución
git commit -m "feat: update form"
```

### Error: "ESLint errors detected"

```bash
# Revisar errores
npm run lint

# Corregir automáticamente
npx eslint . --fix

# Re-intentar commit
git add .
git commit -m "fix: corregir errores de lint"
```

### Bypass Hooks (NO recomendado)

```bash
# Solo en emergencias
git commit -m "mensaje" --no-verify
```

### Ver Commits para el Próximo Release

```bash
# Ver commits desde último tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline

# Preview del changelog
npx conventional-changelog -p angular
```

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Release-it Docs](https://github.com/release-it/release-it)
- [Commitlint Rules](https://commitlint.js.org/#/reference-rules)
- [Semantic Versioning](https://semver.org/)

## 🎯 Workflow Diario

```bash
# 1. Nueva rama
git checkout -b feat/my-feature

# 2. Desarrollo + commits semánticos
git add .
git commit -m "feat(scope): descripción"
# → pre-commit: lint-staged
# → commit-msg: commitlint valida formato

# 3. Push
git push
# → pre-push: build:lib

# 4. Pull Request → Merge a main

# 5. Release (desde main)
npm run release
# → Genera CHANGELOG
# → Crea tag
# → Commit de release

# 6. Push manual
git push && git push --tags

# 7. Publicar (opcional)
npm publish
```

## ✅ Checklist de Commit

Antes de hacer commit, verifica:

- [ ] El mensaje sigue el formato: `tipo(ámbito): descripción`
- [ ] El tipo es válido (`feat`, `fix`, `docs`, etc.)
- [ ] La descripción es clara y concisa (<100 caracteres)
- [ ] No hay punto final en la descripción
- [ ] Primera letra en minúscula
- [ ] El código pasa lint (`npm run lint`)
- [ ] El código compila (`npm run build:lib`)

---

**Versión**: 2.1.0  
**Fecha**: 24 Noviembre 2025
