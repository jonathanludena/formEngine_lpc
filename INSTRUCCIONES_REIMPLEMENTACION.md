Objetivo
Re-implementar la demo para consumir los formularios (ClaimForm.tsx e InsuranceQuoteForm.tsx) desde una app host SSR con Next.js (App Router), demostrando:

- Que los formularios pueden instalarse como dependencia (librería publicada en GitHub Packages).
- Que reciben datos de negocio y envían datos al backend sin exponer URLs ni credenciales (via API Routes internos).
- Que la comunicación Host ⇄ Form se hace exclusivamente por CustomEvents (no props), con control de estados (loading/success) desde el host.
- Que el host controla adaptación/transformación/validación de datos antes de consumir el backend real.
- Que se utilizan Server Components + skeletons, lazy loading, Atomic Design, Tailwind y Design Tokens.
- Que el empaquetado de la librería usa Rollup con tree-shaking y se publica en GitHub Packages.
- Que se generan schemas y seeds con Prisma (DB: SQLite) y endpoints de servicios con API Routes.
- Que la seguridad se implementa con validación de API key (server-to-server) y generación/validación de tokens de sesión (máx. 1 hora).

Repositorio base

- Repo: jonathanludena/formEngine_lpc
- Mantener y reutilizar los formularios ClaimForm.tsx e InsuranceQuoteForm.tsx (refactor si fuese necesario para cumplir con CustomEvents).
- Mantener el despliegue de la librería a GitHub Packages; reemplazar Vite por Rollup si aplica.

Alcance funcional

- Demo en Next.js (SSR) que demuestra:
  - Nuevos clientes: registro de cotizaciones, registro de prospectos.
  - Clientes existentes: registro de reclamos, consulta de clientes, consulta de asegurados.
- Colecciones/entidades (Prisma + seeds):
  - Broker (1 broker para la demo).
  - Aseguradoras (ligadas al broker).
  - Planes (ligados a aseguradoras).
  - Vehículos: marcas, modelos y tipos (para el mercado Ecuador).
  - Ubicaciones: provincias y cantones (Ecuador).
  - Datos básicos de cliente: ocupación laboral, estado civil, tipo de documento de identificación.
  - Clientes, Asegurados, Prospectos, Cotizaciones, Reclamos (con timestamps de creación y actualización).
- API Routes en Next.js para:
  - POST /api/quotes -> registro de cotizaciones (nuevos clientes).
  - POST /api/prospects -> registro de prospectos (nuevos clientes).
  - POST /api/claims -> registro de reclamos (clientes existentes).
  - GET /api/customers -> consulta de clientes (por query).
  - GET /api/insured -> consulta de asegurados (por customerId o query).
  - GET /api/brokers -> 1 broker para demo.
  - GET /api/insurers -> aseguradoras por broker.
  - GET /api/plans -> planes por aseguradora.
  - GET /api/vehicles/makes -> marcas (Ecuador).
  - GET /api/vehicles/models -> modelos por marca.
  - GET /api/vehicles/types -> tipos de vehículo.
  - GET /api/locations/provinces -> provincias (Ecuador).
  - GET /api/locations/cantons -> cantones por provincia.
  - GET /api/meta/occupations -> ocupaciones laborales.
  - GET /api/meta/marital-status -> estados civiles.
  - GET /api/meta/id-doc-types -> tipos de documento de identificación.
  - POST /api/auth/token -> emisión de token de sesión (exp: máx. 1h).
  - Middleware: validación de token en rutas protegidas (POST/operacionales).

Arquitectura y lineamientos

1. App host en Next.js (App Router)
   - Directorio sugerido: apps/next-host-demo
   - Server Components para páginas/containers (data fetching) y Client Components para interactividad (formularios).
   - Lazy loading: dynamic import de los formularios (sin SSR) con skeletons.
   - Seguridad: formularios NUNCA llaman APIs externas; todo fetch va al /api del host. El host llama al backend externo (si aplica) con variables de entorno (ocultas) y API key en server-only.
   - Tailwind + Design Tokens (CSS variables) para theming.
   - Atomic Design en la app host (atoms, molecules, organisms, templates, pages).

2. Librería de formularios
   - Paquete: packages/forms (o similar). Exporta ClaimForm e InsuranceQuoteForm como Client Components CSR-only.
   - Comunicación exclusivamente vía CustomEvents (no props).
     - Evento 1: form:start (desde host hacia form)
       detail: {
       brand: string (ID broker),
       feature: 'claim' | 'quote' | 'collection',
       insurance: 'vehicule' | 'health' | 'life' | 'life_savings',
       onSubmit: (data: T) => void | Promise<void>,
       initialData?: Partial<T>
       }
     - Evento 2: form:submit
       - Emisión desde el formulario al host al enviar:
         detail: { data: T }
       - Emisión desde el host al formulario para controlar el botón (loading):
         detail: { isLoading: boolean }
         Nota: el formulario debe distinguir por presencia de “data” vs “isLoading”. Si recibe isLoading=true, muestra spinner en el botón submit; si isLoading=false, lo detiene.
     - Evento 3: form:result (desde host hacia form)
       detail: { ok: boolean, message?: string, error?: string, resultId?: string }
       - El form, al recibir ok=true, debe renderizar un mensaje de success dentro del formulario y resetear estado si corresponde.
   - Los formularios deben:
     - Mantener sólo validación de campos y UI.
     - Exponerse como un React component que forwardRef al nodo DOM raíz para poder escuchar/emitir CustomEvents.
     - Responder dinámicamente a form:start para cargar initialData y onSubmit.
     - Emitir form:submit { data } al enviar; luego el host devuelve form:submit { isLoading:true/false } y finalmente form:result.
   - Centralizar nombres de eventos en packages/forms/src/events/constants.ts para evitar inconsistencias.

3. Backend y datos
   - Prisma con SQLite. Directorio sugerido: /prisma en la app host (o a nivel repo si monorepo).
   - Schema: Broker, Insurer, Plan, VehicleMake, VehicleModel, VehicleType, Province, Canton, Occupation, MaritalStatus, IdDocumentType, Customer, Insured, Prospect, Quote, Claim.
   - Todos los registros de Customer, Insured, Prospect, Quote y Claim deben incluir timestamps:
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   - Seeds:
     - 1 Broker de demo.
     - Aseguradoras ligadas al broker + planes.
     - Catálogo de vehículos (Ecuador): marcas, modelos y tipos (mínimo viable).
     - Ubicaciones (Ecuador): provincias y cantones (mínimo viable).
     - Datos básicos: ocupaciones, estados civiles, tipos de documento.
   - Adaptadores en el host (servicios) para transformar payloads de formularios a modelos de dominio antes de persistir/usar backend externo.

4. Seguridad / ocultación de URLs y llaves
   - Todas las llamadas externas desde API Routes del host (server-side) con API key en headers (x-api-key) tomada de variables de entorno. Nunca exponer API_URL ni API keys al cliente.
   - Tokens de sesión:
     - Implementar emisión y validación de tokens (p.ej. JWT HS256) con expiración máxima de 1 hora.
     - Endpoint POST /api/auth/token para emitir tokens (p.ej., tras verificación mínima del contexto/usuario).
     - Almacenar el token en cookie httpOnly + Secure (o usar Authorization: Bearer en llamadas desde el cliente).
     - Middleware para proteger rutas POST/operacionales (claims, quotes, prospects), verificando token no expirado.
     - Rotación/renovación opcional de token antes del vencimiento (sliding window) solo si se requiere; por defecto, exp. fija de 1h.
   - Cabeceras recomendadas:
     - Cliente → Host API: Authorization: Bearer <session_token> (emitido por /api/auth/token) en POST protegidos.
     - Host → Backend externo: x-api-key: <API_KEY> (server-only).

5. Empaquetado/lib y publicación
   - Reemplazar Vite por Rollup para el build de la librería (tree-shaking).
   - Outputs: ESM + CJS + types. “sideEffects”: false en package.json, “exports” bien definidos.
   - Publicar en GitHub Packages, mantener el pipeline actual adaptándolo si es necesario.
   - Asegurar que la librería sea consumible por Next (sin dependencias de Vite).

6. Documentación
   - Actualizar README y docs/:
     - Cómo instalar la librería desde GitHub Packages.
     - Cómo integrar en Next.js (setup de eventos, dynamic import, SSR considerations).
     - Especificación de eventos (form:start, form:submit con isLoading, form:result) y ciclo de vida.
     - Endpoints disponibles y flujos de alta/consulta.
     - Setup Prisma (migrate/seed), variables .env, scripts de ejecución.
     - Tema/design tokens y Tailwind.
     - Autenticación: emisión de token (1h), uso de Authorization: Bearer, middleware, y uso de API key server-to-server.

Estructura sugerida (monorepo)
/
├─ packages/
│ └─ forms/
│ ├─ src/
│ │ ├─ forms/
│ │ │ ├─ ClaimForm.tsx (CSR, CustomEvents)
│ │ │ └─ InsuranceQuoteForm.tsx (CSR, CustomEvents)
│ │ ├─ events/
│ │ │ ├─ constants.ts (nombres de eventos)
│ │ │ └─ types.ts (tipos de detail de eventos)
│ │ ├─ theme/
│ │ │ ├─ tokens.css (CSS vars)
│ │ │ └─ index.css (Tailwind layers + tokens)
│ │ └─ index.ts
│ ├─ rollup.config.ts
│ ├─ package.json
│ └─ README.md
├─ apps/
│ └─ next-host-demo/
│ ├─ app/
│ │ ├─ (marketing)/
│ │ │ └─ page.tsx
│ │ ├─ (flows)/
│ │ │ ├─ quote/page.tsx (SSR + skeleton + dynamic import)
│ │ │ ├─ claim/page.tsx
│ │ │ └─ search/page.tsx (consulta clientes/asegurados)
│ │ └─ api/
│ │ ├─ quotes/route.ts
│ │ ├─ prospects/route.ts
│ │ ├─ claims/route.ts
│ │ ├─ customers/route.ts
│ │ ├─ insured/route.ts
│ │ ├─ brokers/route.ts
│ │ ├─ insurers/route.ts
│ │ ├─ plans/route.ts
│ │ ├─ vehicles/
│ │ │ ├─ makes/route.ts
│ │ │ ├─ models/route.ts
│ │ │ └─ types/route.ts
│ │ └─ locations/
│ │ ├─ provinces/route.ts
│ │ └─ cantons/route.ts
│ │ └─ meta/
│ │ ├─ occupations/route.ts
│ │ ├─ marital-status/route.ts
│ │ └─ id-doc-types/route.ts
│ ├─ middleware.ts (validación de token en rutas protegidas)
│ ├─ components/
│ │ ├─ atoms/...
│ │ ├─ molecules/...
│ │ ├─ organisms/
│ │ │ ├─ FormHostShell.tsx (listener/dispatcher de eventos)
│ │ │ └─ SkeletonForm.tsx
│ │ └─ templates/...
│ ├─ lib/
│ │ ├─ prisma.ts (cliente Prisma)
│ │ ├─ adapters/ (transformadores host⇄dominio)
│ │ ├─ auth/ (jwt.ts: sign/verify; apiKey.ts)
│ │ └─ services/ (invocan Prisma o APIs externas)
│ ├─ prisma/
│ │ ├─ schema.prisma
│ │ └─ seed.ts
│ ├─ styles/
│ │ ├─ globals.css
│ │ └─ tailwind.config.ts
│ ├─ package.json
│ └─ README.md
├─ docs/
│ └─ ... (actualizado)
└─ README.md (actualizado)

Requisitos técnicos clave

- Next.js (App Router), Node >= LTS.
- TailwindCSS configurado en host y tokens CSS del DS aplicados también en la librería.
- Los formularios (paquete forms) siguen siendo CSR y no deben importar APIs del host.
- Dynamic import en host: import dinámico con ssr: false, y skeletons como loading fallback.
- CustomEvents:
  - Host monta el form (Client Component) con ref al nodo raíz, despacha “form:start” con configuración inicial (sin isLoading).
  - Form emite “form:submit” { data } al enviar.
  - Host, al recibirlo, despacha “form:submit” { isLoading: true } para activar spinner en el botón.
  - Host procesa y, al finalizar, despacha “form:submit” { isLoading: false } seguido de “form:result” { ok, message?, error? } para feedback final.
- API Routes: Usar Prisma en server-only. Validar inputs (zod o similar) y mapear a modelos Prisma. Sellar todos los POST con validación de token en middleware.
- Prisma: SQLite para demo; estructura agnóstica de DB. createdAt/updatedAt en Customer, Insured, Prospect, Quote, Claim.
- Seeds: datos mínimos y coherentes (Ecuador) + ocupaciones, estados civiles, tipos de documento.
- Empaquetado librería con Rollup: outputs ESM/CJS, declarations .d.ts, sideEffects: false, externals React/ReactDOM, tree-shaking habilitado.
- Publicación en GitHub Packages: scope del paquete, auth y README de consumo.
- Seguridad:
  - API key solo en server-to-server (host→backend externo).
  - Emisión y validación de tokens de sesión (JWT) con expiración máx. 1 hora.
  - Cookies httpOnly + Secure o Authorization: Bearer para el cliente → host API.

Criterios de aceptación

- [ ] La app host en Next.js muestra 3 flujos: Quote (nuevo cliente), Prospect (nuevo cliente), Claim (cliente existente), y páginas de consulta (customers, insured).
- [ ] Los formularios se consumen desde un paquete (@<scope>/forms) publicado en GitHub Packages.
- [ ] No se pasa lógica ni datos por props a los formularios; toda comunicación es por CustomEvents (form:start, form:submit con isLoading, form:result).
- [ ] No se expone ninguna URL ni key de APIs en el cliente; toda comunicación externa ocurre vía /api del host, con API key server-only.
- [ ] Server Components + skeletons y lazy loading del formulario están implementados.
- [ ] Prisma con SQLite: migraciones y seeds reproducibles con scripts (dev, db:migrate, db:seed).
- [ ] Colecciones: broker (1), aseguradoras por broker, planes, vehículos (marcas/modelos/tipos), provincias/cantones, ocupaciones, estados civiles, tipos de documento. Endpoints /api retornan datos de estas colecciones.
- [ ] Customer, Insured, Prospect, Quote y Claim se persisten con createdAt/updatedAt.
- [ ] Autenticación: emisión de token (exp. ≤ 1h), middleware de validación activo en POST/operacionales.
- [ ] Documentación actualizada en README y docs (instalación, configuración, endpoints, eventos, temas, ejecución, seguridad).
- [ ] Build de la librería con Rollup + tree-shaking; tipos generados; publicación a GitHub Packages verificada.
- [ ] Tailwind y Design Tokens aplicados en host y librería; Atomic Design en la app host.

Pistas de implementación (resumen)

- CustomEvents (librería):
  - forwardRef al root DOM element; useEffect para addEventListener('form:start' | 'form:submit' | 'form:result', ...).
  - Al enviar el usuario, el form: rootEl.dispatchEvent(new CustomEvent('form:submit', { detail: { data } }))
  - Si recibe form:submit { isLoading: true }, activar spinner en botón; si { isLoading: false }, desactivarlo.
  - Si recibe form:result { ok, message }, mostrar success/toast y reset si corresponde.

- Host (Next.js):
  - Wrapper FormHostShell (Client Component): referencia al DOM del form; dynamic import con { ssr: false, loading: SkeletonForm }.
  - Al montar, despachar form:start con configuración inicial y onSubmit callback.
  - Listener de form:submit { data }: validar/adaptar → set loading: dispatch form:submit { isLoading: true } → fetch('/api/...') → dispatch form:submit { isLoading: false } → dispatch form:result { ok, message?, error? }.

- Autenticación:
  - POST /api/auth/token: emitir JWT (exp ≤ 1h). Guardar en cookie httpOnly + Secure.
  - middleware.ts: validar JWT para rutas POST /api/(quotes|prospects|claims).
  - Host→backend externo: incluir x-api-key: process.env.API_KEY solo desde el servidor.

- Prisma:
  - Modelos con relaciones (broker -> insurers -> plans); vehículos (make -> model -> type); provincias -> cantones; metadata (occupations, maritalStatus, idDocumentType).
  - Campos createdAt/updatedAt en Customer, Insured, Prospect, Quote, Claim.
  - Scripts: "prisma:migrate", "prisma:seed", "dev".

- Rollup (librería):
  - Entradas: src/index.ts
  - Outputs: dist/index.esm.js, dist/index.cjs.js, types
  - Externals: react, react-dom
  - Plugins: typescript, peerDepsExternal, terser (opcional), postcss (para tokens/tailwind si corresponde)

Entregables

- apps/next-host-demo listo para deploy (Vercel recomendado).
- packages/forms compilable y publicable a GitHub Packages.
- Prisma schema + seeds funcionando (incluye ocupación, estado civil, tipo de documento).
- Middleware y emisión/validación de tokens (exp. ≤ 1h) funcionando.
- Documentación actualizada (README root, README de la app host, README del paquete, docs/).

Notas

- Mantener la demo CSR en GitHub Pages sólo como referencia visual básica si se desea, pero la demo oficial de integración debe ser la de Next.js.
- Si existen ajustes mínimos en ClaimForm/InsuranceQuoteForm para soportar CustomEvents, realizar refactor sin agregar lógica de negocio.
