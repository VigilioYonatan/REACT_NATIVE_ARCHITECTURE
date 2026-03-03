# Rules Pages

> Archivo: `docs/rules/rules-pages.md`
> Recuerda que eres el mejor senior en React Native, UX/UI mobile engineer nivel dios, y experto en Expo Router.
> Este archivo define los requerimientos de cada pantalla (screen) y componente del sistema.
> Son las vistas de la aplicación móvil. endpoints que se usaran de `rules-endpoints.md` (Mocked via JSON Server).
> **Tecnología:** Expo Router (File-based routing).

## Layouts

### #layout-auth-stack

**Type:** Stack
**Screens:** Login, Register, ForgotPassword.
**Header:** Hidden.
**Transition:** Slide form right.

### #layout-main-tabs

**Type:** Tabs (Bottom Navigation)
**Screens:** Home, Search, Favorites, Profile.
**Icons:** Lucide React Native (Home, Search, Heart, User).
**Style:** Absolute positioning, blur effect (Glassmorphism), no border top, floating look.
**Animations:** Icon scale on focus.

### #layout-player-stack

**Type:** Stack
**Screens:** Player.
**Header:** Hidden, Landscape orientation lock.

---

## 1. LoginScreen (/login) (rules-business.md #MockAuth)

**Layout:** Inherits from #layout-auth-stack.

| Status | Tarea/Feature          | Endpoint IDs | Roles  | Componentes                                          | Testing           | Testeado |
| :----: | :--------------------- | :----------: | :----: | :--------------------------------------------------- | :---------------- | :------: |
|  [x]   | Iniciar sesión (mock)  |   [x] 1.1    | public | **AuthForm**: Email/Pass mocks. `zod` validation.    | [x] unit, [ ] e2e |   [ ]    |
|  [x]   | Validar credenciales   |   [x] 1.1    | public | **Button**: "Ingresar" w/ `isLoading` state.         | [x] unit, [ ] e2e |   [ ]    |
|  [x]   | Redirigir a Home       |      -       | public | **Router**: `router.replace('/home')`                | [x] unit, [ ] e2e |   [ ]    |
|  [x]   | Diseño Background      |      -       | public | **ImageBackground**: Poster blur + gradient overlay. | [x] unit, [ ] e2e |   [ ]    |
|  [x]   | "Olvidé mi contraseña" |   [x] 1.3    | public | **Link**: Navigate to recover screen.                | [x] unit, [ ] e2e |   [ ]    |

---

## 2. HomeScreen (/home) (Role:user) (rules-business.md #Movie)

**Layout:** Inherits from #layout-main-tabs.
**Design Goal:** Cinematic Experience, Premium Feel (Netflix/Disney+ Tier). Glassmorphism, immersive dark theme, fluid animations, micro-interactions on focus.

| Status | Tarea/Feature             | Endpoint IDs | Roles | Componentes                                                                                                                                                   | Testing           | Testeado |
| :----: | :------------------------ | :----------: | :---: | :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------- | :------: |
|  [ ]   | Hero Immersivo (Featured) |   [ ] 2.1    | user  | **HeroCarousel**: Full height immersive poster, subtle zoom effect. Auto-play trailer preview. Gradient overlay. Glassmorphic info panel. Parallax on scroll. | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Seguir Viendo             |   [ ] 4.1    | user  | **FlashList**: Horizontal with snap. **ContinueCard**: Glow effect on focus. Progress Bar with brand color. Shows only if `progress > 0`.                     | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Top 10 Tendencias         |   [ ] 2.4    | user  | **FlashList**: Horizontal. **RankCard**: Metallic texture SVG Number (1, 2, 3...) partially obscured behind poster for depth.                                 | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Categorías (Pills)        |   [ ] 3.1    | user  | **ScrollView**: Horizontal non-intrusive. **CategoryPill**: Neumorphic/Glass touch. Active state glows.                                                       | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Nuevos Lanzamientos       |   [ ] 2.3    | user  | **FlashList**: Horizontal standard poster (2:3 ratio). Smooth entrance animation.                                                                             | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Skeleton Loading          |      -       | user  | **Skeleton**: Moti animations (shimmer) matching exact layout (Hero, List, Pills). Darker base color for premium feel.                                        | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Header Transparente       |      -       | user  | **AnimatedHeader**: Fade in background on scroll `interpolate`. Logo left, Search/Avatar right.                                                               | [ ] unit, [ ] e2e |   [ ]    |

---

## 3. SearchScreen (/search) (Role:user) (rules-business.md #Search)

**Layout:** Inherits from #layout-main-tabs.

| Status | Tarea/Feature      | Endpoint IDs | Roles | Componentes                                                                                       | Testing           | Testeado |
| :----: | :----------------- | :----------: | :---: | :------------------------------------------------------------------------------------------------ | :---------------- | :------: |
|  [ ]   | Barra de Búsqueda  |   [ ] 2.2    | user  | **SearchInput**: Debounced (500ms), auto-focus option. Glass effect. `TextInput` w/ clear button. | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Resultados Grid    |   [ ] 2.2    | user  | **MasonryFlashList**: Grid 2-3 columns. Staggered animation on mount. `PosterCard` simple.        | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Filtros Avanzados  |   [ ] 3.1    | user  | **BottomSheet**: Year, Genre, Rating slider. Filter logic frontend + API params.                  | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Historial Reciente |      -       | user  | **List**: Horizontal text chips with 'x' to remove. Saved in MMKV.                                | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Estado Vacío       |      -       | user  | **EmptyState**: Lottie Animation + "Try searching for..."                                         | [ ] unit, [ ] e2e |   [ ]    |

---

## 4. MovieDetailScreen (/movie/[id]) (Role:user) (rules-business.md #Movie)

**Layout:** Inherits from #layout-main-tabs (Stack push, transparency).

| Status | Tarea/Feature       | Endpoint IDs | Roles | Componentes                                                                       | Testing           | Testeado |
| :----: | :------------------ | :----------: | :---: | :-------------------------------------------------------------------------------- | :---------------- | :------: |
|  [ ]   | Header Parallax     |   [ ] 2.5    | user  | **ParallaxScrollView**: Poster fade + zoom effect on pull down.                   | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Botón Play (Sticky) |      -       | user  | **Fab**: Floating Play Button (Extended width on scroll up). Animated visibility. | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Meta Info           |   [ ] 2.5    | user  | **InfoRow**: 4K badge, HDR, Duration, Year, Match %.                              | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Sinopsis            |   [ ] 2.5    | user  | **ExpandableText**: Gradient fade at bottom when collapsed. Max lines 3.          | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Agregar a favoritos |   [ ] 4.4    | user  | **ActionButtons**: My List (Check/Plus), Rate (Star), Share.                      | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Cast & Crew         |   [ ] 2.5    | user  | **FlashList**: Horizontal `AvatarCard` (Circle).                                  | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Tráiler             |   [ ] 2.5    | user  | **YoutubePlayer**: Embedded view. `react-native-youtube-iframe`.                  | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | More Like This      |   [ ] 2.6    | user  | **FlashList**: Grid 3 cols. `MovieCard`.                                          | [ ] unit, [ ] e2e |   [ ]    |

---

## 5. PlayerScreen (/player/[id]) (Role:user) (rules-business.md #Player)

**Layout:** Inherits from #layout-player-stack.

| Status | Tarea/Feature     | Endpoint IDs | Roles | Componentes                                                                           | Testing           | Testeado |
| :----: | :---------------- | :----------: | :---: | :------------------------------------------------------------------------------------ | :---------------- | :------: |
|  [ ]   | Video Player Core |   [ ] 2.5    | user  | **ExpoVideo**: Fullscreen playback, gesture brightness/volume.                        | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Controles Custom  |      -       | user  | **Overlay**: Play/Pause, Seekbar with preview thumbnail (mock), Audio/Subtitles menu. | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Subtítulos        |      -       | user  | **SubtitleTrack**: Custom rendering style (shadows, size).                            | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Guardar progreso  |   [ ] 4.2    | user  | **Hook**: `useInterval` (10s) save to `watch_history` endpoint.                       | [ ] unit, [ ] e2e |   [ ]    |

---

## 6. FavoritesScreen (/favorites) (Role:user) (rules-business.md #Favorite)

**Layout:** Inherits from #layout-main-tabs.

| Status | Tarea/Feature         | Endpoint IDs | Roles | Componentes                                                            | Testing           | Testeado |
| :----: | :-------------------- | :----------: | :---: | :--------------------------------------------------------------------- | :---------------- | :------: |
|  [ ]   | Listado Favoritos     |   [ ] 4.3    | user  | **FlashList**: `MovieCard` con swipe delete animation (Reanimated).    | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Eliminar de favoritos |   [ ] 4.5    | user  | **Action**: Swipe Left -> Delete Icon -> API call & optimistic update. | [ ] unit, [ ] e2e |   [ ]    |

---

## 7. ProfileScreen (/profile) (Role:user) (rules-business.md #Profile)

**Layout:** Inherits from #layout-main-tabs.

| Status | Tarea/Feature              | Endpoint IDs | Roles | Componentes                                                                 | Testing           | Testeado |
| :----: | :------------------------- | :----------: | :---: | :-------------------------------------------------------------------------- | :---------------- | :------: |
|  [ ]   | User Info Header           |   [ ] 5.2    | user  | **AvatarHeader**: Large Avatar + Name + Plan badge (Gold/Silver).           | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Estadísticas               |   [ ] 4.1    | user  | **StatsRow**: "Movies Watched" (count `watch_history`), "Hours", "Reviews". | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Historial de visualización |   [ ] 4.1    | user  | **FlashList**: Horizontal recent watched.                                   | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Configuración              |   [ ] 5.1    | user  | **SettingsList**: Dark mode toggle (Global State), Notifications, Autoplay. | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Cerrar Sesión              |      -       | user  | **Button**: Variant danger/outline. Clears MMKV session.                    | [ ] unit, [ ] e2e |   [ ]    |

---

### Verificación de Pantallas (OBLIGATORIO)

#### LoginScreen

- [x] rules-pages.md, [x] encabezado, [x] layout, [x] endpoints, [x] roles, [x] componentes, [x] testing checklist

#### HomeScreen

- [x] rules-pages.md, [x] encabezado, [x] layout, [x] endpoints, [x] roles, [x] componentes, [x] testing checklist

#### SearchScreen

- [x] rules-pages.md, [x] encabezado, [x] layout, [x] endpoints, [x] roles, [x] componentes, [x] testing checklist

#### MovieDetailScreen

- [x] rules-pages.md, [x] encabezado, [x] layout, [x] endpoints, [x] roles, [x] componentes, [x] testing checklist

#### PlayerScreen

- [x] rules-pages.md, [x] encabezado, [x] layout, [x] endpoints, [x] roles, [x] componentes, [x] testing checklist

#### FavoritesScreen

- [x] rules-pages.md, [x] encabezado, [x] layout, [x] endpoints, [x] roles, [x] componentes, [x] testing checklist

#### ProfileScreen

- [x] rules-pages.md, [x] encabezado, [x] layout, [x] endpoints, [x] roles, [x] componentes, [x] testing checklist

---

# 🎮 OGL — Efectos WebGL por Página

### Reglas generales

1. Máximo 1 canvas por página.
2. `lazy()` + `<Suspense>`.
3. `prefers-reduced-motion` check.

### Páginas sin OGL ❌

| Página       | Layout               | Motivo                              |
| :----------- | :------------------- | :---------------------------------- |
| LoginScreen  | #layout-auth-stack   | Performance en input.               |
| HomeScreen   | #layout-main-tabs    | Conflict with FlashList complexity. |
| PlayerScreen | #layout-player-stack | Conflict with Video.                |
