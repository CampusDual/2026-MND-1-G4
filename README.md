# cd2026mnd1g4 (guía rápida)

Este proyecto es una base completa con **backend Java (Spring Boot)**, **frontend Angular** y **base de datos**.  
La idea es que puedas arrancarlo, probarlo y entender la estructura sin necesitar experiencia avanzada.


- Iniciar sesión desde frontend.
- Consumir una API REST de usuarios (`/api/users`).
- Probar endpoints desde Swagger.
- Trabajar con 3 modos de ejecución del backend: `v`, `p`, `sp`.
- Usar una base en memoria, una base local persistente o PostgreSQL.


| Módulo/carpeta | Qué contiene |
|---|---|
| `cd2026mnd1g4-api` | Contratos: DTOs e interfaces de servicio (qué se expone). |
| `cd2026mnd1g4-model` | Lógica de negocio, entidades JPA y repositorios (cómo se guarda y valida). |
| `cd2026mnd1g4-ws` | Controladores REST y seguridad (endpoints HTTP y control de acceso). |
| `cd2026mnd1g4-openapi` | Especificación OpenAPI (`openapi.yaml` y `openapi-copilot.yaml`). |
| `cd2026mnd1g4-boot` | Arranque Spring Boot, configuración por perfiles y migraciones de base de datos. |
| `cd2026mnd1g4-frontend` | Aplicación Angular (login + pantalla privada + llamadas al backend). |
| `.run` | Lanzadores preparados para IntelliJ (`V`, `P`, `SP` y `DB`). |
| `.github/copilot-instructions.md` | Reglas del proyecto para asistente/copilot (fuente de verdad). |


Estas son las versiones que se utilizaron en este proyecto:

| Herramienta | Versión |
|---|---|
| Node.js | `23.6.0` |
| npm | `10.9.2` |
| Maven | `3.9.10` |
| Java | `25.0.4.1` (Eclipse Adoptium) |
| Angular CLI | `19.2.27` |

> Importante sobre Node.js: Angular CLI marca `23.6.0` como **Unsupported**, por no ser una versión LTS.


- Usa base **en memoria** (no guarda datos al cerrar).
- Es el más simple para practicar.

**En IntelliJ**
1. Ejecuta `V - cd2026mnd1g4Application`.

**Alternativa Maven**
```bash
mvn -pl cd2026mnd1g4-boot spring-boot:run -Dspring-boot.run.profiles=v
```

---

- Usa HSQLDB en archivo local (`.local/hsqldb/appdb`), así los datos **se conservan**.
- Necesita **arrancar la base de datos antes** que el backend.
- Puedes consultar la BD desde la consola H2 del navegador, pero para trabajo más cómodo normalmente también se usan clientes externos como **DBeaver**.

**En IntelliJ (orden obligatorio)**
1. Ejecuta `DB - HSQLDB Server`.
2. Ejecuta `P - cd2026mnd1g4Application`.

**Alternativa Maven (dos terminales)**
Terminal 1 (BD):
```bash
mvn -pl cd2026mnd1g4-boot -Prun_database validate exec:java
```
Terminal 2 (backend):
```bash
mvn -pl cd2026mnd1g4-boot -Prun_app_p spring-boot:run
```

---

- Usa PostgreSQL en `localhost:5432`, base `appdb`.
**En IntelliJ**
1. Asegúrate de tener PostgreSQL levantado con esa base.
2. Ejecuta `SP - cd2026mnd1g4Application`.

**Alternativa Maven**
```bash
mvn -pl cd2026mnd1g4-boot spring-boot:run -Dspring-boot.run.profiles=sp
```


| Uso | URL |
|---|---|
| Backend (base) | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| OpenAPI automática | `http://localhost:8080/v3/api-docs` |
| OpenAPI Copilot (manual) | `http://localhost:8080/openapi-copilot.yaml` |
| Consola H2 (navegador) | `http://localhost:8080/h2-console` |

> La consola web de BD incluida en el proyecto es la de H2 (`/h2-console`) y funciona bien para pruebas rápidas.  
> Aun así, para consultas más largas, filtros, exportaciones y manejo avanzado, lo habitual es usar un cliente externo.
> - En modo `p` (HSQLDB persistente): Suele resultar más práctico usar herramientas externas como **DBeaver**.
> - En modo `sp` (PostgreSQL): Normalmente se utiliza **pgAdmin** o **DBeaver**.


Abre una terminal en `cd2026mnd1g4-frontend` y ejecuta:

```bash
npm install
npm start
```

Luego abre:

```text
http://localhost:4200
```

Notas útiles:
- El frontend tiene proxy configurado: las llamadas a `/api` se redirigen a `http://localhost:8080`.
- Si backend no está levantado, el login mostrará error de conexión.


En el arranque se crea un usuario admin:
- usuario: `admin`
- contraseña: `admin1234`


1. Arranca backend en modo `v`.
2. Arranca frontend (`npm start`).
3. Entra en `http://localhost:4200` con `admin / admin1234`.
4. Revisa Swagger en `http://localhost:8080/swagger-ui/index.html`.


En la raíz del proyecto:

```bash
mvn compile
mvn test-compile
```


El proyecto incluye reglas específicas en:

```text
.github/copilot-instructions.md
```

Ahí se define, entre otras cosas:
- estructura esperada de módulos
- convenciones de código/documentación
- cómo mantener los ficheros de openapi
- reglas de ejecución en terminal para el equipo
