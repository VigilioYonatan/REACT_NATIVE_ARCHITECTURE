import pyautogui
import time
import subprocess
import os
import sys
import argparse
import numpy as np
from PIL import Image
import mss

# --- DIRECTORIO DEL SCRIPT ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(SCRIPT_DIR, 'assets')

# --- ARGUMENTOS CLI ---
parser = argparse.ArgumentParser(description='Script de automatización para generar código con IA')
parser.add_argument('--backend', action='store_true', help='Usar prompts de backend (NestJS)')
parser.add_argument('--frontend', action='store_true', help='Usar prompts de frontend (Preact)')
parser.add_argument('--rules-class',  action='store_true', help='Usar prompts de class')
parser.add_argument('--rules-business',  action='store_true', help='Usar prompts de business')
parser.add_argument('--rules-endpoints',  action='store_true', help='Usar prompts de endpoints')
parser.add_argument('--rules-page',  action='store_true', help='Usar prompts de page')
args = parser.parse_args()
from helpers.prompt_ai import PROMPT_AI

# --- CARGAR PROMPTS SEGÚN ARGUMENTO ---
PROMPT_BASE = ""
PROMPT_CONTEXT = ""
PROMPT_CONTEXT_VERIFIED = ""
PROMPT_AI = PROMPT_AI
if args.backend:
    print("🔧 Modo: BACKEND (NestJS)")
    from helpers.prompt_backend import PROMPT_BASE, PROMPT_CONTEXT, PROMPT_CONTEXT_VERIFIED
elif args.frontend:
    print("🎨 Modo: FRONTEND (Preact)")
    from helpers.prompt_frontend import PROMPT_BASE, PROMPT_CONTEXT, PROMPT_CONTEXT_VERIFIED
elif args.rules_class:
    print("📚 Modo: CLASS")
    from helpers.prompt_rules_class import PROMPT_BASE, PROMPT_CONTEXT, PROMPT_CONTEXT_VERIFIED
elif args.rules_business:
    print("📚 Modo: BUSINESS")
    from helpers.prompt_rules_business import PROMPT_BASE, PROMPT_CONTEXT, PROMPT_CONTEXT_VERIFIED
elif args.rules_endpoints:
    print("📚 Modo: ENDPOINTS")
    from helpers.prompt_rules_endpoints import PROMPT_BASE, PROMPT_CONTEXT, PROMPT_CONTEXT_VERIFIED
elif args.rules_page:
    print("📚 Modo: PAGE")
    from helpers.prompt_rules_page import PROMPT_BASE, PROMPT_CONTEXT, PROMPT_CONTEXT_VERIFIED
else:
    print("⚠️  No se especificó modo. Usa --backend, --frontend o --class")
    print("\nEjemplos:")
    print("  python index.py --backend")
    print("  python index.py --frontend")
    print("  python index.py --class")
    sys.exit(1)

print(f"\n📋 PROMPT_BASE: {PROMPT_BASE[:80]}...")
print(f"📄 PROMPT_CONTEXT length: {len(PROMPT_CONTEXT)} chars\n")

# Monkeypatch pyautogui to use mss for screenshots (fixes Linux dependency issues)
def locateOnScreen_mss(image, **kwargs):
    with mss.mss() as sct:
        # Get primary monitor
        monitor = sct.monitors[1]
        sct_img = sct.grab(monitor)
        # Convert to PIL Image
        screenshot = Image.frombytes("RGB", sct_img.size, sct_img.bgra, "raw", "BGRX")
        # Use pyautogui logic on our screenshot
        return pyautogui.locate(image, screenshot, **kwargs)

# Reemplazamos la función original para que todas las llamadas usen mss
pyautogui.locateOnScreen = locateOnScreen_mss
clases_raw = [
r"""
## 1. LoginScreen (/login) (rules-business.md #MockAuth)
**Layout:** Inherits from #layout-auth-stack.

| Status | Tarea/Feature          | Endpoint IDs | Roles  | Componentes                                          | Testing           | Testeado |
| :----: | :--------------------- | :----------: | :----: | :--------------------------------------------------- | :---------------- | :------: |
|  [ ]   | Iniciar sesión (mock)  |   [ ] 1.1    | public | **AuthForm**: Email/Pass mocks. `zod` validation.    | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Validar credenciales   |   [ ] 1.1    | public | **Button**: "Ingresar" w/ `isLoading` state.         | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Redirigir a Dashboard  |      -       | public | **Router**: `router.replace('/dashboard')`           | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Diseño Background      |      -       | public | **ImageBackground**: Poster blur + gradient overlay. | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | "Olvidé mi contraseña" |   [ ] 1.3    | public | **Link**: Navigate to recover screen.                | [ ] unit, [ ] e2e |   [ ]    |
""",
r"""

#2. DashboardScreen (/dashboard) (Role:user) (rules-business.md #Movie)

**Layout:** Inherits from #layout-main-tabs.
**Design Goal:** Netflix/Disney+ Tier. Immersive, dark theme, smooth animations.

| Status | Tarea/Feature             | Endpoint IDs | Roles | Componentes                                                                                                                  | Testing           | Testeado |
| :----: | :------------------------ | :----------: | :---: | :--------------------------------------------------------------------------------------------------------------------------- | :---------------- | :------: |
|  [ ]   | Hero Immersivo (Featured) |   [ ] 2.1    | user  | **HeroCarousel**: Full height poster, gradient bottom, Title, Genres. Buttons (Play, My List) w/ blur info. Parallax effect. | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Seguir Viendo             |   [ ] 4.1    | user  | **FlashList**: Horizontal. **ContinueCard**: Thumbnail + Progress Bar (bottom). Shows only if `progress > 0`.                | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Top 10 Tendencias         |   [ ] 2.4    | user  | **FlashList**: Horizontal. **RankCard**: Big SVG Number (1, 2, 3...) overlaying part of the poster.                          | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Categorías (Pills)        |   [ ] 3.1    | user  | **ScrollView**: Horizontal. **CategoryPill**: Blur background, icon + text. Active state style.                              | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Nuevos Lanzamientos       |   [ ] 2.3    | user  | **FlashList**: Horizontal standard poster (2:3 ratio).                                                                       | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Skeleton Loading          |      -       | user  | **Skeleton**: Moti animations (shimmer) matching exact layout (Hero, List, Pills).                                           | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Header Transparente       |      -       | user  | **AnimatedHeader**: Fade in background on scroll `interpolate`. Logo left, Search/Avatar right.                              | [ ] unit, [ ] e2e |   [ ]    |

""",
r"""
#3. SearchScreen (/search) (Role:user) (rules-business.md #Search)

**Layout:** Inherits from #layout-main-tabs.

| Status | Tarea/Feature      | Endpoint IDs | Roles | Componentes                                                                                       | Testing           | Testeado |
| :----: | :----------------- | :----------: | :---: | :------------------------------------------------------------------------------------------------ | :---------------- | :------: |
|  [ ]   | Barra de Búsqueda  |   [ ] 2.2    | user  | **SearchInput**: Debounced (500ms), auto-focus option. Glass effect. `TextInput` w/ clear button. | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Resultados Grid    |   [ ] 2.2    | user  | **MasonryFlashList**: Grid 2-3 columns. Staggered animation on mount. `PosterCard` simple.        | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Filtros Avanzados  |   [ ] 3.1    | user  | **BottomSheet**: Year, Genre, Rating slider. Filter logic frontend + API params.                  | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Historial Reciente |      -       | user  | **List**: Horizontal text chips with 'x' to remove. Saved in MMKV.                                | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Estado Vacío       |      -       | user  | **EmptyState**: Lottie Animation + "Try searching for..."                                         | [ ] unit, [ ] e2e |   [ ]    |
""",
r"""
#4. MovieDetailScreen (/movie/[id]) (Role:user) (rules-business.md #Movie)

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

# """,
r"""
## 5. PlayerScreen (/player/[id]) (Role:user) (rules-business.md #Player)

**Layout:** Inherits from #layout-player-stack.

| Status | Tarea/Feature     | Endpoint IDs | Roles | Componentes                                                                           | Testing           | Testeado |
| :----: | :---------------- | :----------: | :---: | :------------------------------------------------------------------------------------ | :---------------- | :------: |
|  [ ]   | Video Player Core |   [ ] 2.5    | user  | **ExpoVideo**: Fullscreen playback, gesture brightness/volume.                        | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Controles Custom  |      -       | user  | **Overlay**: Play/Pause, Seekbar with preview thumbnail (mock), Audio/Subtitles menu. | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Subtítulos        |      -       | user  | **SubtitleTrack**: Custom rendering style (shadows, size).                            | [ ] unit, [ ] e2e |   [ ]    |
|  [ ]   | Guardar progreso  |   [ ] 4.2    | user  | **Hook**: `useInterval` (10s) save to `watch_history` endpoint.                       | [ ] unit, [ ] e2e |   [ ]    |
"""    ,

]

comandos = []
CHUNK_SIZE = 1


for i in range(0, len(clases_raw), CHUNK_SIZE):
    chunk = clases_raw[i : i + CHUNK_SIZE]
    # Unimos las clases del grupo con saltos de línea
    bloque_combinado = "\n\n".join(chunk)
    comandos.append(bloque_combinado)

body_custom =""

# --- MODELOS PREFERIDOS (Sin símbolo de advertencia) ---
# El script buscará estas imágenes de modelos para hacer clic
MODELOS_PREFERIDOS = [
    'gemini_3_pro_high.png',    # Gemini 3 Pro High
    'gemini_3_flash.png',       # Gemini 3 Flash
    'claude_opus_4_5_thinking.png'  # Claude Opus 4.5 Thinking
]

# --- NUEVA LÓGICA DE BOTONES ---
BOTON_CAMBIO_MODELO = 'choose-model2.png'
ERROR_NO_TOKEN = 'no_token_ai.png'

# --- FUNCIONES AUXILIARES ---

def buscar_imagen_segura(imagen, confianza=0.7, region=None):
    """
    Busca una imagen usando OpenCV con un nivel de confianza.
    grayscale=True ayuda a que sea más rápido y robusto ante cambios leves de color.
    """
    try:
        # locateOnScreen soporta el parámetro region (left, top, width, height)
        imagen_path = os.path.join(ASSETS_DIR, imagen)
        res = None
        if region:
            res = pyautogui.locateOnScreen(imagen_path, confidence=confianza, region=region, grayscale=True)
        else:
            res = pyautogui.locateOnScreen(imagen_path, confidence=confianza, grayscale=True)

        if res:
             print(f"   [DETECCIÓN] Encontrada imagen: {imagen} (confianza: {confianza})")
        return res
    except pyautogui.ImageNotFoundException:
        return None
    except Exception as e:
        # Si falla por falta de librería, avisamos
        if "confidence" in str(e):
            print("\nError: Falta OpenCV. Ejecuta: pip install opencv-python")
            sys.exit()
        print(f"   [DEBUG] Error buscando {imagen}: {e}")
        return None

# --- VERIFICACIÓN INICIAL ---
print("--- DIAGNÓSTICO (MODO CON OPENCV 🧠 + AUTO SCROLL 📜) ---")
print(f"Total clases: {len(clases_raw)}")
print(f"Comandos generados (bloques de {CHUNK_SIZE}): {len(comandos)}")

# Verificación de imágenes
imagenes_necesarias = [
    'boton-acept-all.jpg',
    'ready.png',
    'implementation.jpg',
    'implementation2.jpg',
    'proceed.png',
    'advertencia.png',           # Imagen del símbolo de advertencia ⚠️
    'no_token_ai.png',          # Nueva imagen para detectar falta de tokens
    'choose-model2.png',        # Nueva imagen para menú de modelos
    'allow-this.png',           # Imagen para permitir acción
    'retry.png',                # Imagen para reintentar
    'expand.png'                # Imagen para expandir (click automático)
]

ahorrar_tokens=r"""Regla Obligatoria de Continuación

-- Al terminal tambien debes decir GOOD o BAD para qsaber que ya lo terminaste todo. RECUERDA GOOD y BAD
"""
# Configuración global de PyAutoGUI
pyautogui.PAUSE = 0.5  # Pausa de medio segundo entre comandos

# Añadir las imágenes de modelos preferidos a la lista de verificación
for modelo_img in MODELOS_PREFERIDOS:
    imagenes_necesarias.append(modelo_img)

falta_imagen = False

for img in imagenes_necesarias:
    img_path = os.path.join(ASSETS_DIR, img)
    if not os.path.exists(img_path):
        print(f"ADVERTENCIA: No encuentro la imagen '{img}' en {ASSETS_DIR}")
        if img == 'ready.png':
            print("   -> ERROR CRÍTICO: Sin 'ready.png' el script no sabrá cuándo parar.")
            falta_imagen = True
        elif img == 'implementation.jpg':
             print("   -> (El script no escribirá 'listo' automáticamente sin esta imagen).")
        elif img == 'implementation2.jpg':
             print("   -> (El script no escribirá 'listo' automáticamente sin esta imagen).")
        elif img in MODELOS_PREFERIDOS:
            print(f"   -> (El modelo '{img}' no podrá ser seleccionado automáticamente).")

if falta_imagen:
    print("\nSOLUCIÓN: Asegúrate de tener las imágenes .jpg/.png en la carpeta.")
    sys.exit()

print("\n--- INICIANDO SCRIPT ---")
print("Posiciona el mouse sobre la caja de texto (asegúrate que el foco esté en el chat).")
print("Iniciamos en 5 segundos...")
time.sleep(5)

def run_automation_pass(comandos, prompt_base, prompt_context, desc_prefix):
    for i, comando in enumerate(comandos):
        texto_a_pegar = f"{prompt_base}\n\n\n{prompt_context}\n\n\n {desc_prefix} {comando}\n\n\n"

        print(f"[{i+1}/{len(comandos)}] {desc_prefix} bloque... {ahorrar_tokens} ")

        # 1. Copiar y Pegar (compatible con Windows y Linux)
        try:
            # process = subprocess.Popen(['xclip', '-selection', 'clipboard'], stdin=subprocess.PIPE, close_fds=True)
            # process.communicate(input=texto_a_pegar.encode('utf-8'))
            # print("   [OK] Texto copiado al clipboard (xclip)")
            import pyperclip
            pyperclip.copy(texto_a_pegar)
            print("   [OK] Texto copiado al clipboard (pyperclip)")
        except ImportError:
            print("   [ERROR] Falta librería pyperclip. Instálala con: pip install pyperclip")
            # Fallback a implementación manual simple si falla pyperclip?
            # Por ahora confiamos en pyperclip ya que el usuario demostró tenerla.
        except Exception as e:
            print(f"   [ERROR] No se pudo copiar al clipboard: {e}")

        pyautogui.hotkey('ctrl', 'v')
        time.sleep(1)
        pyautogui.press('enter')

        print("   >>> Vigilando pantalla y haciendo scroll...")

        ia_termino = False
        intentos = 0
        last_files0_check = 0
        last_task_check = 0
        last_refresh_check = 0
        last_expand_check = 0  # Track expand.png checks
        cancel_first_seen = 0  # Track when cancel.png first appeared

        while not ia_termino:
            # Periodic checks for special images
            current_time = time.time()

            # Check files0.png every 5 seconds
            if current_time - last_files0_check >= 5:
                pos_files0 = buscar_imagen_segura('files0.png', confianza=0.7)
                if pos_files0:
                    print("   [!] 'files0.png' detectado. Clickeando...")
                    pyautogui.click(pos_files0)
                last_files0_check = current_time

            # Check expand.png every 5 seconds
            if current_time - last_expand_check >= 5:
                pos_expand = buscar_imagen_segura('expand.png', confianza=0.7)
                if pos_expand:
                    print("   [!] 'expand.png' detectado. Clickeando...")
                    pyautogui.click(pos_expand)
                    time.sleep(1)
                last_expand_check = current_time

            # Check  ask.png every 7 seconds (Espacio intencional)
            if current_time - last_task_check >= 7:
                pos_task = buscar_imagen_segura('ask.png', confianza=0.7)
                if pos_task:
                    print("   [!] 'ask.png' detectado. Clickeando...")
                    pyautogui.click(pos_task)
                last_task_check = current_time

            # Check refresh click every 8 seconds (Coordinates: x=120, y=714)
            if current_time - last_refresh_check >= 8:
                print("   [TIME] 8s pasaron. Haciendo click en refresh (120, 714)...")
                pyautogui.click(x=120, y=714)
                last_refresh_check = current_time

            # Check retry.png - if it appears, click it immediately
            

            # Check cancel.png - if visible for 5+ minutes, auto-click it
            pos_cancel = buscar_imagen_segura('cancel.png', confianza=0.7)
            if pos_cancel:
                if cancel_first_seen == 0:
                    cancel_first_seen = current_time
                    print("   [CANCEL] 'cancel.png' detectado. Iniciando contador de 5 min...")
                elif current_time - cancel_first_seen >= 300:  # 5 minutes = 300 seconds
                    print("   [CANCEL] 'cancel.png' visible por 5+ min. Auto-cancelando...")
                    pyautogui.click(pos_cancel)
                    cancel_first_seen = 0
                    time.sleep(3)
            else:
                if cancel_first_seen != 0:
                    print("   [CANCEL] 'cancel.png' desapareció. Reseteando contador.")
                cancel_first_seen = 0

            # Ahora usamos confidence=0.8 por defecto (80% de coincidencia)

            # A) Botón molesto (Aceptar)
            pos_boton = buscar_imagen_segura('boton-acept-all.jpg', confianza=0.75)

            # B) Archivo implementation
            pos_implementacion = buscar_imagen_segura('implementation.jpg', confianza=0.7)
            # B) Archivo implementation 2
            pos_implementacion2 = buscar_imagen_segura('implementation2.jpg', confianza=0.7)

            proceed = buscar_imagen_segura('proceed.png', confianza=0.7)
            # C) Icono de Listo
            pos_ready = buscar_imagen_segura('ready.png', confianza=0.7)
            # D) Allow-this button
            pos_allow = buscar_imagen_segura('allow-this.png', confianza=0.7)

            pos_retry = buscar_imagen_segura('retry.png', confianza=0.7)
            if pos_retry:
                print("   [!] 'retry.png' detectado. Clickeando...")
                pyautogui.click(pos_retry)
                time.sleep(2)

            if pos_boton:
                print("   [!] Botón 'Aceptar' detectado. Clickeando...")
                pyautogui.click(pos_boton)
                pyautogui.moveRel(0, 100) # Mover un poco más lejos
                time.sleep(2)

            if pos_implementacion:
                print("   [OJO] Archivo detectado. Escribiendo 'listo'...")
                pyautogui.write("listo")
                time.sleep(0.5)
                pyautogui.press('enter')
                print("   --- Pausa de 10s para procesar ---")
                time.sleep(10)
            elif pos_implementacion2:
                print("   [OJO] Archivo detectado2. Escribiendo 'listo'...")
                pyautogui.write("listo")
                time.sleep(0.5)
                pyautogui.press('enter')
                print("   --- Pausa de 10s para procesar ---")
                time.sleep(10)
            elif proceed:
                print("   [!] 'proceed.png' detectado. Clickeando...")
                pyautogui.click(proceed)
                time.sleep(2)
            elif pos_allow:
                print("   [!] 'allow-this.png' detectado. Clickeando...")
                pyautogui.click(pos_allow)
                time.sleep(2)



            elif pos_ready:
                print("   [OK] La IA terminó. Ejecutando secuencia post-tarea...")
                
                # Paso 1: Click en more.png
                time.sleep(1)
                pos_more = buscar_imagen_segura('more.png', confianza=0.7)
                if pos_more:
                    print("   [!] Clickeando 'more.png'...")
                    pyautogui.click(pos_more)
                    time.sleep(1.5)
                else:
                    print("   [?] No se encontró 'more.png'")
                
                # # Paso 2: Click en ask.png
                pos_ask = buscar_imagen_segura('ask.png', confianza=0.7)
                if pos_ask:
                    print("   [!] Clickeando 'ask.png'...")
                    pyautogui.click(pos_ask)
                    time.sleep(1)
                else:
                    print("   [?] No se encontró 'ask.png'")
                
                # Paso 3: Ctrl+V para pegar
                print("   [!] Ejecutando Ctrl+V...")
                pyautogui.hotkey('ctrl', 'v')
                time.sleep(1)
                
                print("   [OK] Secuencia post-tarea completada. Siguiente comando.")
                ia_termino = True

            # --- NUEVA LÓGICA: SÍMBOLO ERROR TOKEN ---
            pos_no_token = buscar_imagen_segura(ERROR_NO_TOKEN, confianza=0.7)
            if pos_no_token:
                print(f"   [!] Detectado '{ERROR_NO_TOKEN}'. Cambiando de modelo...")
                pyautogui.click(pos_no_token)
                time.sleep(1)

                # Paso 1: Click en choose-model2.png
                pos_choose = buscar_imagen_segura(BOTON_CAMBIO_MODELO, confianza=0.7)
                if pos_choose:
                    print(f"   [!] Clickeando '{BOTON_CAMBIO_MODELO}'...")
                    pyautogui.click(pos_choose)
                    time.sleep(2) # Esperar a que el menú abra

                    # Paso 2: Buscar alguno de los modelos preferidos
                    encontrado = False
                    for mod_img in MODELOS_PREFERIDOS:
                        pos_mod = buscar_imagen_segura(mod_img, confianza=0.7)
                        if pos_mod:
                            print(f"   [!] Modelo '{mod_img}' encontrado. Seleccionando...")
                            pyautogui.click(pos_mod)
                            encontrado = True
                            time.sleep(2)
                            break

                    if not encontrado:
                        print("   [?] No se encontró ninguno de los modelos preferidos en el menú.")
                else:
                    print(f"   [?] No se encontró el botón '{BOTON_CAMBIO_MODELO}' después de detectar error.")

            # F) Espera y Scroll
            else:
                # SCROLL AQUÍ: Bajamos para buscar si el botón apareció abajo
                # Bajamos un poco menos y esperamos para que el renderizado se estabilice
                pyautogui.scroll(-200)
                time.sleep(1.5)
                intentos += 1
                if intentos > 600: # 10 minutos
                    print("   [!] Timeout (La IA tardó demasiado).")
                    break
# --- EJECUCIÓN ---
try:
    BEFORE=r"""## Estructura de Carpetas
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
**Screens:** Dashboard, Search, Favorites, Profile.
**Icons:** Lucide React Native (Home, Search, Heart, User).
**Style:** Absolute positioning, blur effect (Glassmorphism), no border top, floating look.
**Animations:** Icon scale on focus.

### #layout-player-stack

**Type:** Stack
**Screens:** Player.
**Header:** Hidden, Landscape orientation lock.
Se usará mocks nomas con jsonserver, no nest js o otro backend, full json server,
expo-app/src/modules ahi crear los  psdt si no existe rules-business.md o rules-endpooint.smd igual avanza con lo que tienes.
crea los schemas, dtos ,apis para json server, los endpoints, los componentes, las vistas, los estilos, los hooks, las utils, etc.
"""
    # print("\n--- PASO 1: GENERACIÓN ---")
    run_automation_pass(comandos, PROMPT_BASE,PROMPT_CONTEXT + BEFORE, "Empezamos con ")
 
    # print("\n--- PASO 2: VERIFICACIÓN ---")
    run_automation_pass(comandos,"",PROMPT_CONTEXT_VERIFIED, "Verificamos si esta al 100% fiel ")
   
    # run_automation_pass([""],"","", "cambia el idioma de la web principal home, contacto,projectos, login, register,etc, blog, etc. osea toda la pagina normales en los 3 idiomas, claro la pagina dashboard normal en español, ojo las paginas de dashboard que estan en wouter ese si en español, fijate en los formularios, cards, deben estar en español ARREGLALO, fijate tomate tu tiempo, mira los archivos, que no se te escape ninguno, sigue las practicas de rules-class.md, rules-pages.md,prompt-frontend.md")
    # run_automation_pass([""],"","", "sigue arreglando check astro check, si ya acabaste presion && pnpm test:e2e:db && y sigue arreglando  pnpm test , recuerda seguir con las practicas de prompt-frontend.md y prompt-backend.md , rules-pages.md")
    # run_automation_pass([""],"","", "que todos los componentes .tsx esten en minuscula,ejemplo name-component.tsx verifica, tomate tu tiempo y testea pnpm test")
   

    # run_automation_pass([""],"","", "EN los seeder blogs en los contenidos debe aver minimo 5000 caracateres, estan muy cortos, psdt debe  en los 3 idiomas pt,en,es y el titulo ya no es necesario, ejemplo # 02. Keyset Pagination (Cursor-based), ya no es necesario. psdt agrega mas practicas senior blog , claro sin que se repitan, agrega mas practicas buenas practicas senior, puede ser practicas para nest,base de datos, optimizacion, practicas de docker, practicas aws, practicas de langchain,etc,, todo lo quie esta en mis conocmientos de mi portfolio., agrega 5 mas. si pones ejemplo hazlo con ts,drizzleorm,expressjs ultima version, tomate tu tiempo, profundiza los archivos")
    # run_automation_pass([""],"","", "arregla las traducciones hay algunos que estan separados tomate tu tiempo, profundiza los archivos.")
    # run_automation_pass([""],"","", "arregla mira en todos los archivos si no hay hardcode de tipos tiene que heredar de los schema, fijate que no hay codigo que no esta usando dry tiene que estar en utils ya sabes prompt-frontend.md, que las apis este en sus archivos, que las apis esten bien tipado, fijate que no tengan as any, que este bien tipado.  tomate tu tiempo , revisa codigo por codigo")
    # run_automation_pass([""],"","", "arregla mira en todos los archivos si no hay hardcode de tipos tiene que heredar de los schema, fijate que no hay codigo que no esta usando dry tiene que estar en utils ya sabes prompt-frontend.md, que las apis este en sus archivos, que las apis esten bien tipado, fijate que no tengan as any, que este bien tipado. tomate tu tiempo , revisa codigo por codigo")
    # run_automation_pass([""],"","", "arregla mira en todos los archivos si no hay hardcode de tipos tiene que heredar de los schema, fijate que no hay codigo que no esta usando dry tiene que estar en utils ya sabes prompt-frontend.md, que las apis este en sus archivos, que las apis esten bien tipado, fijate que no tengan as any, que este bien tipado. tomate tu tiempo , revisa codigo por codigo")
    # run_automation_pass([""],"","", "arregla mira en todos los archivos si no hay hardcode de tipos tiene que heredar de los schema, fijate que no hay codigo que no esta usando dry tiene que estar en utils ya sabes prompt-frontend.md, que las apis este en sus archivos, que las apis esten bien tipado, fijate que no tengan as any, que este bien tipado. tomate tu tiempo , revisa codigo por codigo")

    # run_automation_pass([""],"","", "fijate donde haya codigo que se repita, recuerda dry, evita hardcode, codigo limpio, seguir las practicas de prompt-fronten.md y prompt-backend.md. tomate tu tiempo , revisa codigo por codigo")
    # run_automation_pass([""],"","", "fijate donde haya codigo que se repita, recuerda dry, evita hardcode, codigo limpio, seguir las practicas de prompt-fronten.md y prompt-backend.md. tomate tu tiempo , revisa codigo por codigo")
    # run_automation_pass([""],"","", "fijate donde haya codigo que se repita, recuerda dry, evita hardcode, codigo limpio, seguir las practicas de prompt-fronten.md y prompt-backend.md. tomate tu tiempo , revisa codigo por codigo")
    # run_automation_pass([""],"","", "fijate donde haya codigo que se repita, recuerda dry, evita hardcode, codigo limpio, seguir las practicas de prompt-fronten.md y prompt-backend.md. tomate tu tiempo , revisa codigo por codigo")
    # run_automation_pass([""],"","", "fijate donde haya codigo que se repita, recuerda dry, evita hardcode, codigo limpio, seguir las practicas de prompt-fronten.md y prompt-backend.md. tomate tu tiempo , revisa codigo por codigo")

    # run_automation_pass([""],"","", "so te das cuenta en blog-post/seeders/content sigue agregando las imagenes que faltan como tambien agrega mas contenido en los .md en cada uno de esos con ejemplos practicos en ts, express, con drizzle,etc, minimo 3000 caracteres debe haber en blog-post/seeders/content/.md, tomate tu tiempo profundiza.")    
    # run_automation_pass([""],"","", "so te das cuenta en blog-post/seeders/content sigue agregando las imagenes que faltan como tambien agrega mas contenido en los .md en cada uno de esos con ejemplos practicos en ts, express, con drizzle,etc, minimo 3000 caracteres debe haber en blog-post/seeders/content/.md, tomate tu tiempo profundiza.")    
    # run_automation_pass([""],"","", "so te das cuenta en blog-post/seeders/content sigue agregando las imagenes que faltan como tambien agrega mas contenido en los .md en cada uno de esos con ejemplos practicos en ts, express, con drizzle,etc, minimo 3000 caracteres debe haber en blog-post/seeders/content/.md, tomate tu tiempo profundiza.")    
    # run_automation_pass([""],"","", "so te das cuenta en blog-post/seeders/content sigue agregando las imagenes que faltan como tambien agrega mas contenido en los .md en cada uno de esos con ejemplos practicos en ts, express, con drizzle,etc, minimo 3000 caracteres debe haber en blog-post/seeders/content/.md, tomate tu tiempo profundiza.")    
    # run_automation_pass([""],"","", "so te das cuenta en blog-post/seeders/content sigue agregando las imagenes que faltan como tambien agrega mas contenido en los .md en cada uno de esos con ejemplos practicos en ts, express, con drizzle,etc, minimo 3000 caracteres debe haber en blog-post/seeders/content/.md, tomate tu tiempo profundiza.")    
    # run_automation_pass([""],"","", "so te das cuenta en blog-post/seeders/content sigue agregando las imagenes que faltan como tambien agrega mas contenido en los .md en cada uno de esos con ejemplos practicos en ts, express, con drizzle,etc, minimo 3000 caracteres debe haber en blog-post/seeders/content/.md, tomate tu tiempo profundiza.")    
    # run_automation_pass([""],"","", "so te das cuenta en blog-post/seeders/content sigue agregando las imagenes que faltan como tambien agrega mas contenido en los .md en cada uno de esos con ejemplos practicos en ts, express, con drizzle,etc, minimo 3000 caracteres debe haber en blog-post/seeders/content/.md, tomate tu tiempo profundiza.")    
    # run_automation_pass([""],"","", "so te das cuenta en blog-post/seeders/content sigue agregando las imagenes que faltan como tambien agrega mas contenido en los .md en cada uno de esos con ejemplos practicos en ts, express, con drizzle,etc, minimo 3000 caracteres debe haber en blog-post/seeders/content/.md, tomate tu tiempo profundiza.")    

    # run_automation_pass([""],"","", "arregla las traducciones hay algunos que estan separados tomate tu tiempo, profundiza los archivos.")    
    # run_automation_pass([""],"","", "arregla las traducciones hay algunos que estan separados tomate tu tiempo, profundiza los archivos.")
    # run_automation_pass([""],"","", "sigue arreglando check astro check, si ya acabaste presion && pnpm test:e2e:db && y sigue arreglando  pnpm test , recuerda seguir con las practicas de prompt-frontend.md y prompt-backend.md , rules-pages.md")
    # run_automation_pass([""],"","", "sigue arreglando check astro check, si ya acabaste presion && pnpm test:e2e:db && y sigue arreglando  pnpm test , recuerda seguir con las practicas de prompt-frontend.md y prompt-backend.md , rules-pages.md")
    run_automation_pass([""],"","", "sigue arreglando check astro check, si ya acabaste presion && pnpm test:e2e:db && y sigue arreglando  pnpm test , mejora el diseño de open-source.astro y slug.astro recuerda seguir con las practicas de prompt-frontend.md y prompt-backend.md , rules-pages.md")
    run_automation_pass([""],"","", "sigue arreglando check astro check, si ya acabaste presion && pnpm test:e2e:db && y sigue arreglando  pnpm test , mejora el diseño de open-source.astro y slug.astro recuerda seguir con las practicas de prompt-frontend.md y prompt-backend.md , rules-pages.md")
    run_automation_pass([""],"","", "sigue arreglando check astro check, si ya acabaste presion && pnpm test:e2e:db && y sigue arreglando  pnpm test , mejora el diseño de open-source.astro y slug.astro recuerda seguir con las practicas de prompt-frontend.md y prompt-backend.md , rules-pages.md")
    run_automation_pass([""],"","", "sigue arreglando check astro check, si ya acabaste presion && pnpm test:e2e:db && y sigue arreglando  pnpm test , mejora el diseño de open-source.astro y slug.astro recuerda seguir con las practicas de prompt-frontend.md y prompt-backend.md , rules-pages.md")
    run_automation_pass([""],"","", "sigue arreglando check astro check, si ya acabaste presion && pnpm test:e2e:db && y sigue arreglando  pnpm test , mejora el diseño de open-source.astro y slug.astro recuerda seguir con las practicas de prompt-frontend.md y prompt-backend.md , rules-pages.md")

except KeyboardInterrupt:
    print("\nScript detenido por el usuario.")
except Exception as e:
    print(f"\nERROR CRÍTICO: {e}")
