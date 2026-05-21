# Botiga Dockermon

## Licencia

Proyecto académico para el módulo de Bases de Datos (0484) del INS Provençana.

Este `README.md` es un documento técnico completo, claro y ejemplificado que cualquier persona con conocimientos básicos de Docker y MongoDB podrá seguir para replicar el entorno sin problemas.

---

## Resumen del proyecto

El proyecto consiste en **diseñar e implementar el backend de una tienda online** utilizando una base de datos **NoSQL** (**MongoDB**) ejecutada dentro de un contenedor **Docker** orquestado con **Docker Compose**. Se simula un entorno real donde los datos de productos, clientes y pedidos se almacenan y gestionan de forma no relacional.

El núcleo del proyecto es **crear una estructura de base de datos funcional y persistente**, accesible tanto mediante comandos directos como a través de una interfaz web (**Mongo Express**). Se definen modelos de datos para tres colecciones principales (productos, clientes y pedidos), decidiendo en cada caso si usar *embedding* o referencias según el comportamiento esperado de los datos.

Además, se incorporan buenas prácticas de desarrollo profesional: uso de **control de versiones** (**Git**), documentación técnica completa, persistencia mediante volúmenes Docker, y orquestación de servicios con **Docker Compose**.

El proyecto no es solo una serie de ejercicios sueltos, sino **un sistema completo y reproducible** que cualquier desarrollador podría levantar en su máquina para estudiar o extender, demostrando competencias clave en bases de datos NoSQL, contenedores y optimización de consultas con índices.

---

## Requisitos previos

| Requisito | Versión mínima | Comprobación | Implementado |
|-----------|---------------|--------------|---------------|
| WSL | 2.0 | `wsl --list --verbose` | ✅ Debian 13 (WSL 2) |
| Docker | 20.10 o superior | `docker --version` | ✅ 29.4.3 |
| Docker Compose | V2 (integrado en Docker) | `docker compose version` | ✅ v5.1.3 |
| Git | 2.20 o superior | `git --version` | ✅ 2.47.3 |
| Navegador web | Actualizado | - | ✅ Chrome/Firefox/Edge |
| Editor de código (opcional) | VS Code, etc. | `code --version` | ✅ VS Code 1.117.0 |

---

## Estructura de ficheros

```
practica-mongodb/
├── docker-compose.yml          # Definición de los servicios
├── .env                        # Variables de entorno (creado manualmente)
├── .gitignore                  # Archivos ignorados por Git
├── mongo-init/
│   └── init.js                 # Script de inicialización de la BD
├── queries/
│   ├── crud.js                 # Operaciones CRUD
│   └── advanced.js             # Consultas avanzadas e índices
├── data/                       # Volumen de datos (auto-generado)
└── README.md                   # Documentación del proyecto
```

---

## Instrucciones de instalación y puesta en marcha

### Consideraciones previas

El servicio MongoDB requiere usuario y contraseña. Es buena práctica de seguridad no incluir credenciales en el código fuente. Docker proporciona una solución mediante el archivo `.env`, que contiene las variables de entorno sensibles que serán **inyectadas en los contenedores en tiempo de ejecución**.

Docker Compose detecta automáticamente el archivo `.env` si se encuentra en el mismo directorio que `docker-compose.yml`.

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/usuario/practica-mongodb.git
cd practica-mongodb
```

### Paso 2: Crear el archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
MONGO_USER=admin
MONGO_PASSWORD=admin123
```

> ⚠️ **Importante:** No subas este archivo al repositorio. Asegúrate de que `.env` está incluido en el `.gitignore`.

### Paso 3: Crear el archivo `.gitignore`

```
# Datos persistentes de MongoDB
data/

# Variables de entorno
.env
.env.local

# Archivos de sistema
.DS_Store
Thumbs.db
*.log

# Editor específico
.vscode/
.idea/
```

### Paso 4: Levantar los contenedores

```bash
docker compose up -d
```

### Paso 5: Verificar que los servicios están funcionando

```bash
docker compose ps
```

### Paso 6: Acceder a Mongo Express

Abre tu navegador y ve a: `http://localhost:8081`

Credenciales:
- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## Configuración de Docker Compose

### Servicio MongoDB

```yaml
mongodb:
  image: mongo:7.0
  container_name: mongodb-botiga
  restart: always
  ports:
    - "27017:27017"
  environment:
    MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
    MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
  volumes:
    - ./data:/data/db
    - ./mongo-init:/docker-entrypoint-initdb.d
  networks:
    - xarxa-botiga
```

### Servicio Mongo Express

```yaml
mongoexpress:
  image: mongo-express:1.0
  container_name: mongoexpress-botiga
  restart: unless-stopped
  depends_on:
    - mongodb
  ports:
    - "8081:8081"
  environment:
    ME_CONFIG_MONGODB_ADMINUSERNAME: ${MONGO_USER}
    ME_CONFIG_MONGODB_ADMINPASSWORD: ${MONGO_PASSWORD}
    ME_CONFIG_MONGODB_URL: mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb-botiga:27017/
    ME_CONFIG_BASICAUTH_USERNAME: ${MONGO_USER}
    ME_CONFIG_BASICAUTH_PASSWORD: ${MONGO_PASSWORD}
  networks:
    - xarxa-botiga
```

### Red personalizada

```yaml
networks:
  xarxa-botiga:
    driver: bridge
```

### Archivo docker-compose.yml completo

```yaml
services:
  mongodb:
    image: mongo:7.0
    container_name: mongodb-botiga
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - ./data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
      - ./queries:/queries
    networks:
      - xarxa-botiga

  mongoexpress:
    image: mongo-express:1.0
    container_name: mongoexpress-botiga
    restart: unless-stopped
    depends_on:
      - mongodb
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${MONGO_USER}
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${MONGO_PASSWORD}
      ME_CONFIG_MONGODB_URL: mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb-botiga:27017/
      ME_CONFIG_BASICAUTH_USERNAME: ${MONGO_USER}
      ME_CONFIG_BASICAUTH_PASSWORD: ${MONGO_PASSWORD}
    networks:
      - xarxa-botiga

networks:
  xarxa-botiga:
    driver: bridge
```

---

## Volúmenes y persistencia

| Volumen | Propósito |
|---------|-----------|
| `./data:/data/db` | Persistencia de los datos de MongoDB en el sistema host |
| `./mongo-init:/docker-entrypoint-initdb.d` | Scripts de inicialización que se ejecutan al primer arranque |
| `./queries:/queries` | Acceso a los scripts de consultas CRUD y avanzadas |

---

## Comandos principales para operar el entorno

### Gestión de contenedores

| Comando | Descripción |
|---------|-------------|
| `docker compose up -d` | Iniciar los servicios en segundo plano |
| `docker compose down` | Detener y eliminar los contenedores |
| `docker compose down -v` | Detener y eliminar contenedores incluyendo volúmenes |
| `docker compose ps` | Ver el estado de los servicios |
| `docker compose logs -f` | Ver logs en tiempo real |
| `docker compose logs mongodb` | Ver logs solo de MongoDB |
| `docker compose logs mongoexpress` | Ver logs solo de Mongo Express |
| `docker compose restart` | Reiniciar los servicios |

### Acceso a MongoDB

```bash
docker exec -it mongodb-botiga mongosh -u admin -p admin123 --authenticationDatabase admin
```

Dentro de MongoDB Shell:
```
use botiga
show collections
db.productes.find()
```

### Ejecutar scripts de consultas

```bash
docker exec -it mongodb-botiga mongosh -u admin -p admin123 --authenticationDatabase admin --file /queries/crud.js

docker exec -it mongodb-botiga mongosh -u admin -p admin123 --authenticationDatabase admin --file /queries/advanced.js
```

---

## Modelo de datos

### Estrategia de modelado

| Colección | Estrategia | Justificación |
|-----------|------------|----------------|
| **productes** | Independiente | Los productos son entidades autónomas |
| **clients** | Referencia | Un cliente puede tener muchos pedidos |
| **comandes** | Embedding + Referencia | Snapshot de precios + referencia al cliente |

### Estructura de las colecciones

**Colección productes:**

```
{
  nom: String,
  preu: Number,
  categoria: String,
  estoc: Number,
  valoracio: Number,
  actiu: Boolean,
  etiquetes: [String],
  creat_el: Date
}
```

**Colección clients:**

```
{
  nom: String,
  email: String,
  telefon: String,
  adreca: { carrer: String, ciutat: String },
  data_registre: Date,
  actiu: Boolean
}
```

**Colección comandes:**

```
{
  client_id: ObjectId,
  data_comanda: Date,
  estat: String,
  productes: [
    {
      producte_id: ObjectId,
      nom: String,
      preu: Number,
      quantitat: Number
    }
  ],
  subtotal: Number,
  total: Number,
  metode_pagament: String
}
```

---

## Índices creados para optimización

| Colección | Índice | Tipo | Justificación |
|-----------|--------|------|----------------|
| productes | `nom` | Ascendente | Búsquedas por nombre |
| productes | `categoria` | Ascendente | Filtrado por categoría |
| clients | `email` | Único | Evitar emails duplicados |
| comandes | `client_id` | Ascendente | Obtener pedidos de un cliente |
| comandes | `data_comanda` | Descendente | Ordenar por fecha |

---
