# 🚀 Guía de Instalación y Ejecución Rápida

Esta guía te llevará desde la clonación hasta tener la aplicación corriendo en **5 minutos**.

## Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** >= 18 ([descargar](https://nodejs.org/))
- **pnpm** >= 8 (instalar con: `npm install -g pnpm`)

## Paso 1: Clonar e Instalar

```bash
# Clonar repositorio
git clone https://github.com/jonathanludena/formEngine_lpc.git
cd formEngine_lpc

# Instalar todas las dependencias
pnpm install
```

## Paso 2: Configurar Base de Datos

```bash
# Ir a la app Next.js
cd apps/next-host-demo

# Copiar variables de entorno
cp .env.example .env.local

# Generar cliente Prisma
pnpm prisma:generate

# Crear y migrar base de datos
pnpm prisma:migrate

# Poblar con datos de demo
pnpm db:seed
```

✅ Deberías ver mensajes de éxito con emojis (🌱, ✅, 🎉)

## Paso 3: Build del Paquete de Formularios

```bash
# Desde la raíz del proyecto
cd ../..
cd packages/forms

# Compilar formularios
pnpm build
```

✅ Deberías ver archivos en `packages/forms/dist/`

## Paso 4: Ejecutar la Aplicación

```bash
# Ir a la app Next.js
cd ../../apps/next-host-demo

# Ejecutar en modo desarrollo
pnpm dev
```

✅ La aplicación estará disponible en: **http://localhost:3000**

## 🎯 Probar la Aplicación

### 1. Página Principal

Abre http://localhost:3000 y verás:

- Botones para crear cotizaciones
- Botones para registrar reclamos
- Botones para consultas

### 2. Probar un Reclamo

1. Click en "Seguro de Salud" (sección Registrar Reclamo)
2. URL: http://localhost:3000/claim/health
3. Llena el formulario
4. Observa el loading spinner al enviar
5. Ve el mensaje de éxito

### 3. Probar una Cotización

1. Click en "Seguro de Salud" (sección Nueva Cotización)
2. URL: http://localhost:3000/quote/health
3. Llena el formulario
4. Observa el flujo completo de CustomEvents

### 4. Ver la Base de Datos

```bash
# Desde apps/next-host-demo
pnpm prisma:studio
```

Abre http://localhost:5555 para ver los datos en Prisma Studio.

## 🔍 Verificar que Todo Funciona

### Check 1: API Routes

```bash
# Test endpoint de brokers
curl http://localhost:3000/api/brokers

# Deberías ver JSON con el broker LPC
```

### Check 2: Autenticación

```bash
# Obtener token JWT
curl -X POST http://localhost:3000/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId":"demo","email":"demo@example.com"}'

# Deberías ver: {"success":true,"token":"...","expiresIn":3600}
```

### Check 3: Formularios

1. Abre http://localhost:3000/claim/health
2. Abre DevTools (F12) → Console
3. El formulario debe cargar sin errores
4. Rellena y envía → verifica que aparece mensaje de éxito

## 🛠️ Comandos Útiles

```bash
# Desarrollo (watch mode)
pnpm dev                    # En apps/next-host-demo

# Build completo
pnpm build                  # Desde raíz (builds forms + next)

# Linting
pnpm lint                   # En cualquier paquete

# Resetear base de datos
cd apps/next-host-demo
rm prisma/dev.db
pnpm prisma:migrate
pnpm db:seed

# Ver logs de build
pnpm build:forms           # Build solo formularios
pnpm build:next            # Build solo Next.js
```

## ❌ Problemas Comunes

### Error: "Cannot find module '@jonathanludena/forms'"

**Solución:**

```bash
cd packages/forms
pnpm build
```

### Error: "PrismaClient is not initialized"

**Solución:**

```bash
cd apps/next-host-demo
pnpm prisma:generate
```

### Error: "Database not found"

**Solución:**

```bash
cd apps/next-host-demo
pnpm prisma:migrate
pnpm db:seed
```

### Puerto 3000 ocupado

**Solución:**

```bash
# Usa otro puerto
PORT=3001 pnpm dev
```

### Problemas con pnpm

**Solución:**

```bash
# Reinstalar
pnpm store prune
rm -rf node_modules
pnpm install
```

## 📱 Estructura de URLs

| URL             | Descripción                       |
| --------------- | --------------------------------- |
| `/`             | Página principal con navegación   |
| `/claim/health` | Formulario de reclamo de salud    |
| `/quote/health` | Formulario de cotización de salud |
| `/api/brokers`  | API: lista de brokers             |
| `/api/insurers` | API: lista de aseguradoras        |
| `/api/plans`    | API: lista de planes              |
| `/api/claims`   | API: CRUD de reclamos             |
| `/api/quotes`   | API: CRUD de cotizaciones         |

## 🧪 Datos de Prueba

Después del seed, tendrás:

**Broker:**

- LPC Insurance Broker

**Aseguradoras:**

- Liberty Seguros Ecuador
- MetLife Ecuador
- Seguros Equinoccial

**Planes:**

- 2 de salud
- 2 vehiculares
- 1 de vida

**Vehículos:**

- 8 marcas (Chevrolet, Toyota, Nissan, etc.)
- 10+ modelos

**Ubicaciones:**

- 6 provincias de Ecuador
- 10+ cantones

## 📚 Siguiente Paso

Lee [README_MONOREPO.md](README_MONOREPO.md) para:

- Entender la arquitectura completa
- Aprender sobre CustomEvents
- Ver ejemplos de integración
- Conocer todos los endpoints

O lee [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) para:

- Estado de implementación
- Features completadas vs pendientes
- Próximos pasos recomendados

## 💡 Tips de Desarrollo

1. **Hot Reload**: Los cambios en formularios requieren rebuild (`pnpm build`)
2. **Prisma Studio**: Útil para ver/editar datos visualmente
3. **DevTools**: Network tab para ver requests/responses
4. **Console**: Observa los CustomEvents en acción

## 🎉 ¡Listo!

Si llegaste hasta aquí sin errores, **¡felicitaciones!** 🎊

Tienes un monorepo completo funcionando con:

- ✅ Formularios con CustomEvents
- ✅ Next.js App Router
- ✅ Prisma + SQLite
- ✅ JWT Authentication
- ✅ API Routes protegidas

**Happy coding! 🚀**

---

¿Problemas? Abre un issue en GitHub: https://github.com/jonathanludena/formEngine_lpc/issues
