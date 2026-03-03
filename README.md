# React Native Expo - Microfrontend Workspace

Este repositorio central alberga múltiples aplicaciones y proyectos experimentales relacionados a la evolución de un entorno monolítico en React Native (Expo) hacia un enfoque **Microfrontend**.

A continuación, se detalla la estructura principal del proyecto y qué hace cada una de las carpetas:

## Estructura Principal

### 📁 1. `microfrontend/`

Esta es la **carpeta principal y más relevante** del proyecto manejada actualmente. Es un monorepo configurado con [Nx](https://nx.dev/), que implementa la arquitectura y tooling final de microfrontends usando herramientas como pnpm, Rspack (Module Federation) y Vitest.

Contiene dos áreas clave:

- **`apps/` (Aplicaciones):**
  - **`shell-app`**: Es la aplicación "Host" o contenedora. Se encarga de la orquestación, de manejar la navegación principal y de consumir/cargar dinámicamente el resto de los microfrontends remotos.
  - **`service-cobranzas`**: Microfrontend remoto independiente que maneja el módulo y flujo de "Cobranzas" (Billing/Collections).
  - **`service-legal`**: Microfrontend remoto independiente que maneja los servicios y flujos "Legales".
- **`packages/` (Librerías Compartidas):**
  - **`auth-lib`**: Librería compartida que centraliza la lógica, contexto y estado de autenticación (Login, Tokens, Sesiones) para que todos los microfrontends la consuman de manera unificada.
  - **`ui-kit`**: Librería de componentes visuales compartidos (botones, inputs, layouts), que utiliza NativeWind para asegurar un sistema de diseño consistente.
  - **`utils`**: Funciones auxiliares, helpers, formateadores o validadores comunes entre todas las aplicaciones.

---

### 📁 2. `expo-app/`

Un proyecto estándar/monolíto de Expo (posiblemente la app principal original). Puede ser utilizado como base histórica o prototipo antes de migrar al modelo de microfrontends.

---

### 📁 3. `expo-microfrontend/`

Una prueba de concepto (PoC) o estructura alternativa antigua dedicada a microfrontends con Expo. En base al estado actual, el desarrollo activo de esta arquitectura se ha movido y centralizado dentro de la carpeta principal `microfrontend/`.

---

### 📁 4. `scripts/`

Carpeta destinada a contener utilitarios ejecutables (Bash, Node), automatizaciones personalizadas o scripts para procesos de CI/CD (construcción de aplicaciones de manera automatizada u operaciones de mantenimiento en el repositorio).

---

### 📁 5. `tutorial/`

Contiene pruebas, pasos paso-a-paso, investigaciones técnicas o documentación sobre la cual el equipo se ha estado basando para asimilar e implementar la complejidad de la arquitectura.
