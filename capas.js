/* =====================================================================================
   CATÁLOGO DE CAPAS · 图层目录 — UNHCR Peru · Protection and Services Atlas
   -------------------------------------------------------------------------------------
   Este archivo dice QUÉ capas tiene el Atlas y CÓMO se muestran. index.html lo lee al abrir.
   Para agregar o cambiar una capa NO hace falta tocar index.html:

     1. Ponga el GeoJSON original dentro de la carpeta source/ (por ejemplo source/salud/hospitales.geojson).
     2. Agregue un bloque en la lista que corresponda (points, infraGroups o analysisLayers) copiando
        uno existente. La ruta ("data", "file") es relativa a source/.
     3. Abra make_atlas_data.html y genere los datos: escribe un archivo por capa en data/.

   Rutas: siempre relativas a source/, con "/" y respetando MAYÚSCULAS y tildes exactamente
   (GitHub Pages distingue "Proteccion.png" de "proteccion.png").
   ===================================================================================== */
window.ATLAS_CONFIG = {

  /* ---------- Límites administrativos ---------- */
  deptFile: 'boundary/limites_departamentales_lima_callao.geojson',   // departamentos (siempre cargado)
  boundaryFiles: {
    districts: 'boundary/limites_distritales.geojson'                 // distritos (se carga al entrar a un departamento)
  },

  /* ---------- Puntos de servicio ----------
     icon  : imagen en assets/icons/ (PNG pequeño, ~96 px)
     data  : GeoJSON de puntos (en source/)
     color : color del punto si falta el ícono, y de los anillos de cobertura
     radii : anillos de cobertura en metros [interior, exterior]
     name  : nombre en la lista (es obligatorio; en / zh usan es si faltan) */
  points: {
    CEBAF: {
      icon: 'assets/icons/cebaf.png',
      data: 'pointdata_origin/MapasDistribucion — CEBAF/MapasDistribucion — CEBAF.geojson',
      color: '#c62828', radii: [150000, 300000],
      name: { en: 'CEBAF (border centres)', es: 'CEBAF (centros de frontera)', zh: 'CEBAF 边境服务中心' }
    },
    DataCollection: {
      icon: 'assets/icons/espacios_proteccion.png',
      data: 'pointdata_origin/MapasDistribucion — EspaciosDeProtección_XYTableToPoint/MapasDistribucion — EspaciosDeProtección_XYTableToPoint.geojson',
      color: '#ef6c00', radii: [5000, 10000],
      name: { en: 'Data collection points', es: 'Puntos de recolección de datos', zh: '数据收集点' }
    },
    UNHCR: {
      icon: 'assets/icons/oficinas_acnur.png',
      data: 'pointdata_origin/MapasDistribucion — OficinasACNUR/MapasDistribucion — OficinasACNUR.geojson',
      color: '#0072bc', radii: [200000, 400000],
      name: { en: 'UNHCR offices', es: 'Oficinas del ACNUR', zh: '难民署办事处' }
    },
    PAO: {
      icon: 'assets/icons/paos.png',
      data: 'pointdata_origin/MapasDistribucion — PAOs/MapasDistribucion — PAOs.geojson',
      color: '#6a1b9a', radii: [5000, 10000],
      name: { en: 'PAOs (orientation points)', es: 'PAO (puntos de atención y orientación)', zh: 'PAO 咨询服务点' }
    }
  },

  /* ---------- Infraestructura pública (líneas) ----------
     Orden de la lista = orden en el panel; las de más arriba se dibujan encima.
     file: GeoJSON de líneas · color · weight (grosor) · dash ('6 4' = discontinua, null = continua)
     on: true = visible al abrir el mapa */
  infraGroups: [
    { id: 'transit', pane: 'transitPane', name: { en: 'Public transport', es: 'Transporte público', zh: '公共交通' }, layers: [
      { id: 'metro', file: 'metro/Red de transporte Metro.geojson', color: '#c62828', weight: 4.5, dash: null, on: false,
        name: { en: 'Lima & Callao Metro (rail)', es: 'Metro de Lima y Callao', zh: '地铁（利马与卡亚俄）' } },
      { id: 'brt', file: 'metro/Red de Transporte Metropolitano.geojson', color: '#ef6c00', weight: 3.5, dash: null, on: false,
        name: { en: 'Metropolitano BRT – trunk line', es: 'Metropolitano – vía troncal', zh: 'Metropolitano 快速公交干线' } },
      { id: 'feeder', file: 'metro/Alimentadores Transporte Metropolitano.geojson', color: '#f9a825', weight: 2, dash: '6 4', on: false,
        name: { en: 'Metropolitano feeder routes', es: 'Metropolitano – rutas alimentadoras', zh: 'Metropolitano 接驳线路' } }
    ] },
    { id: 'roads', pane: 'roadsPane', name: { en: 'Road network', es: 'Red vial', zh: '道路网络' }, layers: [
      { id: 'main_roads', file: 'metro/Vias Principales.geojson', color: '#6d4c41', weight: 2.2, dash: null, on: false,
        name: { en: 'Main roads', es: 'Vías principales', zh: '主要道路' } },
      { id: 'callao_roads', file: 'metro/Res de Vias Callao.geojson', color: '#a1887f', weight: 1.2, dash: null, on: false,
        name: { en: 'Callao road network', es: 'Red vial del Callao', zh: '卡亚俄道路网' } }
    ] }
  ],

  /* ---------- Capas de análisis (mapas temáticos) ----------
     topic   : protection | assistance | emergency | inclusion | solutions
     year    : año de los datos (misma capa en varios años: copie el bloque, MISMO nombre es, otro year y file)
     file    : GeoJSON en source/ — o una TABLA unida a los distritos (ver build.tables)
               null = todavía no está lista ("Próximamente")
     colorBy : campo numérico para colorear, o null para un solo color
     es / en / zh : nombre (es es obligatorio) */
  analysisTopics: [
    { topic: 'protection', color: '#e53935' },
    { topic: 'assistance', color: '#fb8c00', label: 'anTopic_population' },
    { topic: 'emergency',  color: '#fdd835' },
    { topic: 'inclusion',  color: '#43a047' },
    { topic: 'solutions',  color: '#1e88e5' }
  ],
  analysisLayers: [
    { topic: 'assistance', year: 2026, file: 'boundary/limites_departamentales_lima_callao.geojson', colorBy: 'Venezuela',
      es: 'Población por nacionalidad – por departamento',
      en: 'Population by nationality – by department',
      zh: '各国籍人口分布 – 按大区' },
    { topic: 'assistance', year: 2026, file: 'boundary/limites_distritales.geojson', colorBy: 'Venezuela',
      es: 'Población por nacionalidad – por distrito',
      en: 'Population by nationality – by district',
      zh: '各国籍人口分布 – 按区' },
    { topic: 'emergency', year: '2026-2027', file: 'el_nino/Población Venezolana selection.geojson', colorBy: 'niv_riesgo_inund',
      es: 'Riesgo por inundaciones – escenario de lluvias verano 2027 (CENEPRED)',
      en: 'Flood risk – rainfall scenario, summer 2027 (CENEPRED)',
      zh: '洪水风险 – 2027 年夏季降雨情景（CENEPRED）' },
    { topic: 'emergency', year: '2026-2027', file: 'el_nino/mass_movement_risk_q1_2027.geojson', colorBy: 'niv_riesgo_mmasa',
      es: 'Riesgo por movimientos en masa – escenario de lluvias verano 2027 (CENEPRED)',
      en: 'Landslide risk – rainfall scenario, summer 2027 (CENEPRED)',
      zh: '滑坡（地质灾害）风险 – 2027 年夏季降雨情景（CENEPRED）' }
  ],

  /* Archivos de El Niño: sus columnas de amenaza reciben un sufijo al leerse (niv_riesgo -> niv_riesgo_inund) */
  hazardFiles: {
    'el_nino/Población Venezolana selection.geojson': 'inund',
    'el_nino/mass_movement_risk_q1_2027.geojson': 'mmasa'
  },

  /* ---------- Cómo se generan los datos (lo usa make_atlas_data.html) ---------- */
  build: {
    /* Simplificación de polígonos: fracción de vértices que se conserva (0.10 = 10 %).
       Conserva los bordes compartidos entre distritos y no elimina distritos pequeños.
       Líneas: null = sin simplificar. */
    simplify: { polygons: 0.10, lines: null },
    simplifyByFile: {
      // 'boundary/limites_distritales.geojson': 0.20,   // ejemplo: más detalle para un archivo
    },

    /* TABLAS: capas que usan el mismo mapa de distritos. Se publica solo la tabla (sin geometría)
       y el navegador la une a los distritos por UBIGEO. Una capa estadística nueva por distrito
       debe ir aquí: pesa ~1–2 MB en vez de ~70 MB. */
    tables: {
      'el_nino/Población Venezolana selection.geojson': { base: 'boundary/limites_distritales.geojson' },
      'el_nino/mass_movement_risk_q1_2027.geojson':     { base: 'boundary/limites_distritales.geojson' }
    },

    /* Límites de tamaño por capa (MB, ya simplificada) */
    warnMB: 10,
    maxMB: 50
  }
};
