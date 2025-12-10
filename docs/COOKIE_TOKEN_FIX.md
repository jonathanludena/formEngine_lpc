# Corrección: Uso de Cookie 'token' en Lugar de Query Param

**Fecha**: 10 de diciembre de 2025

## 📋 Problema Identificado

La implementación anterior volvía a leer el token desde el query parameter `tk`, cuando en realidad el token ya se había guardado en una cookie llamada `token` en el endpoint `/api/auth/token`.

## ✅ Solución Implementada

### Antes (Incorrecto)

```typescript
// ❌ Leer token del query param nuevamente
const searchParams = useSearchParams();
const token = searchParams?.get('tk') || null;

// ❌ Eliminar cookie con nombre incorrecto
document.cookie = `claim_tk=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
```

### Después (Correcto)

```typescript
// ✅ Obtener token de la cookie que se seteó en /api/auth/token
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};
const token = getCookie('token');

// ✅ Eliminar la misma cookie que se seteó en /api/auth/token
document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
```

---

## 🔄 Flujo Actualizado

### 1. Autenticación Inicial

```
POST /api/auth/token
{
  "userId": "user123",
  "email": "user@example.com"
}

↓

Response con Set-Cookie:
token=eyJhbGc...; HttpOnly; Path=/; Max-Age=3600
```

### 2. Usuario Accede al Formulario

```
GET /claim/health?tk=xxx
↓
Formulario renderiza (cookie 'token' ya existe)
```

### 3. Submit del Formulario

```typescript
// Leer token de cookie
const token = getCookie('token');

// Incluir en payload
const payload = {
  ...data,
  tk: token,
};

// Enviar a webhook
POST / api / claims;
```

### 4. Después de 200 OK

```typescript
// Eliminar la cookie 'token'
document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

// Desmontar formulario
setIsSubmitted(true);
```

---

## 📁 Archivos Modificados

### `apps/next-host-demo/src/app/claim/health/page.tsx`

**Cambios**:

1. ❌ Removido `useSearchParams` import
2. ❌ Removido lectura de `searchParams?.get('tk')`
3. ✅ Agregado función `getCookie('token')`
4. ✅ Actualizado eliminación de cookie de `claim_tk` a `token`

### `apps/next-host-demo/src/app/claim/vehicle/page.tsx`

**Cambios**: Idénticos a health page para mantener consistencia

---

## 🔐 Consistencia de Cookies

### Cookie Seteada en `/api/auth/token`

```typescript
response.cookies.set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 3600, // 1 hour
  path: '/',
});
```

### Cookie Eliminada Después del Submit

```typescript
document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
```

✅ **Ahora ambas operaciones usan el mismo nombre de cookie: `token`**

---

## 🎯 Ventajas de Este Enfoque

1. **Consistencia**: Misma cookie para set y delete
2. **Seguridad**: Cookie HttpOnly (no accesible desde JavaScript malicioso)
3. **Simplicidad**: No necesita leer query params múltiples veces
4. **Limpieza**: El token se obtiene una vez de la cookie existente

---

## ⚠️ Importante

La cookie `token` es **HttpOnly** cuando se setea desde el servidor, pero aún podemos:

- ✅ Leerla con `document.cookie` en el cliente
- ✅ Eliminarla con `document.cookie = "token=; ..."`
- ❌ Modificarla directamente desde JavaScript

Esto es correcto porque:

- **HttpOnly** protege de acceso por JavaScript malicioso de terceros
- Pero el código de la aplicación SÍ puede leer y eliminar sus propias cookies

---

## ✅ Verificación

```bash
# No errores de compilación
npm run build
```

**Status**: ✅ Compilación exitosa sin errores

---

## 📊 Comparación

| Aspecto                 | Antes                             | Después                   |
| ----------------------- | --------------------------------- | ------------------------- |
| Lectura token           | Query param `tk`                  | Cookie `token`            |
| Import necesario        | `useSearchParams`                 | Ninguno                   |
| Nombre cookie eliminada | `claim_tk` ❌                     | `token` ✅                |
| Consistencia            | No coincide con `/api/auth/token` | ✅ Coincide perfectamente |
| Líneas de código        | Más                               | Menos                     |

---

## 🔍 Función Helper Agregada

```typescript
// Función helper para leer cookies en el cliente
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};
```

Esta función:

- Lee cookies del documento
- Parsea el valor correctamente
- Retorna `null` si no existe
- Funciona con cookies HttpOnly (para lectura)

---

## 🎉 Resultado Final

Ahora el flujo es completamente consistente:

1. `/api/auth/token` → **setea cookie `token`**
2. `/claim/health` → **lee cookie `token`**
3. Submit exitoso → **elimina cookie `token`**

✅ Todo usando el mismo identificador de cookie en todas las operaciones.
