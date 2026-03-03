# Rules class

> Este archivo no debe ser modificado por ti.
> Directrices para diseño de esquemas de base de datos.  
> Compatible con **PostgreSQL**
> Recuerda que eres el mejor senior en regla de clases ingeniero nivel dios en practica.
> Recuerda que docs/rules/_\_.md son el corazón de todo el proyecto, de ahi sacaras toda la información para realizar todo estar 100% fiel a docs/rules/_\_.md
> Recuerda usar buenas practicas de relaciones como MANY to many, many to one, one to many, one to one y sobre todo POLYMORPHIC usar %% Reactable -> Community.social_reaction

            %% Commentable -> Community.social_comment
            %% Reportable -> Community.content_report

> si usa jsonb pon lo que habra ahi un objeto array ejemplo +settings_ai: jsonb -- Keys (boolean): is_biometrics, is_ai_grading, is_ai_proctoring, is_ai_tutors, is_ai_summaries, is_ai_moderation, is_learning_paths, is_blockchain

> si usa enum pon lo que habra ahi un objeto array ejemplo +plan: enum -- 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE'

> Que sea compatible mermaid markdown

## si es un booleano que empieze con is\_

## 📝 Nomenclatura

| Regla               | Ejemplo                               |
| ------------------- | ------------------------------------- |
| Usar `snake_case`   | `social_media`, `open_source_project` |
| No usar `camelCase` | ~~`socialMedia`~~, ~~`userId`~~       |
| Tablas en singular  | `project`, `skill`                    |
| FK con sufijo `_id` | `portfolio_id`, `skill_id`            |

---

## 🗂️ Orden de Campos

### 1. PK primero

```sql
+id: int [PK]
```

### 2. Campos principales (más importantes)

```sql
+title: varchar[200](UQ)
+description: text
+name: varchar[100]
```

UQ = Unique
UQC = Unique Compuesto

### 3. Agrupar por tipo como en el siguiente ejemplo

**Textos juntos:**

```sql
+company: varchar[100]
+role: varchar[100]
+location: varchar[100]
+dni: varchar[100]
+ruc: varchar[100]
+telephone: varchar[100]
+email: varchar[100]
No poner texto cosas que se suman por ejemplos numeros ni decimales
```

**URLs juntas:**

```sql
+demo_url: varchar[500]
+oficial_url: varchar[500]
+repo_url: varchar[500]
```

**Números juntos:**

```sql
+stars: int
+forks: int
+level: int
No poner int cosas que SON textos como ruc, dni, etc
```

**Decimales:**

```sql
+igv: decimal
+price: decimal
+discount: decimal
```

**Booleans juntos:**

```sql
+is_public: boolean
+preferred: boolean
```

**Fechas juntas (al final antes de FK):**

```sql
+start_date: date
+end_date: date
+created_at: timestamp


Si la class tiene created_at tambien tendra updated_at OBLIGATORIO
```

### 4. FK al final

```sql
+portfolio_id: int [FK]
```

---

## 📊 Tipos de Datos, NO PONER resto, solo es un GUIA

> **Nota:** Usar corchetes `text[X]` en lugar de paréntesis para evitar que Mermaid cree líneas extra.

| Tipo        | Uso                                      | Longitud sugerida |
| ----------- | ---------------------------------------- | ----------------- |
| `int`       | IDs, contadores                          | -                 |
| `text[50]`  | Nombres cortos, iconos                   | 50                |
| `text[100]` | Nombres, roles, empresas                 | 100               |
| `text[200]` | Títulos, valores                         | 200               |
| `text[500]` | URLs, thumbnails                         | 500               |
| `text`      | Descripciones largas                     | -                 |
| `enum`      | Tipos de datos limitados y en mayusculas | -                 |
| `jsonb`     | Arrays flexibles                         | -                 |
| `boolean`   | Flags                                    | -                 |
| `date`      | Fechas sin hora                          | -                 |
| `timestamp` | Fechas con hora                          | -                 |

---

## ❓ Nullable

### Notación

```
+campo: tipo?     -- Nullable (puede ser NULL)
+campo: tipo      -- NOT NULL (requerido)
```

### Ejemplos de campos nullable

```
+demo_url: varchar[500]?      -- Proyecto puede no tener demo
+oficial_url: varchar[500]?   -- Sitio oficial es nullable
+end_date: date?              -- Trabajo actual no tiene fecha fin
+thumbnail: varchar[500]?     -- Imagen es nullable
+location: varchar[100]?      -- Ubicación puede no especificarse
+achievements: jsonb?         -- Logros son nullable
```

### Campos que NUNCA son nullable

- `id` (PK)
- `created_at`
- `portfolio_id` (FK)
- Campos de identificación (`title`, `name`, `company`)

## 🔗 Relaciones

| Tipo     | Cuándo usar                                  |
| -------- | -------------------------------------------- |
| **1:N**  | `portfolio` → `projects`                     |
| **N:M**  | `project` ↔ `skill` (tabla pivote)           |
| **JSON** | Datos flexibles sin queries (`achievements`) |

### Tablas Pivote

```sql
class project_skill {
    +project_id: int [FK]
    +skill_id: int [FK]
}
```

---

## ✅ Cuándo usar JSON

**Sí usar:**

- Datos variables/flexibles
- No necesitas indexar/buscar
- Arrays simples de strings
- Metadatos de archivos

**No usar:**

- Datos que necesitas reutilizar (ej: `skills`)
- Campos con FK
- Datos que requieren validación estricta

---

## 📁 Estructura de Archivos (JSONB)

Para uploads de archivos (imágenes, documentos), usar JSONB con esta estructura:

### Esquema TypeScript

```typescript
interface FileUpload {
    key: string;           // AWS S3 key
    name: string;          // Nombre original del archivo
    size: number;          // Peso en bytes
    mimetype: string;      // Tipo MIME (image/png, application/pdf)
    dimension?: number;    // Dimensión (para imágenes, ej: 1920)
    created_at: Date;      // Fecha de subida del archivo
}

// En la entidad
images: FileUpload[];      // Array de archivos


Imporante las propiedades de FileUpload no deben estar dentro de un objeto o array

// Correcto
images: FileUpload[];

// Incorrecto
files: {
    images: FileUpload[];
};
```

````

### Cuándo usar JSONB vs Tabla para archivos

| Usar JSONB                          | Usar Tabla                                |
| ----------------------------------- | ----------------------------------------- |
| Archivos siempre van con su entidad | Reutilizar archivo en múltiples entidades |
| No necesitas buscar por archivo     | Buscar archivos por nombre/tipo           |
| Estructura simple                   | Historial de versiones                    |
| Portfolio, blogs                    | Sistemas de archivos complejos            |

---

## 📦 Enums

### Definición PostgreSQL

```sql
CREATE TYPE skill_category AS ENUM (
    'FRONTEND',
    'BACKEND',
    'DATABASE',
    'DEVOPS'
);
````

### Valores en minúsculas

```sql
-- ❌ incorrecto
'in_progress', 'completed'

-- ✅ correcto
'IN_PROGRESS', 'Completed'
```

---

## 🎨 Mermaid Best Practices

### 1. Dirección del diagrama

```
%% TB = Top to Bottom (jerarquías)
%% LR = Left to Right (flujos)
classDiagram
    direction TB
```

### 2. Comentarios para secciones

```
%% ============================================
%% CORE ENTITIES
%% ============================================
```

### 3. Nomenclatura de Relaciones

Usar nombres descriptivos para las relaciones:

| Tipo         | Sintaxis Mermaid                     | Descripción                           |
| ------------ | ------------------------------------ | ------------------------------------- |
| **1-N**      | `entity_a "1" -- "*" entity_b : 1-N` | Uno a muchos                          |
| **N-M**      | `entity_a "*" -- "*" entity_b : N-M` | Muchos a muchos (tabla pivote)        |
| **1-1**      | `entity_a "1" -- "1" entity_b : 1-1` | Uno a uno                             |
| **SelfRef**  | `entity "1" -- "*" entity : SelfRef` | Auto-referencia (FK → PK misma tabla) |
| **1-N-Poly** | `entity "1" -- "*" poly : 1-N-Poly`  | Polimórfico uno a muchos              |
| **N-M-Poly** | `entity "*" -- "*" poly : N-M-Poly`  | Polimórfico muchos a muchos           |

### 4. Ejemplos de Relaciones

```
%% ✅ Nomenclatura compatible con Mermaid (usar guiones, no dos puntos)
category "1" -- "*" product : 1-N
category "1" -- "*" category : SelfRef
student "*" -- "*" course : N-M
user "1" -- "1" profile : 1-1

%% Polimórficos
post "1" -- "*" comment : 1-N-Poly
review "1" -- "*" comment : 1-N-Poly

%% ❌ Evitar (sin descripción o con caracteres especiales)
portfolio --> project
category "1" --> "*" product : 1:N  %% El ":" causa errores
```

### 5. Estereotipos para enums

```
class skill_category {
    <<enumeration>>
    frontend
    backend
}
```

### 6. Dividir diagramas grandes

- Un diagrama por módulo/namespace
- Enums separados del modelo principal
- ER diagram para relaciones

### 7. Tema oscuro

```
%%{init: {'theme': 'dark'}}%%
classDiagram
    class User
```

### 8. Notas explicativas

```
classDiagram
    class User
    note for User "Tabla principal de usuarios"
```

### 9. Links clickeables (HTML export)

```
classDiagram
    class User
    click User href "https://docs.com/user"
```

### 10. Namespaces (Mermaid 10+)

```
classDiagram
    namespace Documents {
        class Skill
        class Project
    }
    namespace Communication {
        class Contact
    }
```

### Verificación de Clases (OBLIGATORIO)

Al final de rules-class.md debes agregar una sección llamada "Verificación de Clases" donde listes TODAS las clases definidas.
Cada clase debe tener una sola línea con checkboxes marcados [x] (o dejados en blanco [ ] si falta) y [?] cuando no era necesario verificando lo siguiente:

#### Formato Requerido por Clase:

```markdown
#### nombre_de_clase

- [x] rules-class.md, [x] nomenclatura, [x] orden de campos, [x] enums y tipos_datos, [x] json y nullable, [x] nomeclatura de relaciones
```

Esto sirve para asegurar que no olvidaste ninguna regla de nomenclatura, orden, nullabilidad o relaciones.

---

# 🔗 Rules Endpoints

> **Archivo:** [`docs/rules/rules-endpoints.md`](../rules/rules-endpoints.md)
>
> Este archivo define todos los endpoints, debe contener una tabla con la columna `Status` (checkbox) y `Testeado` (checkbox) para realizar tracking de pruebas.
> Al principio de todo darás un resumen de lo que hace el sistema, claro usando para separar "-" información
> Recuerda que eres el mejor senior en regla de endpoints ingeniero de software backend, optimizacion, seguridad, nivel dios en practica.

### ⚠️ Convención snake_case (OBLIGATORIO)

> **REGLA:** Todos los path params, query params y propiedades en `rules-endpoints.md`, `rules-class.md` y `rules-business.md` deben usar **`snake_case`** — **nunca `camelCase`**.

| ❌ Incorrecto (camelCase) | ✅ Correcto (snake_case) |
| :------------------------ | :----------------------- |
| `:contentId`              | `:content_id`            |
| `:profileId`              | `:profile_id`            |
| `:seasonId`               | `:season_id`             |
| `:episodeId`              | `:episode_id`            |
| `:sessionId`              | `:session_id`            |
| `:genreId`                | `:genre_id`              |
| `:tagId`                  | `:tag_id`                |
| `:itemId`                 | `:item_id`               |
| `:personName`             | `:person_name`           |
| `:idOrSlug`               | `:id_or_slug`            |

### ⚠️ Convención Upload Genérico (OBLIGATORIO)

> [!IMPORTANT]
> **Existe un endpoint genérico `POST /uploads` que maneja TODAS las subidas de archivos del sistema.** No crear endpoints específicos por entidad como `/users/photo`, `/contents/poster`, `/tenants/logo`, etc. El endpoint genérico recibe `entity` y `property` en el body (multipart/form-data) junto con los archivos, y resuelve la validación desde `UPLOAD_CONFIG` del backend (ver `prompt-backend.md` §1.14).
>
> **Solo crear endpoints especializados** cuando hay lógica adicional post-upload:
>
> - `POST /contents/:content_id/video` → triggerea job de encoding (HLS/DASH)
> - `POST /contents/:content_id/subtitles/upload` → parsea .srt/.vtt para extraer metadata
> - `POST /admin/import` → parsea CSV/Excel e inserta entities en batch
>
> Ver `rules-business.md` §31 y `rules-endpoints.md` §31 para la documentación completa.

### Plantilla de Tabla de Endpoints

Esto es un ejemplo de como debe ser la tabla de endpoints. Para cada módulo (ej. `Experience`, `Projects`), crear una tabla con la siguiente estructura: el id es único para cada endpoint. el primero 1.1 es el id del rules-business.md y el otro ya es el subindice del endpoint, recuerda que esta sincorinizado con rules-business.md.

> **Nota:** Cuando se requiera paginación, agregar siempre los query params `offset` y `limit` en el endpoint o descripción.

### ⚠️ Columna Response (OBLIGATORIO)

> [!IMPORTANT]
> **Cada endpoint DEBE tener una columna `Response`** que indique la estructura del DTO de respuesta. **Es lo que el frontend va a recibir y consumir**, por esto es crítico que sea preciso y completo.
>
> **Convención de nombres de DTOs:**
>
> - `GET /entities` → `EntityIndexResponseDto`
> - `GET /entities/:id` → `EntityShowResponseDto`
> - `POST /entities` → `EntityStoreResponseDto`
> - `PUT /entities/:id` → `EntityUpdateResponseDto`
> - `DELETE /entities/:id` → `EntityDestroyResponseDto`

> [!CAUTION]
> **NUNCA retornar solo el schema crudo.** Es obvio que el frontend necesita más que solo la entidad:
>
> - **¿Quién lo creó?** → Incluir `user: Pick<UserSchema, 'id' | 'email' | 'username'>` (campo nombrado según el schema referenciado, NO `created_by`)
> - **¿A qué pertenece?** → Incluir FKs resueltas (ej: `plan`, `genre`, `language`, `profile`)
> - **¿Qué tiene asociado?** → Incluir relaciones 1:N relevantes (ej: `genres[]`, `tags[]`, `items[]`)
>
> Si la entidad tiene un FK (`user_id`, `plan_id`, `content_id`, `language_id`, etc.), la respuesta DEBE incluir esos datos JOINeados con `Pick<>`.

> **Sintaxis:**
>
> - `EntitySchema & { relation: Pick<RelatedSchema, 'id' | 'name'> }` — FK resuelta (N:1)
> - `EntitySchema & { items: RelatedSchema[] }` — Relación 1:N
> - `Omit<Schema, 'field'>` — Excluir campos sensibles (ej: `credentials`, `password_hash`)
> - Solo incluir los campos que realmente retorna la query (usar `Pick<>`, no el schema completo)
>
> **Ejemplos — Lo que el frontend realmente consume:**
>
> | Tipo                                    | Response                                                                                                                                                                                                                                 |
> | :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | **Show (con creator + FKs)**            | `ContentShowResponseDto` `{ success: true, content: ContentSchema & { genres: Pick<GenreSchema, 'id' \| 'name'>[], tags: Pick<TagSchema, 'id' \| 'name'>[], user: Pick<UserSchema, 'id' \| 'email' \| 'username'> } }`                   |
> | **Index (con JOINs)**                   | `SubscriptionIndexResponseDto` `{ success: true, subscriptions: (UserSubscriptionSchema & { user: Pick<UserSchema, 'id' \| 'email'>, plan: Pick<SubscriptionPlanSchema, 'id' \| 'name' \| 'price_monthly'> })[], total, offset, limit }` |
> | **Store (retorna entity + relaciones)** | `ReviewStoreResponseDto` `{ success: true, review: ReviewSchema & { profile: Pick<ViewingProfileSchema, 'id' \| 'name' \| 'avatar'> } }`                                                                                                 |
> | **Credentials masked**                  | `GatewayIndexResponseDto` `{ success: true, gateways: (Omit<PaymentGatewaySchema, 'credentials'> & { credentials_masked: string })[] }`                                                                                                  |

---

# 💼 Rules Business

> **Archivo:** [`docs/rules/rules-business.md`](../rules/rules-business.md)
>
> Este archivo define las reglas de negocio, permisos y validaciones, claro si hay roles o permisos agrega tambien quien hara tal cosa, si es publico o privado. SI hay auntenticacion tambien
> Recuerda que eres el mejor senior en regla de negocio ingeniero nivel dios en practica.

### Formato de Reglas

1.  **Agrupar por Entidad**: Crear una sección `##` por cada entidad del sistema.
2.  **Lista de Acciones**: Definir claramente qué se puede hacer con la entidad.
3.  **Restricciones**: Usar "blockquotes" o notas para reglas críticas (ej: campos únicos, validaciones especiales).
4.  **Si es paginación:** Agregar offset y limit explícitamente.
5.  **poner a que class o clasess pertenece** ## 1. Product (rules-class.md/product) si perteneces varias clases pones varias ponlo un id numeral al principuio para diferenciar
6.  **Lógica de Cálculo Matemático (OBLIGATORIO donde aplique):** Si el módulo involucra operaciones matemáticas (facturación, descuentos, porcentajes, promedios, contadores, prorrateos, penalidades, scores, etc.), agregar una subsección `### 📐 Lógica de Cálculo` con fórmulas paso a paso. Cada fórmula debe mostrar las variables involucradas, el orden de ejecución, y el resultado final. Usar formato de código para las fórmulas. Si no aplica lógica de cálculo, omitir la sección.
7.  **Matriz de Permisos por Acción (OBLIGATORIO):** Cada módulo debe incluir una subsección `### 🔐 Matriz de Permisos` con una tabla que liste TODAS las acciones del módulo y qué rol puede ejecutarlas. Columnas: `Acción`, `public`, `subscriber`, `moderator`, `content_manager`, `admin`, `superuser` (o los roles del sistema). Usar `✅` para permitido, `❌` para denegado, `👤` para "solo propietario del recurso". Esto reemplaza la mención suelta de roles en cada bullet point y da una vista consolidada. claro tambien permisos:user-store,user-destroy, product-store,product-destroy, asi etc, claro si no es necesario permisos entonces omitir.
8.  **Flujos Multi-Paso / Workflows (OBLIGATORIO donde aplique):** Si una acción involucra múltiples pasos secuenciales o coordinación entre entidades, agregar una subsección `### 🔄 Flujos / Workflows` que documente el flujo paso a paso numerado. Cada paso debe indicar: la acción concreta, la entidad afectada, y qué pasa si el paso falla (rollback, compensación, retry). Ejemplos: suscribirse a un plan, procesar un pago, publicar contenido. Si no aplica, omitir la sección.
9.  **Máquina de Estados (OBLIGATORIO donde aplique):** Si una entidad tiene un campo `status` o `state` con valores enum que representan un ciclo de vida, agregar una subsección `### 🔀 Máquina de Estados` con un diagrama Mermaid `stateDiagram-v2` que muestre las transiciones válidas entre estados. Documentar: estado inicial, estados finales, y qué acción/condición provoca cada transición. Si no aplica, omitir la sección.
10. **Side Effects / Efectos Secundarios (OBLIGATORIO donde aplique):** Si una acción produce efectos automáticos en otras entidades (enviar email, crear audit log, invalidar cache, crear notificación, actualizar contadores, disparar job), agregar una subsección `### ⚡ Side Effects` con una tabla de: `Acción Trigger`, `Efecto`, `Entidad Afectada`. Esto documenta las reacciones en cadena del sistema. Si no aplica, omitir la sección.
11. **Rate Limits / Throttling (OBLIGATORIO donde aplique):** Si una acción requiere limitación de frecuencia para prevenir abuso, agregar una subsección `### 🛡️ Rate Limits` con una tabla de: `Acción`, `Límite`, `Ventana`, `Penalidad`. Ejemplos: máximo de búsquedas por minuto, intentos de login, reportes, reacciones. Si no aplica, omitir la sección.

**Ejemplo de estructura:**
Esto es solo un ejemplo, debes crear una tabla con la siguiente estructura:

```markdown
## 1. Product (rules-class.md/product, rules-class.md/invoice_line)

- Crear un producto.
- Leer todos los productos (con paginación offset/limit).
- Leer un producto por ID.
- Actualizar un producto.
- Eliminar un producto.

> [!IMPORTANT]
> El SKU del producto debe ser único.

### 📐 Lógica de Cálculo

**Cálculo de línea de factura:**
```

subtotal = quantity × unit_price
discount_amount = subtotal × (discount_percent / 100)
base_imponible = subtotal - discount_amount
tax_amount = ROUND(base_imponible × tax_rate, 2)
line_total = base_imponible + tax_amount

````

### 🔄 Flujos / Workflows

**Flujo: Suscribirse a un plan**

1. Validar que el usuario no tiene suscripción activa → si tiene, REJECT
2. Validar promo_code (si se proporcionó) → si inválido, REJECT
3. Crear `user_subscription` con status = ACTIVE
4. Calcular monto con descuento + impuestos
5. Crear `invoice` con status = PENDING
6. Procesar cobro vía `payment_gateway_config` activo
7. Si pago exitoso → invoice.status = PAID, enviar email de bienvenida
8. Si pago falla → invoice.status = FAILED, suscripción.status = EXPIRED, ROLLBACK paso 3

### 🔀 Máquina de Estados

```mermaid
stateDiagram-v2
    [*] --> ACTIVE : suscripción creada
    ACTIVE --> PAUSED : usuario pausa
    PAUSED --> ACTIVE : usuario reactiva
    ACTIVE --> CANCELLED : usuario cancela
    CANCELLED --> ACTIVE : usuario reactiva (nuevo cobro)
    ACTIVE --> EXPIRED : pago falla 3x
    EXPIRED --> [*]
````

### ⚡ Side Effects

| Acción Trigger       | Efecto                               | Entidad Afectada |
| :------------------- | :----------------------------------- | :--------------- |
| Crear suscripción    | Enviar email de bienvenida           | notification     |
| Pago fallido         | Enviar email de alerta               | notification     |
| Cancelar suscripción | Expirar descargas al fin del período | download         |
| Cambiar de plan      | Crear invoice de ajuste prorrateado  | invoice          |

### 🛡️ Rate Limits

| Acción             | Límite      | Ventana  | Penalidad                       |
| :----------------- | :---------- | :------- | :------------------------------ |
| Intentos de login  | 5 intentos  | 15 min   | Bloqueo temporal 30 min         |
| Búsquedas          | 30 requests | 1 min    | HTTP 429                        |
| Crear review       | 3 reviews   | 1 hora   | HTTP 429                        |
| Reportar contenido | 10 reportes | 24 horas | HTTP 429 + flag para moderación |

### 🔐 Matriz de Permisos

| Acción                 | public | subscriber | moderator | content_manager | admin | superuser |
| :--------------------- | :----: | :--------: | :-------: | :-------------: | :---: | :-------: |
| Crear producto         |   ❌   |     ❌     |    ❌     |       ✅        |  ✅   |    ✅     |
| Leer productos (lista) |   ✅   |     ✅     |    ✅     |       ✅        |  ✅   |    ✅     |
| Leer producto por ID   |   ✅   |     ✅     |    ✅     |       ✅        |  ✅   |    ✅     |
| Actualizar producto    |   ❌   |     ❌     |    ❌     |       ✅        |  ✅   |    ✅     |
| Eliminar producto      |   ❌   |     ❌     |    ❌     |       ❌        |  ✅   |    ✅     |

````

### Verificación de Reglas de Negocio (OBLIGATORIO)

Al final de rules-business.md debes agregar una sección llamada "Verificación de Reglas de Negocio" donde listes TODOS los módulos definidos.
Cada módulo debe tener una sola línea con checkboxes marcados [x] (o dejados en blanco [ ] si falta) y [?] cuando no era necesario verificando lo siguiente:

#### Formato Requerido por Módulo:

```markdown
### 1. nombre_del_modulo

- [x] rules-business.md, [x] roles, [x] validaciones, [x] reglas de negocio, [x] lógica de cálculo, [x] matriz de permisos, [x] flujos, [x] máquina de estados, [x] side effects, [x] rate limits, [x] fidelidad rules-class
````

Esto sirve para asegurar que no olvidaste documentar roles, validaciones, reglas de negocio, lógica de cálculo matemático, matriz de permisos por acción, y que está sincronizado con rules-class.md.

---

# 📄 Rules Pages

> **Archivo:** [`docs/rules/rules-pages.md`](../rules/rules-pages.md)
> Recuerda que eres el mejor senior en React Native, UX/UI mobile engineer nivel dios, y experto en Expo Router.
> Este archivo define los requerimientos de cada pantalla (screen) y componente del sistema.
> Son las vistas de la aplicación móvil. endpoints que se usaran de `rules-endpoints.md`.
> **Tecnología:** Expo Router (File-based routing). Nada de React Router DOM ni Wouter.
> claro si hay roles o permisos agrega tambien quien hara tal cosa, si es publico o privado.
> agrega dos tipos de vistas, por que hay diferentes roles o permisos y hay clientes , admin, etc. que tendrán diferentes vistas o no podrán ver ciertas cosas ya sabes, es por eso que en titulo de la pagina debes poner el rol o permiso, ejemplo: ## dashboard (/dashboard) (Role:user) (rules-business.md #1) y otra vista seria ## dashboard (/dashboard) (Role:admin) (rules-business.md #1)

### Definición de Layouts (Mobile Navigation)

Antes de definir las pantallas, se debe agregar una sección `## Layouts` donde se definan los patrones de navegación reutilizables mediante IDs únicos.

**Tipos de Layouts Móviles:**

1. **Stack:** Navegación apilada (push/pop).
2. **Tabs:** Barra de navegación inferior.
3. **Drawer:** Menú lateral deslizante.
4. **Modal:** Pantallas superpuestas.

**Ejemplo:**

```markdown
## Layouts

### #layout-main-tabs

**Type:** Tabs (Bottom Navigation)
**Screens:** Home, Search, Profile.

### #layout-auth-stack

**Type:** Stack
**Header:** Hidden or Transparent.
```

### Formato de Requerimientos

4.  **Layout**: Especificar herencia de los layouts definidos (ej: `#layout-main-tabs`).
5.  **Listas**: Todo requerimiento de listado debe usar **FlashList** (nunca Table).
6.  **Columnas**: `Status` (checkbox) `Tarea/Feature` (descripción), `endpoint` (id de endpoints), `Testeado`.
7.  **Encabezado**: `## screen_name (/ruta) (rules-business.md #ID)`.
8.  **Columnas**: `Status`, `Tarea/Feature`, `endpoint`, `Roles o Permisos`, `Componentes` (**Ultra detallado**), `Testing`, `Testeado`.

### Convenciones API Index — `FlashList` y `Paginator`

> [!IMPORTANT]
> En móvil NO usamos tablas. Usamos **FlashList** para listas infinitas o paginadas.
> La lógica de actualización debe ser vía `paginator.updateData()` en `onSuccess`.

**Ejemplo de estructura:**

```markdown
## DashboardScreen (/dashboard) (Role:user) (rules-business.md #1)

Recuerda que eres experto en React Native y Expo. El diseño debe ser "Mobile First" y estético.

**Layout:** Inherits from #layout-main-tabs.

En componentes pondrá el tipo de componente móvil: Card, FlashList, Button (Pressable), Modal (Sheet), etc.

| Status | Tarea/Feature    | Endpoint IDs | Roles |              Componentes              | Testing           | Testeado |
| :----: | :--------------- | :----------: | :---: | :-----------------------------------: | :---------------- | :------: |
|  [ ]   | Mostrar resumen. |   [ ] 1.1    | admin |  **SummaryCard**: Gradients, Icons.   | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Listado items.   |   [ ] 1.3    | user  | **FlashList**: RenderItem optimizado. | [ ] unit, [ ] e2e |   [ ]    |
```

### Verificación de Pantallas (OBLIGATORIO)

Al final de `rules-pages.md` agregar "Verificación de Pantallas":

#### Formato Requerido por Pantalla:

```markdown
### ChatScreen

- [x] rules-pages.md, [x] encabezado, [x] layout (stack/tabs), [x] endpoints, [x] roles, [x] componentes (mobile), [x] testing checklist
```

Esto sirve para asegurar que no olvidaste documentar encabezados (formato `## page_name (/ruta) (rules-business.md #ID)` sin wildcards), layouts, endpoints, roles, componentes y que está sincronizado con rules-business.md y rules-endpoints.md.

### Sección OGL — Efectos WebGL por Página (si aplica)

Si el proyecto usa OGL para efectos visuales WebGL, rules-pages.md **debe** incluir una sección `# 🎮 OGL — Efectos WebGL por Página` con:

1. **Reglas generales** — máximo 1 canvas por página, `lazy()` + `<Suspense>`, `prefers-reduced-motion`, clean up en unmount, DPR cap.
2. **Tabla "Páginas con OGL ✅"** — página, layout, efecto OGL, componente, ubicación.
3. **Tabla "Páginas sin OGL ❌"** — página, layout, motivo (ej: conflicto canvas, formularios, performance).

> Para convenciones de código, shaders permitidos y buenas prácticas de implementación, ver `prompt-frontend.md` §2.5 OGL.

---

# 🌟 Ejemplo Integral de Implementación

Al implementar una nueva funcionalidad (ej. `Coupon`), se debe documentar en los 3 archivos de la siguiente manera:

### 1. En `rules-business.md`

```markdown
## Coupon

- Crear un cupón de descuento.
- Leer todos los cupones.
- Validar un cupón por código.

> [!WARNING]
> Los cupones no pueden eliminarse si ya han sido usados en una orden.
```

### 2. En `rules-endpoints.md`

```markdown
## 🎫 Coupon, agrega tambien query o body psdt pon ? en los que son opcionales, claro no usamos opcional usamos null, que se va a necesitar para los endpoints, testing unit, e2e, coverage, convension de prompt-backend.md

Usar Pick, Omit, etc de typescript
No usar Partial y recuerda que si quieres actualizar solo unos cuantops de un schema crear otro endpoint ejemplo PUT /example/:id actualizacion normal, /example/:id/change-password, como viste no use partial, cree otro endpoint, NO USAR PARTIAL y usa Pick<>, ah verdad en rules-business o rules class una propiedad de una clase puede estar nullable, pero ya sabes que en los endpoint hay veces que es necesario sea requerido, asi que en Omit o Pick cuando algo que estaba en nullable agrega required:username es un ejemplo, SOLO para campos de las clases que estaban en nullable.
Claro poner SSE en los endpoints que se van a necesitar, claro si no hay SSE omitir, SEE eventsource se usa mucho en chatbots con IA, no es necesario websocket socket.io etc..

| id  | Status |              Método              | Endpoint              | query o body                                               | Descripción                                 |             Roles o Permisos             | Testing                         | prompt-backend.md                                                                                                                             |
| :-- | :----: | :------------------------------: | :-------------------- | :--------------------------------------------------------- | :------------------------------------------ | :--------------------------------------: | :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 |  [ ]   |              `GET`               | `/coupons`            | limit, offset                                              | Listar cupones paginados (limit, offset)    |     role:admin permisos:list-coupons     | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] entities, [ ] controllers & swagger, [ ] services, [ ] cache (5min TTL), [ ] seeder, [ ] buenas practicas          |
| 1.2 |  [ ]   |              `POST`              | `/coupons`            | body: `Omit<Coupon, "id" \| "created_at" \| "updated_at">` | Crear nuevo cupón.                          |     role:admin permisos:store-coupon     | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] entities, [ ] controllers & swagger, [ ] services, [ ] cache (invalidar coupons), [ ] seeder, [ ] buenas practicas |
| 1.3 |  [ ]   |              `POST`              | `/coupons/use`        | body: `Pick<Coupon, "code">` & required:username,password  | Validar y descontar uso de cupón.           |                  public                  | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] entities, [ ] controllers & swagger, [ ] services, [ ] cache (no cache), [ ] seeder, [ ] buenas practicas          |
| 1.4 |  [ ]   | `SOCKET.IO` o `SSE-EVENTSOURCE`, | `chat/send` (ejemplo) | body: `Pick<Message, "message" \| "to" \| "from">`         | Enviar mensaje via socket o recibir stream. | role:admin,cliente permisos:send-message | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] entities, [ ] controllers & swagger, [ ] services, [ ] cache (no cache), [ ] seeder, [ ] buenas practicas          |

> [!IMPORTANT]
> **Política de Cache en columna `prompt-backend.md`**:
>
> - **GET (lectura)**: Usar TTL según frecuencia de cambio: `(1min TTL)`, `(5min TTL)`, `(1h TTL)`, `(24h TTL)`
> - **POST/PUT/PATCH/DELETE**: Invalidar cache relacionada: `(invalidar users)`, `(invalidar user:id)`, `(invalidar jobs)`
> - **Endpoints públicos/sensibles**: Usar `(no cache)` para auth, demo, mensajes
>
> Ejemplos:
>
> - `[ ] cache (5min TTL)` → Cache de lectura con TTL de 5 minutos
> - `[ ] cache (invalidar users)` → Invalida cache de lista de usuarios
> - `[ ] cache (invalidar user:id)` → Invalida cache de usuario específico
> - `[ ] cache (no cache)` → Sin cache (auth, SSE, tiempo real)
```

### 3. En `rules-pages.md`

```markdown
## CouponScreen (/dashboard/coupons) (rules-business.md #1)

**Layout:** Inherits from #layout-dashboard-stack. Action Button: Create Coupon.

| Status | Tarea/Feature             |   Endpoint IDs   | Roles |                 Componentes                  | Testing           | Testeado |
| :----: | :------------------------ | :--------------: | :---: | :------------------------------------------: | :---------------- | :------: |
|  [ ]   | Lista de cupones.         | [ ] 1.1, [ ] 1.3 | admin |      **FlashList**: `CouponCard` items.      | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Estado (Activo/Expirado). |     [ ] 1.2      | admin |        **Badge**: Estilo condicional.        | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Crear cupón (Modal).      |     [ ] 1.3      | admin | **BottomSheet**: Form con `ControlledInput`. | [ ] unit, [ ] e2e |   [ ]    |
```

---
