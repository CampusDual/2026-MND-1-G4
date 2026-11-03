# Instrucciones del proyecto

## Fuente única de verdad (Single Source of Truth)

Este archivo (`/.github/copilot-instructions.md`) es la **única fuente de verdad** para guiar al asistente en este repositorio.

### Reglas de precedencia dentro del proyecto
- Si una sugerencia del asistente contradice este archivo, **prevalece este archivo**.
- Si existen notas, prompts o documentos auxiliares con diferencias, se consideran **material de apoyo**, no normativa.
- Las decisiones de estilo, arquitectura y organización deben alinearse siempre con estas instrucciones.

### Cómo se aplica en el día a día
- Antes de generar código, se identifica módulo objetivo y se valida contra estas reglas.
- En revisiones de código, este documento actúa como checklist de cumplimiento.
- Cualquier cambio de stack, arquitectura o convenciones se actualiza primero aquí y después en el código.

### Planificación previa obligatoria
- Para cambios medianos o grandes, el asistente debe proponer primero un plan de implementación antes de modificar código.
- Se consideran cambios medianos o grandes los que afecten a más de un módulo, al contrato API (`openapi.yaml`), o a contratos de servicio.
- Solo se permite ejecutar cambios sin plan previo en ajustes triviales (por ejemplo: typo, renombre menor, formato o cambio puntual aislado).
- Flujo recomendado: plan breve -> validación del usuario -> implementación -> verificación mínima -> resumen final de cambios.
- En cambios medianos o grandes, el registro del cambio debe incluir referencia al plan aprobado (por ejemplo: bloque "Plan aplicado" al inicio del registro).

### Mantenimiento
- Versionar este archivo en cada cambio relevante de criterios técnicos.
- Registrar cambios de forma explícita en el historial del proyecto para que todo el equipo conozca las nuevas reglas.
- Evitar duplicar reglas en múltiples documentos para no crear conflictos.

## Alcance y exclusiones
- Este archivo gobierna cómo se generan propuestas de código y diseño en este repositorio.
- El asistente debe respetar el stack y la arquitectura definidos.
- No se deben introducir librerías, frameworks o patrones fuera de alcance sin aprobación explícita.
- No se deben aplicar cambios estructurales sin reflejarlos primero en este documento.

## Rol del asistente
El asistente tiene como objetivo ayudar en el desarrollo del proyecto, proporcionando sugerencias de código, resolviendo
dudas y facilitando la implementación de nuevas funcionalidades. Genera código limpio, legible, mantenible
y siguiendo principios SOLID.

## Idiomas
- **Código y variables/funciones**: Inglés
- **Comentarios y documentación**: Castellano
- **Respuestas en el chat**: Castellano, directo y técnico, pero accesible

## Tecnologías y stack tecnológico
- **Tecnologías**: Java, Maven, HTML, CSS, JavaScript, Angular, TypeScript, Git, GitHub, PostgreSQL, Node, npm, Spring, Spring Boot
- **Backend**: Spring Boot, Java, Maven
- **Frontend**: Angular, HTML, CSS, JavaScript, TypeScript
- **BBDD**: PostgreSQL
- **Gestión de versiones**: Git, GitHub

## Estilo y reglas de código
- Funciones pequeñas con una sola responsabilidad
- Maneja siempre los errores explícitamente (bloques try/catch o validación de nulos).
- Usa tipos de datos explícitos (evita `any` en TypeScript u `Object` en Java).
- No asumas librerías externas a menos que se indiquen explícitamente.

## Reglas de ejecución en terminal
- NUNCA ejecutes comandos de ejecución continua o servidores (como `mvn spring-boot:run`, `mvn exec:java`, `mvn jetty:run` o similares).
- NO intentes levantar la aplicación ni arrancar el servidor web para comprobar los cambios.
- Para verificar que el código compila y es correcto, utiliza EXCLUSIVAMENTE comandos que finalicen por sí solos:
    - `mvn compile` (para comprobar sintaxis y compilación)
    - `mvn test-compile` (para validar también clases de prueba)
    - `mvn test` (solo si el usuario te pide explícitamente pasar los tests)

## Definition of Done (DoD) de un cambio
Un cambio se considera completo cuando incluye:
- Lista de archivos modificados y razón de cada cambio.
- Manejo explícito de errores y validaciones de nulos/entradas.
- Tipado explícito (sin `any` en TypeScript ni `Object` genérico en Java).
- Verificación mínima (test unitario o pasos manuales reproducibles).
- Revisión de impacto en contrato API (`openapi.yaml`) y consumidor frontend, cuando aplique.

## Buenas Prácticas de Generación
- Al generar un nuevo componente o módulo, incluye un comentario breve al inicio explicando su propósito.
- Si una petición es ambigua, sugiere la mejor solución estándar.
- Añade siempre comentarios Javadoc en todos los métodos que los requieran, a excepción de los getters y setters.

# Mantenimiento de OpenAPI (openapi-copilot.yaml)
- SIEMPRE que crees o modifiques controladores REST, DTOs, endpoints o manejo de excepciones:
  - Genera o actualiza el archivo `<modulo-openapi>/src/main/resources/openapi-copilot.yaml` (esta es la ruta obligatoria y unica).
  - Convención recomendada en proyectos generados desde este arquetipo: `<artifactId>-openapi/src/main/resources/openapi-copilot.yaml`.
  - NO dependas de la salida de Springdoc ni intentes levantar el servicio para obtener el YAML.
  - El fichero `openapi-copilot.yaml` DEBE incluir de forma exhaustiva:
    1. Casos de éxito (200, 201, 204) con esquemas de respuesta completos.
    2. Casos de error habituales (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 500 Internal Server Error).
    3. Validación de campos (parámetros requeridos, formatos, regex, rangos numéricos y longitudes).
    4. Esquemas detallados tanto para el cuerpo de petición (`requestBody`) como para las respuestas de error estándar del proyecto (e.g. `ProblemDetail` o DTO de error).
  - Mantén el estándar OpenAPI 3.0 o 3.1 con sintaxis YAML válida.

## Plantilla mínima de prompt del equipo
```text
Contexto:
- Módulo objetivo: [api/model/ws/openapi/frontend]
- Objetivo funcional: [resultado esperado]

Restricciones:
- Mantener SOLID y responsabilidad única.
- Manejo explícito de errores.
- Sin nuevas librerías externas no aprobadas.
- Código en inglés; comentarios/Javadoc en castellano.

Aceptación:
- Archivos a modificar.
- Casos de error contemplados.
- Prueba mínima o pasos de validación.
```

## Política de excepciones
Si una regla de este documento no puede cumplirse, el registro del cambio debe incluir:
- Regla afectada.
- Justificación técnica.
- Alternativa aplicada.
- Riesgo e impacto esperado.

## Estructura del proyecto

### Raíz del repositorio
```
<project-root>/
├── <artifactId>-api/            ← Interfaces Java de los servicios (contratos)
├── <artifactId>-boot/           ← Arranque de Spring Boot (main, configuración)
├── <artifactId>-frontend/       ← Proyecto Angular
├── <artifactId>-model/          ← Entidades, DTOs, repositorios y servicios
├── <artifactId>-openapi/        ← Especificación OpenAPI (YAML) y generación de modelos
├── <artifactId>-ws/             ← Controladores REST (@RestController)
├── backlog/
├── scripts/
└── README.md
```

**Ejemplo de instancia concreta**:
- `<project-root>` = `skeleton-fullstack`
- `<artifactId>` = `skeletonfullstack`

### Módulo model (`<artifactId>-model`)
Paquete base recomendado: `<base.package>.model`

```
src/main/java/<base/package>/model/
├── entity/       ← Entidades JPA (@Entity)
├── dto/          ← Objetos de transferencia de datos
├── repository/   ← Acceso a datos con JPA (@Repository)
├── service/      ← Lógica de negocio (@Service)
└── exception/    ← Excepciones personalizadas y manejo de errores
```

### Módulo api (`<artifactId>-api`)
Paquete base recomendado: `<base.package>.api`

```
src/main/java/<base/package>/api/
└── service/      ← Interfaces de los servicios (contratos sin implementación)
```

### Módulo ws (`<artifactId>-ws`)
Paquete base recomendado: `<base.package>.ws`

```
src/main/java/<base/package>/ws/
└── controller/   ← Endpoints REST (@RestController)
```

### Módulo openapi (`<artifactId>-openapi`)
```
src/main/resources/
└── openapi.yaml  ← Especificación OpenAPI de la API REST
```

### Módulo boot (`<artifactId>-boot`)
Paquete base recomendado: `<base.package>`

```
src/main/
├── java/<base/package>/
│   └── <MainApplication>.java  ← Clase main (@SpringBootApplication)
└── resources/
    └── application.yml            ← Configuración global
```

### Módulo frontend (`<artifactId>-frontend`) (Angular)
```
src/app/
├── core/       ← Guards, interceptores HTTP, servicios de autenticación
├── shared/     ← Componentes, pipes y directivas reutilizables
├── layout/     ← Cabecera, menú lateral, footer (solo visibles en la zona privada)
├── auth/       ← Acceso público
│   ├── login/
│   └── register/
└── main/       ← Zona privada (requiere autenticación)
```
