// Per-module copy (Spanish). Features are limited to what exists in the product today.

const modules = {
  audits: {
    name: 'Auditorías',
    summary: 'Cree listas de verificación de auditoría, realice auditorías en planta y siga cada hallazgo hasta su cierre.',
    features: [
      'Listas de auditoría con secciones y preguntas ponderadas, puntuadas por total ponderado, tasa de conformidad o nivel de madurez (de E a A)',
      '11 tipos de respuesta: puntuaciones de 0–5 y 0–10, Conforme / NC / NA, desviación menor o mayor, medidas numéricas y más',
      'Sesiones de campo con GPS, fotos obligatorias, firmas del auditor y del auditado, y códigos QR por ubicación',
      'Hallazgos con análisis de causa raíz 5 porqués e Ishikawa, verificaciones de eficacia y cualificaciones de auditores',
    ],
  },
  quality: {
    name: 'Calidad / PDCA',
    summary: 'Registre no conformidades y hallazgos de campo, y gestione ciclos estructurados Plan-Do-Check-Act hasta su cierre.',
    features: [
      'No conformidades por origen (cliente, proveedor, auditoría, inspección) y gravedad, con un flujo detectada → análisis → acción → verificación → cerrada',
      'Ciclos PDCA: indicador, objetivo y fecha límite, causas raíz con análisis 5M, verificación del objetivo y de quién lo validó',
      'Etapa Act que registra el cambio de estándar (nuevo documento, revisión, formación o comunicación) con evidencias e historial completo',
      'Recorridos Gemba con rúbricas y observaciones, y auditorías 5S puntuadas por cada S',
    ],
  },
  kaizen: {
    name: 'Kaizen',
    summary: 'Recoja ideas de mejora de todo el personal, revíselas en comité y mida lo que aportan.',
    features: [
      'Envíe una idea en segundos escaneando un código QR en planta',
      'Revisión en comité con votaciones (anónimas si lo desea), además de votos y comentarios de los empleados',
      'Ahorros estimados y reales, con el retorno de la inversión calculado automáticamente',
      'Campañas, objetivos estratégicos, insignias y un historial de estados que no se puede modificar',
    ],
  },
  documents: {
    name: 'Documentos',
    summary: 'Documentos controlados con versiones, circuitos de aprobación y acuses de «leído y comprendido».',
    features: [
      'Espacios y carpetas con reglas de numeración automática',
      'Versiones y plantillas de flujo de aprobación: borrador, revisión, aprobado',
      'Acuses de lectura firmados y trazables para cada lector',
      'Fechas de revisión y de caducidad, niveles de confidencialidad, reglas de acceso y registro de auditoría de documentos',
    ],
  },
  meetings: {
    name: 'Reuniones',
    summary: 'Planifique y dirija reuniones, y convierta cada decisión en una acción con seguimiento.',
    features: [
      'Reuniones periódicas con participantes y confirmación de asistencia',
      'Puntos del orden del día con tiempo asignado, incluidos puntos de revisión de KPI',
      'Actas generadas y enviadas automáticamente tras la reunión',
      'Decisiones, acciones, un aparcamiento para temas secundarios y encuestas de valoración',
    ],
  },
  tasks: {
    name: 'Tareas',
    summary: 'Una única bandeja para todo lo que se le asigna, venga del módulo que venga.',
    features: [
      'Una sola lista de trabajo con estado y prioridad',
      'Recoge acciones PDCA, hallazgos, tareas de proyecto, aprobaciones de documentos, Kaizen, acciones de reuniones y planes de auditoría',
      'También recibe evaluaciones, actividades de CRM, solicitudes de ausencia, órdenes de mantenimiento e incidencias de soporte',
      'Disponible en la aplicación móvil como «Mi trabajo»',
    ],
  },
  projects: {
    name: 'Proyectos',
    summary: 'Gestione proyectos con fases, hitos, tareas y una vista Gantt.',
    features: [
      'Fases, hitos y tareas con listas de verificación y seguimiento de bloqueos',
      'Vista de diagrama de Gantt',
      'Registro de incidencias y equipo del proyecto',
      'Consolidación del avance, historial de estados, comentarios y archivos adjuntos',
    ],
  },
  talents: {
    name: 'Talentos',
    summary: 'Un marco de competencias y una matriz de polivalencia, con certificaciones controladas antes de que caduquen.',
    features: [
      'Familias de competencias y perfiles de puesto con niveles requeridos, versionados',
      'Competencias de los empleados y análisis de brechas frente al perfil del puesto',
      'Cualificaciones y certificaciones con alertas de caducidad a 90, 60, 30 y 7 días',
      'Planes de sucesión, posicionamiento en la matriz 9-box, previsiones de plantilla y guías de incorporación',
    ],
  },
  evaluations: {
    name: 'Evaluaciones',
    summary: 'Evaluaciones anuales y de periodo de prueba, feedback 360° y planes de desarrollo.',
    features: [
      'Campañas de evaluación: autoevaluación, responsable, compañeros, experto, observación Gemba y pruebas',
      'Feedback 360°, anónimo si es necesario, con calibración',
      'Feedback continuo: reuniones individuales, seguimientos y feedback puntual',
      'Planes y acciones de desarrollo, con instantáneas de desempeño',
    ],
  },
  training: {
    name: 'Formación',
    summary: 'Planifique y siga las sesiones de formación, los presupuestos y la asistencia.',
    features: [
      'Planes de formación con presupuesto total, gastado y restante',
      'Formadores con coste diario',
      'Sesiones internas, externas, e-learning y en el puesto de trabajo vinculadas a competencias',
      'Necesidades de formación generadas por las evaluaciones, inscripciones con asistencia y calificaciones',
    ],
  },
  hr: {
    name: 'RR. HH.',
    summary: 'Expedientes de los empleados y administración diaria de RR. HH.',
    features: [
      'Centros, departamentos, zonas, puestos y categorías salariales',
      'Empleados, contratos y movilidad interna',
      'Tipos de ausencia, asignaciones y solicitudes; control de presencia con horas extra',
      'Nóminas con líneas de complementos, deducciones e impuestos',
    ],
  },
  recruitment: {
    name: 'Selección',
    summary: 'La contratación desde la solicitud de puesto hasta la ficha del empleado, sin volver a teclear nada.',
    features: [
      'Solicitudes de puesto con flujo de aprobación',
      'Ofertas de empleo, candidatos, cantera de talento y candidaturas a lo largo de las etapas de selección',
      'Entrevistas con valoraciones estructuradas y recomendaciones',
      'Ofertas y negociación: «contratar» crea automáticamente el empleado en RR. HH.',
    ],
  },
  crm: {
    name: 'CRM',
    summary: 'Clientes potenciales, cuentas, contactos y su embudo de ventas.',
    features: [
      'Clientes potenciales con puntuación de marketing y de ventas, e importación desde Excel',
      'Cuentas, contactos, territorios y equipos comerciales',
      'Embudos y etapas con probabilidad, motivos de pérdida e historial de etapas',
      'Actividades, presupuestos, salud del cliente, renovaciones y reglas de automatización',
    ],
  },
  marketing: {
    name: 'Marketing',
    summary: 'Campañas por correo electrónico y WhatsApp y secuencias automatizadas que alimentan el CRM.',
    features: [
      'Plantillas de correo electrónico de arrastrar y soltar',
      'Audiencias y secuencias automatizadas de varios pasos',
      'Campañas con variantes A/B y seguimiento UTM',
      'Seguimiento de aperturas, clics y rebotes, lista de exclusión y envío por WhatsApp',
    ],
  },
  sales: {
    name: 'Ventas',
    summary: 'Productos, tarifas y pedidos de clientes.',
    features: [
      'Productos con categorías, variantes y unidades',
      'Tarifas con descuentos, fórmulas y escalas por cantidad',
      'Pedidos de venta de borrador a completado, con cantidades entregadas y facturadas',
      'Política de facturación por pedido o por entrega',
    ],
  },
  purchase: {
    name: 'Compras',
    summary: 'Ofertas de proveedores y pedidos de compra.',
    features: [
      'Solicitudes de oferta y pedidos de compra',
      'Flujo de aprobación: pendiente, aprobado, rechazado',
      'Cantidades recibidas controladas por línea',
      'Tarifas de proveedores',
    ],
  },
  accounting: {
    name: 'Contabilidad',
    summary: 'Contabilidad, facturación e informes financieros.',
    features: [
      'Plan de cuentas, impuestos y condiciones de pago',
      'Diarios y asientos con contabilización y anulación',
      'Facturas de clientes, facturas de proveedores, notas de crédito y pagos, multidivisa',
      'Cuenta de resultados y antigüedad de cuentas por cobrar y por pagar',
    ],
  },
  reporting: {
    name: 'Informes',
    summary: 'Cree sus propios cuadros de mando e indicadores con los datos de cualquier módulo.',
    features: [
      'Cuadros de mando con tarjetas KPI, gráficos de líneas, barras y sectores, y tablas',
      'Definiciones de KPI compartidas en toda la empresa',
      'Conjuntos de datos, medidas e informes de varias páginas',
      'Envío programado en PDF, Excel o CSV',
    ],
  },
  inventory: {
    name: 'Inventario',
    summary: 'Almacenes, ubicaciones y existencias.',
    features: [
      'Almacenes y ubicaciones',
      'Lotes y números de serie con fechas de caducidad',
      'Transferencias y movimientos de existencias',
      'Reglas de reaprovisionamiento y valoración de existencias (coste medio o FIFO)',
    ],
  },
  manufacturing: {
    name: 'Fabricación',
    summary: 'Planificación y ejecución de la producción.',
    features: [
      'Centros de trabajo con capacidad, eficiencia, coste por hora y objetivo de OEE',
      'Rutas y operaciones',
      'Listas de materiales y componentes',
      'Órdenes de fabricación, órdenes de trabajo y órdenes de desecho',
    ],
  },
  maintenance: {
    name: 'Mantenimiento',
    summary: 'Mantenga los equipos en funcionamiento con planes preventivos y órdenes de trabajo con seguimiento.',
    features: [
      'Equipos, categorías y equipos de mantenimiento',
      'Planes preventivos activados por un intervalo fijo o por una lectura de contador',
      'Órdenes de trabajo preventivas y correctivas con pasos y repuestos',
      'Solicitudes de mantenimiento y calendario de mantenimiento',
    ],
  },
  iot: {
    name: 'IoT',
    summary: 'Conecte los sensores de las máquinas, vea las lecturas en tiempo real y reciba alertas.',
    features: [
      'Dispositivos (sensores, contadores, PLC, cámaras) mediante MQTT, HTTP o WebSocket',
      'Puntos de datos en tiempo real transmitidos a la pantalla',
      'Reglas de alerta: por encima, por debajo, igual a o fuera de un rango',
      'Eventos de alerta con notificaciones',
    ],
  },
  helpdesk: {
    name: 'Helpdesk',
    summary: 'Incidencias de soporte internas o de clientes con niveles de servicio.',
    features: [
      'Tipos de incidencia y equipos de soporte',
      'Políticas de SLA con plazos de primera respuesta y de resolución por incidencia',
      'Canales de correo electrónico, portal y teléfono, con notas internas',
      'Base de conocimiento con categorías y artículos',
    ],
  },
}

export default modules
