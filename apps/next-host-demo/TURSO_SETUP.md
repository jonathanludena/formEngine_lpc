# 🚀 Configuración de Turso para Deploy en Vercel

Este proyecto está configurado para usar **SQLite local** en desarrollo y **Turso** (SQLite en la nube) en producción.

## 📋 Prerequisitos

- Cuenta en [Turso](https://turso.tech) (gratis hasta 500 DBs)
- CLI de Turso instalado
- Proyecto configurado en Vercel

## 🔧 Setup de Turso

### 1. Instalar Turso CLI

**Windows (PowerShell):**

```powershell
irm https://get.tur.so/install.ps1 | iex
```

**macOS/Linux:**

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### 2. Crear cuenta y login

```bash
turso auth signup
turso auth login
```

### 3. Crear base de datos

```bash
# Crear DB para la demo
turso db create formengine-demo

# Ver detalles de la DB
turso db show formengine-demo
```

Esto te mostrará:

- **URL**: `libsql://formengine-demo-[username].turso.io`
- **Región**: Elegida automáticamente

### 4. Obtener URL y Token

```bash
# Obtener la URL de conexión
turso db show formengine-demo --url

# Crear token de autenticación
turso db tokens create formengine-demo
```

**Ejemplo de output:**

```
URL: libsql://formengine-demo-youruser.turso.io
Token: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 5. Aplicar el schema a Turso

```bash
# Opción A: Usar prisma db push (recomendado para primera vez)
DATABASE_URL="libsql://formengine-demo-youruser.turso.io" \
TURSO_AUTH_TOKEN="your-token-here" \
pnpm db:push

# Opción B: Usar migraciones
DATABASE_URL="libsql://formengine-demo-youruser.turso.io" \
TURSO_AUTH_TOKEN="your-token-here" \
pnpm prisma migrate deploy
```

### 6. Popular con datos (seed)

```bash
# Crear archivo .env.turso temporal
cat > .env.turso << EOF
DATABASE_URL="libsql://formengine-demo-youruser.turso.io"
TURSO_AUTH_TOKEN="your-token-here"
EOF

# Ejecutar seed
dotenv -e .env.turso -- pnpm prisma:seed

# Eliminar archivo temporal
rm .env.turso
```

## 🌐 Configuración en Vercel

### 1. Ir a tu proyecto en Vercel

Dashboard → Tu Proyecto → Settings → Environment Variables

### 2. Agregar variables de entorno

**Para Production:**

| Name                  | Value                                        | Environment |
| --------------------- | -------------------------------------------- | ----------- |
| `DATABASE_URL`        | `libsql://formengine-demo-youruser.turso.io` | Production  |
| `TURSO_AUTH_TOKEN`    | `eyJhbGciOiJFZERTQSI...`                     | Production  |
| `JWT_SECRET`          | `[tu-secret-seguro-aqui]`                    | Production  |
| `API_KEY`             | `[tu-api-key-aqui]`                          | Production  |
| `NEXT_PUBLIC_APP_URL` | `https://formengine-demo.vercel.app`         | Production  |

**Para Preview (opcional):**

Puedes crear una DB separada para preview:

```bash
turso db create formengine-preview
```

Y configurar las mismas variables con el sufijo de Preview en Vercel.

### 3. Redeploy

```bash
# Desde tu terminal local
vercel --prod
```

O haz un push a la rama configurada en Vercel (ej: `main`).

## ✅ Verificar que funciona

### 1. Check de la DB en Turso

```bash
# Abrir shell SQL
turso db shell formengine-demo

# Verificar tablas
.tables

# Contar registros
SELECT COUNT(*) FROM Broker;
SELECT COUNT(*) FROM Insurer;
SELECT COUNT(*) FROM Plan;

# Salir
.quit
```

### 2. Test en producción

```bash
# Verificar endpoint de brokers
curl https://formengine-demo.vercel.app/api/brokers

# Debería retornar:
# {"data":[{"id":"...","name":"LPC Insurance Broker",...}]}
```

## 🔄 Actualizar datos en Turso

### Agregar más datos

```bash
# Conectar a Turso
turso db shell formengine-demo

# Ejecutar SQL directamente
INSERT INTO Broker (id, name, code, email, phone, createdAt, updatedAt)
VALUES ('uuid-here', 'Nuevo Broker', 'NB001', 'nuevo@broker.com', '+593-X-XXX-XXXX', datetime('now'), datetime('now'));
```

### Re-seed completo

```bash
# ADVERTENCIA: Esto eliminará todos los datos
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." pnpm prisma:seed
```

## 💰 Límites del plan gratuito de Turso

- ✅ 500 bases de datos
- ✅ 9 GB de almacenamiento total
- ✅ 1 billón de rows leídas/mes
- ✅ Unlimited queries
- ✅ Regiones globales

**Suficiente para:**

- Múltiples proyectos demo
- Aplicaciones pequeñas en producción
- Testing y staging environments

## 🔒 Seguridad

### Rotar tokens

```bash
# Invalidar tokens anteriores y crear uno nuevo
turso db tokens create formengine-demo --expiration 30d

# Actualizar en Vercel inmediatamente
```

### Variables de entorno

❌ **NUNCA** commites los archivos `.env.local` o `.env.turso`  
✅ Solo commitea `.env.example` con valores placeholder

## 🐛 Troubleshooting

### Error: "URL_INVALID"

**Causa:** `DATABASE_URL` no está configurada correctamente.

**Solución:**

```bash
# Verificar que la URL empiece con libsql://
echo $DATABASE_URL
```

### Error: "UNAUTHORIZED"

**Causa:** `TURSO_AUTH_TOKEN` faltante o inválido.

**Solución:**

```bash
# Regenerar token
turso db tokens create formengine-demo
# Actualizar en Vercel
```

### Error: "Connection timeout"

**Causa:** La DB puede estar en sleep mode (plan gratis).

**Solución:**

```bash
# Hacer ping a la DB
turso db shell formengine-demo "SELECT 1"
```

### Build falla en Vercel

**Causa:** Prisma genera el cliente durante build, pero no puede conectar a Turso.

**Solución:** ✅ Ya configurado - `prisma generate` no necesita conexión a DB.

## 📚 Recursos

- [Turso Docs](https://docs.turso.tech/)
- [Prisma + Turso Guide](https://www.prisma.io/docs/orm/overview/databases/turso)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

## 🎯 Checklist de Deploy

- [ ] Cuenta Turso creada
- [ ] DB `formengine-demo` creada
- [ ] Schema aplicado con `db:push`
- [ ] Datos populados con `prisma:seed`
- [ ] Variables configuradas en Vercel
- [ ] Deploy ejecutado
- [ ] API endpoints verificados
- [ ] Datos visibles en la app

---

**¿Necesitas ayuda?** Revisa los logs de Vercel o ejecuta `turso db shell` para debuggear.
