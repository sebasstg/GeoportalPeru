# UNHCR Peru · Atlas de Protección y Servicios 

Geoportal interno de la Unidad de Gestión de Información (IM) de ACNUR Perú. Muestra puntos de servicio, infraestructura pública, límites administrativos y capas de análisis (población por nacionalidad, riesgo El Niño 2026–2027) sobre un mapa web.

- **Tecnología:** HTML + JavaScript sin frameworks ni compilación, [Leaflet](https://leafletjs.com) 1.9.4 y [mapshaper](https://github.com/mbloch/mapshaper) 0.6.102 (copias locales en `lib/`).
- **Idiomas:** español, inglés y chino.
- **Acceso:** pide una contraseña en cada visita.
- **Funciona** abriendo `index.html` con doble clic (sin servidor) o publicado en GitHub Pages.



---

## Estructura

```
Geoportal/
├─ index.html            La página del Atlas
├─ capas.js              Catálogo de capas: qué se muestra y cómo  ← aquí se agregan capas
├─ make_atlas_data.html  Constructor: genera data/ a partir de source/
├─ data/                 Datos publicados (generados, no editar a mano)
│  ├─ atlas_index.js     Índice de capas + departamentos y puntos (se carga al abrir)
│  └─ *.js               Una capa por archivo (se carga solo al activarla)
├─ assets/
│  ├─ icons/             Íconos de puntos (PNG ~96 px)
│  ├─ img/               Logo y foto de portada
│  └─ logos/             Logos de las fuentes (INEI, CENEPRED, R4V, SENAMHI, ENFEN) — opcional
├─ lib/                  Leaflet y mapshaper (copias locales)
└─ source/               GeoJSON originales — NO se suben a GitHub (.gitignore)
```

| ¿Se sube a GitHub? | |
|---|---|
| Sí | `index.html`, `capas.js`, `make_atlas_data.html`, `data/`, `assets/`, `lib/`, `README.md`, `.gitignore` |
| No | `source/`, `_respaldo_*/`, `atlas_data.js` (formato antiguo) |

---

## Uso rápido

1. Abra `index.html` en Chrome o Edge.
2. Ingrese la contraseña.
3. Elija un área de respuesta o "Explorar el mapa".

---

## Agregar o actualizar una capa

### 1. Coloque el archivo original en `source/`

GeoJSON o Esri JSON (exportado de ArcGIS Pro / QGIS). Puede estar en cualquier subcarpeta, por ejemplo `source/salud/establecimientos.geojson`.

- Coordenadas: preferible EPSG:4326. UTM 18S y Web Mercator se convierten solos.
- Nombres de archivo: respete MAYÚSCULAS y tildes al escribirlos en `capas.js` (GitHub Pages las distingue).

### 2. Declárela en `capas.js`

Copie un bloque existente en la lista que corresponda. Las rutas son relativas a `source/`.

**Puntos de servicio** (`points`):
```js
Salud: {
  icon: 'assets/icons/salud.png',
  data: 'salud/establecimientos.geojson',
  color: '#2e7d32', radii: [5000, 10000],          // anillos de cobertura en metros
  name: { es: 'Establecimientos de salud', en: 'Health facilities', zh: '医疗机构' }
}
```

**Líneas** (`infraGroups` → `layers`):
```js
{ id: 'rios', file: 'hidro/rios.geojson', color: '#1e88e5', weight: 2, dash: null, on: false,
  name: { es: 'Ríos principales', en: 'Main rivers', zh: '主要河流' } }
```

**Capas de análisis** (`analysisLayers`):
```js
{ topic: 'emergency', year: 2027, file: 'el_nino/nueva_capa.geojson', colorBy: 'campo_numerico',
  es: 'Nombre en español', en: 'English name', zh: '中文名称' }
```
`topic`: `protection` · `assistance` · `emergency` · `inclusion` · `solutions`.
Misma capa en varios años: repita el bloque con el **mismo** nombre `es` y otro `year` / `file`; la página muestra un selector de año.

### 3. ¿Es un indicador por distrito? Publíquelo como tabla

Si el archivo es **el mismo mapa de distritos con otros datos** (población, riesgo, pobreza…), agréguelo además en `build.tables`:

```js
tables: {
  'el_nino/nueva_capa.geojson': { base: 'boundary/limites_distritales.geojson' }
}
```

Se publica solo la tabla (~1–2 MB en vez de ~70 MB) y la página la une a los distritos por **UBIGEO** (con corrección automática de códigos censales de Lima/Callao y respaldo por nombre de distrito). El constructor avisa si detecta un mapa de distritos que debería ir aquí.

### 4. Genere los datos

1. Abra `make_atlas_data.html` en Chrome o Edge.
2. **Opción 1 (recomendada):** "Elegir carpeta" → seleccione la carpeta del Geoportal → acepte los permisos. Los archivos se escriben directamente en `data/`.
   **Opción 2:** si la 1 no funciona, elija la carpeta, descargue `data.zip` y descomprímalo en la carpeta del sitio **sobrescribiendo** (no borre `data/`).
3. Revise la tabla de resultados: cada capa en verde (OK), peso original vs. publicado, y notas.

Con "Procesar solo las capas cuyo original cambió" (activado por defecto) solo se rehacen las capas modificadas.

### 5. Revise y publique

Abra `index.html`, compruebe la capa y suba los cambios a GitHub.

---

## Límites de tamaño

Configurables en `capas.js → build`:

| Parámetro | Valor | Qué hace |
|---|---|---|
| `simplify.polygons` | `0.10` | Conserva el 10 % de los vértices (mantiene bordes compartidos y distritos pequeños) |
| `simplify.lines` | `null` | Líneas sin simplificar |
| `simplifyByFile` | — | Excepciones por archivo, p. ej. `{ 'boundary/limites_distritales.geojson': 0.20 }` |
| `warnMB` | `10` | Avisa si una capa publicada supera este peso |
| `maxMB` | `50` | No publica capas más pesadas (GitHub rechaza archivos > 100 MB) |

Referencia actual: originales 306 MB → publicado 14 MB; carga inicial 1,1 MB.

---

## Contraseña

- Se pide en cada visita; no se recuerda.
- En `index.html` solo está su huella SHA-256 (`const ACCESS_HASH = '…'`), no la contraseña.
- **Cambiarla:** `make_atlas_data.html` → sección "Cambiar contraseña" → escriba la nueva → copie la línea generada y reemplace `ACCESS_HASH` en `index.html`.

> ⚠️ Es una barrera de acceso, no cifrado. Los archivos de `data/` son legibles por quien conozca su dirección exacta. No publique datos personales ni información sensible de protección.

---

## Publicar en GitHub Pages

1. Suba los archivos (sin `source/`) a la rama `main`.
2. En GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
3. El sitio queda en `https://<usuario>.github.io/GeoportalPeru/`.

Notas:
- Con repositorio **privado**, GitHub Pages requiere GitHub Pro / Team. El sitio publicado es público de todas formas (protegido solo por la contraseña).
- GitHub Pages comprime los archivos al enviarlos: los 14 MB de `data/` viajan como ~4 MB.
- Tras publicar datos nuevos, los usuarios ven la versión nueva automáticamente (cada archivo lleva la fecha de generación).

---

## Problemas frecuentes

| Mensaje / síntoma | Causa | Solución |
|---|---|---|
| "No se encontró data/atlas_index.js" | Falta `data/` o se abrió una copia suelta de `index.html` | Abra `index.html` desde la carpeta completa o ejecute el constructor |
| "{capa} no está en los datos" | La capa está en `capas.js` pero no se generó | Ejecute `make_atlas_data.html` |
| Capa en rojo en el constructor: "No está en source/" | Nombre distinto en `capas.js` | Copie el nombre exacto (mayúsculas, tildes, espacios) |
| Capa en rojo: "Pasa de 50 MB" | Geometría demasiado detallada | Baje el % en `simplifyByFile` o simplifique en ArcGIS |
| Ícono reemplazado por un punto de color | PNG no encontrado | Revise la ruta en `capas.js` (mayúsculas) |
| No aparece el mapa base | Sin internet o Esri no responde | La página cambia sola a un mapa base alternativo |

---

## Fuentes de datos

INEI (Censo 2025) · CENEPRED (escenario de riesgo, lluvias enero–marzo 2027) · R4V (estimaciones de población) · SENAMHI · ENFEN.
Elaborado por la Unidad de Gestión de Información, ACNUR Perú.

## Licencias de terceros

- Leaflet — BSD-2-Clause (`lib/leaflet/LICENSE.txt`)
- mapshaper — MPL-2.0 (`lib/mapshaper/LICENSE.txt`)
- Mapas base © Esri
