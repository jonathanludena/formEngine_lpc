# ✅ Checklist de Verificación Post-Instalación

Use este checklist para verificar que la instalación y configuración sean correctas.

## 📦 Instalación de Dependencias

```bash
# En la raíz del proyecto
pnpm install
```

**⚠️ Warnings Esperados:**

- `deprecated sub-dependencies` - No crítico, ignorar
- `Ignored build scripts` - Ya configurado en .npmrc

- [ ] Sin errores de instalación
- [ ] `node_modules` creado en raíz
- [ ] `node_modules` creado en `packages/forms`
- [ ] `node_modules` creado en `apps/next-host-demo`

**Si ves warning sobre build scripts:**

```bash
# Verifica que .npmrc tenga: enable-pre-post-scripts=true
cat .npmrc
```

## 🗄️ Base de Datos

```bash
cd apps/next-host-demo
pnpm prisma:generate
pnpm prisma:migrate
pnpm db:seed
```

- [ ] Archivo `prisma/dev.db` creado
- [ ] Prisma Client generado en `node_modules/.prisma`
- [ ] Migraciones aplicadas sin errores
- [ ] Seed completado con mensaje 🎉
- [ ] Verificar datos con `pnpm prisma:studio`

### Verificación de Datos

En Prisma Studio (http://localhost:5555):

- [ ] 1 registro en tabla `Broker`
- [ ] 3 registros en tabla `Insurer`
- [ ] 5 registros en tabla `Plan`
- [ ] 8 registros en tabla `VehicleMake`
- [ ] 10+ registros en tabla `VehicleModel`
- [ ] 6 registros en tabla `Province`
- [ ] 10+ registros en tabla `Canton`
- [ ] 10 registros en tabla `Occupation`
- [ ] 5 registros en tabla `MaritalStatus`
- [ ] 3 registros en tabla `IdDocumentType`

## 📚 Paquete de Formularios

```bash
cd packages/forms
pnpm build
```

- [ ] Build completado sin errores
- [ ] Directorio `dist/` creado
- [ ] Archivo `dist/index.js` existe (ESM)
- [ ] Archivo `dist/index.cjs` existe (CommonJS)
- [ ] Archivo `dist/index.d.ts` existe (Types)
- [ ] Archivo `dist/style.css` existe

### Verificación de Exports

```bash
cat dist/index.js | head -20
```

- [ ] Se ven exports de ClaimForm, InsuranceQuoteForm
- [ ] Se ven exports de eventos (FORM_EVENTS, types)

## 🌐 Aplicación Next.js

```bash
cd apps/next-host-demo
pnpm dev
```

- [ ] Servidor inicia sin errores
- [ ] Listening on http://localhost:3000
- [ ] Sin errores de compilación

### Verificación Visual

#### 1. Página Principal (http://localhost:3000)

- [ ] Logo/título visible
- [ ] 3 cards (Cotización, Reclamo, Consultas)
- [ ] Botones clicables
- [ ] Estilos aplicados correctamente

#### 2. Reclamo de Salud (http://localhost:3000/claim/health)

- [ ] Título "Registrar Reclamo de Salud"
- [ ] Formulario carga (puede tardar 1-2 seg)
- [ ] Skeleton loader visible brevemente
- [ ] Formulario completo con todos los campos
- [ ] Acordeones funcionan (collapse/expand)

#### 3. Cotización de Salud (http://localhost:3000/quote/health)

- [ ] Título "Cotizar Seguro de Salud"
- [ ] Formulario carga correctamente
- [ ] Campos de formulario visible
- [ ] Checkbox de términos funciona

### Prueba de Flujo Completo

#### Test 1: Enviar Reclamo

1. Ir a http://localhost:3000/claim/health
2. Llenar el formulario:
   - Póliza: `POL-123456`
   - Tipo: `consultation`
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Email: `juan@test.com`
   - Teléfono: `0987654321`
   - Fecha incidente: hoy
   - Descripción: `Consulta médica general`
   - Centro médico: `Hospital Test`
   - Monto: `100`
3. Click en Submit

**Verificaciones:**

- [ ] Botón muestra spinner/loading
- [ ] Loading desaparece
- [ ] Mensaje de éxito aparece (verde)
- [ ] Formulario se resetea

**Verificar en DB:**

```bash
pnpm prisma:studio
```

- [ ] Nuevo registro en tabla `Claim`
- [ ] Nuevo registro en tabla `Customer` (si email nuevo)

#### Test 2: Enviar Cotización

1. Ir a http://localhost:3000/quote/health
2. Llenar formulario básico
3. Marcar checkbox términos
4. Submit

**Verificaciones:**

- [ ] Loading state funciona
- [ ] Mensaje de éxito
- [ ] Nuevo registro en tabla `Quote`
- [ ] Nuevo registro en tabla `Prospect`

## 🔌 API Endpoints

### Test con curl o Postman

#### 1. GET /api/brokers

```bash
curl http://localhost:3000/api/brokers
```

- [ ] Status 200
- [ ] JSON con array `data`
- [ ] 1 broker: "LPC Insurance Broker"

#### 2. GET /api/insurers

```bash
curl http://localhost:3000/api/insurers
```

- [ ] Status 200
- [ ] 3 aseguradoras

#### 3. GET /api/plans

```bash
curl http://localhost:3000/api/plans
```

- [ ] Status 200
- [ ] 5 planes

#### 4. POST /api/auth/token

```bash
curl -X POST http://localhost:3000/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","email":"test@example.com"}'
```

- [ ] Status 200
- [ ] Respuesta contiene `token`
- [ ] `expiresIn: 3600`

#### 5. GET /api/claims

```bash
curl http://localhost:3000/api/claims
```

- [ ] Status 200
- [ ] Array de claims (puede estar vacío si no hay)

#### 6. GET /api/quotes

```bash
curl http://localhost:3000/api/quotes
```

- [ ] Status 200
- [ ] Array de quotes

## 🔒 Seguridad

### Verificar JWT

1. Obtener token:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","email":"test@example.com"}' | \
  jq -r '.token')

echo $TOKEN
```

2. Usar token en request protegido:

```bash
curl http://localhost:3000/api/claims \
  -H "Authorization: Bearer $TOKEN"
```

- [ ] Request exitoso con token válido

3. Probar sin token:

```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

- [ ] Status 401 (Unauthorized)
- [ ] Error: "Authentication required"

## 🧪 DevTools Check

### Console (F12)

Ir a cualquier página de formulario:

- [ ] Sin errores en console (ignorar warnings)
- [ ] Sin errores de módulos no encontrados
- [ ] Sin errores de hidratación

### Network Tab

Al enviar formulario:

- [ ] Request POST visible
- [ ] Status 200 o 201
- [ ] Response JSON correcto

### React DevTools

Si tienes React DevTools instalado:

- [ ] Componentes renderizados correctamente
- [ ] Props pasados correctamente
- [ ] No hay re-renders excesivos

## 📝 Variables de Entorno

```bash
cd apps/next-host-demo
cat .env.local
```

**Verificar que existen:**

- [ ] `DATABASE_URL`
- [ ] `JWT_SECRET`
- [ ] `API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`

## 🎨 Estilos

### Verificar Tailwind

- [ ] Colores aplicados correctamente
- [ ] Responsive funciona (probar en mobile)
- [ ] Hover states funcionan
- [ ] Transiciones suaves

### Verificar Design Tokens

En DevTools → Elements → Computed:

- [ ] Variables CSS `--primary`, `--background`, etc. definidas
- [ ] Valores correctos aplicados

## 📄 Documentación

Verificar que existen estos archivos:

- [ ] `README_MONOREPO.md`
- [ ] `QUICK_START.md`
- [ ] `IMPLEMENTATION_SUMMARY.md`
- [ ] `NEXT_STEPS.md`
- [ ] `EXECUTIVE_SUMMARY.md`
- [ ] `packages/forms/README.md`
- [ ] `INSTRUCCIONES_REIMPLEMENTACION.md`

## 🚀 Performance

### Lighthouse Audit (opcional)

1. Abrir DevTools
2. Tab "Lighthouse"
3. Generar reporte

**Targets mínimos:**

- [ ] Performance: >70
- [ ] Accessibility: >80
- [ ] Best Practices: >80
- [ ] SEO: >80

## ✅ Checklist Final

### Pre-Demo

- [ ] Todos los tests anteriores pasaron
- [ ] Base de datos poblada
- [ ] Formularios funcionan end-to-end
- [ ] API endpoints responden
- [ ] Sin errores en console
- [ ] Documentación revisada

### Pre-Producción (adicional)

- [ ] Tests escritos y pasando
- [ ] Variables de entorno de producción configuradas
- [ ] Secrets rotados (JWT_SECRET, API_KEY)
- [ ] Database migrada a PostgreSQL
- [ ] CI/CD configurado
- [ ] Monitoring configurado
- [ ] Backups configurados

## ❌ Problemas Comunes y Soluciones

### "Cannot find module '@jonathanludena/forms'"

```bash
cd packages/forms
pnpm build
```

### "PrismaClient is not configured"

```bash
cd apps/next-host-demo
pnpm prisma:generate
```

### "ECONNREFUSED localhost:3000"

```bash
# Verificar que el servidor está corriendo
pnpm dev
```

### Puerto 3000 ocupado

```bash
# Usa otro puerto
PORT=3001 pnpm dev
```

### Errores de tipo TypeScript

```bash
# Reinstalar tipos
pnpm install
cd packages/forms && pnpm build
```

## 🎉 Todo Listo!

Si todos los checks están ✅, **¡felicitaciones!**

El sistema está completamente funcional y listo para:

- ✅ Demo
- ✅ Desarrollo adicional
- ✅ Testing
- ✅ Deploy (con ajustes de producción)

---

**Última actualización:** Noviembre 2025  
**Versión del checklist:** 1.0
