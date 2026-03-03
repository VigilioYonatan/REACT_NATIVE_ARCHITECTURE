# Rules Endpoints

> **Archivo:** [`docs/rules/rules-endpoints.md`](../rules/rules-endpoints.md)
>
> Este archivo define todos los endpoints simulados con **JSON Server**.
> La plataforma es un servicio de streaming de películas.
> Columnas `Status` y `Testeado` para tracking.

### ⚠️ Convención snake_case (OBLIGATORIO)

> **REGLA:** Todos los path params, query params y propiedades deben usar **`snake_case`**.

### ⚠️ Columna Response (OBLIGATORIO)

> **Response** indica la estructura del DTO de respuesta.

---

## 1. Auth (Mock) (rules-business.md #Auth)

Simulación de autenticación. En JSON Server, usaremos usuarios predefinidos o custom routes si fuera necesario, pero por ahora simularemos con queries a `/users`.

| id  | Status | Método | Endpoint | query o body                        | Descripción                                      | Roles  | Response                                                     | Testing                         | prompt-backend.md                |
| :-- | :----: | :----- | :------- | :---------------------------------- | :----------------------------------------------- | :----- | :----------------------------------------------------------- | :------------------------------ | :------------------------------- |
| 1.1 |  [x]   | `GET`  | `/users` | `email={email}&password={password}` | Login simulado (buscar usuario por credenciales) | public | `UserSchema[]` (Si array > 0, login exitoso)                 | [x] unit, [ ] e2e, [ ] coverage | [x] schemas, [x] dtos, [x] cache |
| 1.2 |  [ ]   | `POST` | `/users` | body: `Omit<User, "id">`            | Registro de usuario                              | public | `UserStoreResponseDto` `{ success: true, user: UserSchema }` | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 1.3 |  [ ]   | `GET`  | `/users` | `email={email}`                     | Verificar si email existe (Forgot Password)      | public | `UserSchema[]`                                               | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |

---

## 2. Movies (rules-business.md #Movie)

Endpoints para listar y detallar películas.

| id  | Status | Método | Endpoint      | query o body                               | Descripción                                | Roles | Response                                                                                 | Testing                         | prompt-backend.md                |
| :-- | :----: | :----- | :------------ | :----------------------------------------- | :----------------------------------------- | :---- | :--------------------------------------------------------------------------------------- | :------------------------------ | :------------------------------- |
| 2.1 |  [ ]   | `GET`  | `/movies`     | `is_featured=true&_limit=5`                | Listar películas destacadas (Hero)         | user  | `MovieIndexResponseDto` `MovieSchema[]`                                                  | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 2.2 |  [ ]   | `GET`  | `/movies`     | `_page={page}&_limit={limit}&q={search}`   | Listar películas (Search/Browse) paginadas | user  | `MovieIndexResponseDto` `MovieSchema[]` (JSON Server header `x-total-count`)             | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 2.3 |  [ ]   | `GET`  | `/movies`     | `_sort=release_date&_order=desc&_limit=10` | Listar nuevos lanzamientos                 | user  | `MovieIndexResponseDto` `MovieSchema[]`                                                  | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 2.4 |  [ ]   | `GET`  | `/movies`     | `_sort=views_count&_order=desc&_limit=10`  | Top 10 Trending                            | user  | `MovieIndexResponseDto` `MovieSchema[]`                                                  | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 2.5 |  [ ]   | `GET`  | `/movies/:id` | `_embed=reviews&_embed=movie_actors`       | Ver detalle película + reseñas + actores   | user  | `MovieShowResponseDto` `MovieSchema & { reviews: Review[], movie_actors: MovieActor[] }` | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 2.6 |  [ ]   | `GET`  | `/movies`     | `genre_id={id}&_limit=10`                  | Películas por género (More Like This)      | user  | `MovieIndexResponseDto` `MovieSchema[]`                                                  | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |

---

## 3. Genres (rules-business.md #Genre)

| id  | Status | Método | Endpoint  | query o body | Descripción              | Roles | Response                                | Testing                         | prompt-backend.md                |
| :-- | :----: | :----- | :-------- | :----------- | :----------------------- | :---- | :-------------------------------------- | :------------------------------ | :------------------------------- |
| 3.1 |  [ ]   | `GET`  | `/genres` | -            | Listar todos los géneros | user  | `GenreIndexResponseDto` `GenreSchema[]` | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |

---

## 4. User Interaction (rules-business.md #User)

Historial, favoritos y reseñas.

| id  | Status | Método | Endpoint         | query o body                                                   | Descripción                                   | Roles | Response                                                        | Testing                         | prompt-backend.md                |
| :-- | :----: | :----- | :--------------- | :------------------------------------------------------------- | :-------------------------------------------- | :---- | :-------------------------------------------------------------- | :------------------------------ | :------------------------------- |
| 4.1 |  [ ]   | `GET`  | `/watch_history` | `user_id={id}&_expand=movie&_sort=last_watched_at&_order=desc` | Listar "Seguir Viendo"                        | user  | `WatchHistoryResponseDto` `(WatchHistory & { movie: Movie })[]` | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 4.2 |  [ ]   | `POST` | `/watch_history` | body: `WatchHistoryStoreDto`                                   | Guardar/Actualizar progreso (upsert simulado) | user  | `WatchHistoryResponseDto` `WatchHistorySchema`                  | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 4.3 |  [ ]   | `GET`  | `/favorites`     | `user_id={id}&_expand=movie`                                   | Listar favoritos del usuario                  | user  | `FavoriteIndexResponseDto` `(Favorite & { movie: Movie })[]`    | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 4.4 |  [ ]   | `POST` | `/favorites`     | body: `FavoriteStoreDto`                                       | Agregar a favoritos                           | user  | `FavoriteStoreResponseDto` `FavoriteSchema`                     | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 4.5 |  [ ]   | `DEL`  | `/favorites/:id` | -                                                              | Eliminar de favoritos                         | user  | `FavoriteDestroyResponseDto` `{ success: true }`                | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |

---

## 5. Profile (rules-business.md #Profile)

| id  | Status | Método | Endpoint     | query o body          | Descripción                              | Roles | Response                             | Testing                         | prompt-backend.md                |
| :-- | :----: | :----- | :----------- | :-------------------- | :--------------------------------------- | :---- | :----------------------------------- | :------------------------------ | :------------------------------- |
| 5.1 |  [ ]   | `PUT`  | `/users/:id` | body: `UserUpdateDto` | Actualizar perfil (preferencias, avatar) | user  | `UserUpdateResponseDto` `UserSchema` | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |
| 5.2 |  [ ]   | `GET`  | `/users/:id` | -                     | Obtener perfil completo                  | user  | `UserShowResponseDto` `UserSchema`   | [ ] unit, [ ] e2e, [ ] coverage | [ ] schemas, [ ] dtos, [ ] cache |

---

### Verificación de Endpoints (OBLIGATORIO)

#### Auth

- [x] rules-endpoints.md, [x] snake_case, [x] response DTO, [x] query params

#### Movies

- [x] rules-endpoints.md, [x] snake_case, [x] response DTO, [x] query params (paginacion/sort)

#### Genres

- [x] rules-endpoints.md, [x] snake_case, [x] response DTO

#### User Interaction

- [x] rules-endpoints.md, [x] snake_case, [x] response DTO (expand/embed)

#### Profile

- [x] rules-endpoints.md, [x] snake_case, [x] response DTO
