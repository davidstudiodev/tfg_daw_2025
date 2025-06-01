# JobsXDevs - Frontend

Este es el frontend de JobsXDevs, desarrollado con Vue 3 y Vite. Permite a desarrolladores y empresas gestionar perfiles, ofertas y aplicaciones de manera sencilla y moderna.

---

## Índice

- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Uso básico](#uso-básico)
- [Notas adicionales](#notas-adicionales)
- [Contacto](#contacto)

---

## Requisitos previos

- Node.js (v18 o superior recomendado)
- npm

---

## Instalación y configuración

1. **Accede a la carpeta del frontend:**

   ```bash
   cd jobsxdevs/frontend
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en la raíz de `/frontend` con el siguiente contenido (ajusta si es necesario):

   ```
   VITE_API_URL=http://localhost:3000/api
   ```

   > Asegúrate de que la URL coincida con la del backend.

4. **Inicia la aplicación:**

   - En desarrollo:

     ```bash
     npm run dev
     ```

   - La aplicación estará disponible en `http://localhost:5173`

---

## Estructura del proyecto

```
frontend/
│
├── src/
│   ├── assets/         # Recursos estáticos (imágenes, estilos)
│   ├── components/     # Componentes reutilizables
│   ├── constants/      # Constantes globales (por ejemplo, techOptions)
│   ├── services/       # Servicios para consumir la API
│   ├── views/          # Vistas principales (DevProfile, CompanyProfile, etc.)
│   ├── App.vue         # Componente raíz
│   ├── main.js         # Punto de entrada de la aplicación
│   └── style.css       # Estilos globales
├── router/             # Definición de rutas con Vue Router
├── public/             # Archivos públicos
├── .env                # Variables de entorno
├── vite.config.js      # Configuración de Vite y proxy
└── README.md           # Este archivo
```

---

## Variables de entorno

El archivo `.env` debe contener la URL base de la API backend:

```
VITE_API_URL=http://localhost:3000/api
```

---

## Scripts disponibles

- `npm run dev`  
  Inicia la aplicación en modo desarrollo.
- `npm run build`  
  Genera la versión optimizada para producción.
- `npm run preview`  
  Previsualiza la versión de producción localmente.

---

## Uso básico

- Regístrate como desarrollador o empresa.
- Accede con tus credenciales.
- Completa tu perfil y explora las funcionalidades según tu rol.
- El administrador puede acceder desde `/admin-login` con el usuario admin por defecto.

---

## Notas adicionales

- El frontend consume la API del backend configurada en `VITE_API_URL`.
- El diseño es responsive y está optimizado para desktop y dispositivos móviles.
- Para el correcto funcionamiento de la autenticación, asegúrate de que el backend y el frontend estén en el mismo dominio o que el backend permita CORS y cookies.
- Si necesitas modificar la estructura de la API, consulta la documentación del backend.
- El proxy de desarrollo está configurado en `vite.config.js` para redirigir las peticiones `/api` al backend.

---

## Contacto

Para cualquier duda, sugerencia o reporte de errores, puedes abrir una issue en el repositorio o contactar al autor.

---
