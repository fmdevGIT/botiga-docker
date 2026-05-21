# Botiga Dockermon

## Resumen del proyecto

El proyecto consiste en **diseñar e implementar el backend de una tienda online** utilizando una base de datos **NoSQL** (**MongoDB**) ejecutada dentro de un contenedor **Docker** orquestado con **Docker Compose**. Se simula un entorno real donde los datos de productos, clientes y pedidos se almacenan y gestionan de forma no relacional.

El núcleo del proyecto es **crear una estructura de base de datos funcional y persistente**, accesible tanto mediante comandos directos como a través de una interfaz web (**Mongo Express**). Se definen modelos de datos para tres colecciones principales (productos, clientes y comandas), decidiendo en cada caso si usar embedding o referencias según el comportamiento esperado de los datos.

Además, se incorporan buenas prácticas de desarrollo profesional: uso de **control de versiones**  (**Git**), documentación técnica completa (Software Design Document -> **README.md**), persistencia mediante volúmenes Docker, y orquestación de servicios con **Docker Compose**.

El proyecto no es solo una serie de ejercicios sueltos, sino **un sistema completo y reproducible** que cualquier desarrollador podría levantar en su máquina para estudiar o extender, demostrando competencias clave en bases de datos NoSQL, contenedores y optimización de consultas con índices.

## Prerrequisitos

## Requisitos previos

| Requisito                   | Versión mínima           | Comprobación             | Implementado          |
| --------------------------- | ------------------------ | ------------------------ | --------------------- |
| WSL                         | 2.0                      | `wsl --list --verbose`   | ✅ Debian 13 (WSL 2)   |
| Docker                      | 20.10 o superior         | `docker --version`       | ✅ 29.4.3              |
| Docker Compose              | V2 (integrado en Docker) | `docker compose version` | ✅ v5.1.3              |
| Git                         | 2.20 o superior          | `git --version`          | ✅ 2.47.3              |
| Navegador web               | Actualizado              | -                        | ✅ Chrome/Firefox/Edge |
| Editor de código (opcional) | VS Code, etc.            | `code --version`         | ✅ VS Code 1.117.0     |

---

## Análisis transaccional sobre el stack tecnológico del proyecto

MongoDB nos aporta un sistema de almacenamiento **flexible y sin esquema fijo**, lo que significa que podemos añadir campos a los documentos de productos, clientes o pedidos sin necesidad de ejecutar costosas y complejas migraciones. Cada pedido puede tener una estructura ligeramente diferente según su estado o tipo de pago, algo muy útil en un entorno de comercio electrónico cambiante.

Por otro lado, a diferencia de una base de datos SQL tradicional (como PostgreSQL o MySQL), MongoDB **no ofrece integridad referencial automática** (no hay claves foráneas que relacionen tablas), y las transacciones multi-colección son más limitadas y con mayor overhead. En una tienda online SQL, si eliminamos un cliente, la base de datos podría rechazar la operación si tiene pedidos asociados; en MongoDB, esa lógica debemos implementarla explícitamente en nuestra aplicación.

En cuanto a la "dockerización": nos permite empaquetar toda la pila tecnológica (backend + MongoDB) en contenedores portátiles y reproducibles, garantizando que el entorno de desarrollo, **pruebas y producción sea idéntico**. El compromiso aquí es un mínimo overhead de rendimiento y la necesidad de **gestionar volúmenes** de forma consciente para no perder datos al recrear contenedores.

Esta combinación (Docker + MongoDB) es ideal para entornos de desarrollo ágil y prototipado rápido, aunque en producción a gran escala requeriría configuraciones adicionales como clústeres de MongoDB y orquestadores más potentes como Kubernetes.

![](docs/img/BotigaDockerPoster.jpg)

## Software Design Document (SDD)

**Checklist del Proyecto**

- [x] **Configuración del SCV (GitHub)**
- [x] **Creación de la estructura de carpetas en WSL**
- [ ] **Instalación y configuración de Docker y Compose**
- [ ] **Instrucciones de instalación y puesta en marcha**
- [ ] **Estructura de ficheros**
- [ ] **Comandos principales para operar el entorno (como hacer consultas y crear datos)**
- [ ] **Explicación de los volúmenes i redes configuradas**

### Bloque 0

#### Configuracion del SCV en la nube

La configuración del Sistema de Control de Versiones (GitHub) al inicio es una buena práctica, ya que permite establecer una **línea base** del proyecto, garantizar la **trazabilidad de los cambios** (histórico) y facilitar la **colaboración** desde el inicio del desarrollo.

Para poder utilizar Git, es necesario instalarlo en el sistema y configurarlo con el nombre de usuario y correo electrónico correspondiente.

```bash
# Antes de instalar Git, comprobaremos si ya lo tenemos instalado
git --version

# Comando de instalacion de Git
sudo apt update # -> Actualizamos el repositorio apt
sudo apt install git

# Una vez comprobada la instalacion de Git, crearemos un repositorio en la nube (GitHub)
# y lo clonaremos en nuestro Git local.

sudo git clone https://github.com/<usuario>/<nombre_del_repositorio>
```

#### Creación de la estructura de carpetas en WSL

Crearemos la siguiente estructura de carpetas para albergar nuestro proyecto.

```
practica-mongodb/
├── docker-compose.yml # Definició dels serveis
├── mongo-init/
│ └── init.js # Script d'inicialització
├── queries/
│ ├── crud.js # Operacions CRUD
│ └── advanced.js # Consultes avançades
├── data/ # Volum de dades (auto-generat)
└── README.md # Documentació del projecte
```

Podemos utilizar el siguiente script:

```bash
#!/bin/bash

# Nombre del directorio principal
MAIN_DIR="practica-mongodb"

echo "Creando estructura de carpetas para: ${MAIN_DIR}"

# Crear directorio principal
mkdir -p "$MAIN_DIR"

# Crear subdirectorios
mkdir -p "$MAIN_DIR/mongo-init"
mkdir -p "$MAIN_DIR/queries"
mkdir -p "$MAIN_DIR/data"

# Crear archivos vacíos
touch "$MAIN_DIR/docker-compose.yml"
touch "$MAIN_DIR/mongo-init/init.js"
touch "$MAIN_DIR/queries/crud.js"
touch "$MAIN_DIR/queries/advanced.js"
touch "$MAIN_DIR/README.md"

echo "Estructura creada correctamente:"
echo "practica-mongodb/"
echo "├── docker-compose.yml"
echo "├── mongo-init/"
echo "│   └── init.js"
echo "├── queries/"
echo "│   ├── crud.js"
echo "│   └── advanced.js"
echo "├── data/"
echo "└── README.md"
```

Podemos ejecutarlo con:

```bash
chmod +x crear_estructura.sh #-> Asignar permisos de ejecución
./crear_estructura.sh
```

### Bloque 1

#### Instrucciones de instalación y puesta en marcha

**Consideraciones previas**
El servicio MongoDB requiere usuario y contraseña y es buena práctica de seguridad no incluirlos en el código fuente. Docker proporciona una solución para dicho problema al construir los contenedores rearemos el archivo `.env`

Este archivo contiene las variables de entorno sensibles o importantes, tales como contraseñas, rutas, etc..., que serán **inyectadas en los contenedores en tiempo de ejecución**, sin necesidad de hardcodearlas en el `docker-compose.yml` o en los scripts de inicialización.

Este archivo `.env` es detectado por docker compose automaticamente si ambos archivos se encuentran en la misma carpeta. En nuestro caso, el archivo `.env` se encuentra en la raíz del proyecto, junto al `docker-compose.yml`, lo que permite que las variables definidas en el `.env` sean accesibles para los servicios definidos en el `docker-compose.yml`.

*En nuestra práctica:**

```bash
MONGO_USER=admin
MONGO_PASSWORD=admin1234
```
Para evitar que el archivo `.env` sea subido al repositorio y su contenido sea accesible, lo añadiremos al `.gitignore`

##### MongoDB
Configuración del servicio MongoDB en el `docker-compose.yml` (*partial*):
```yaml
version: '3.8'

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
    networks:
      - xarxa-botiga
```
#### Mongo Express
Configuración del servicio Mongo Express en el `docker-compose.yml` (*partial*):
```yaml
  mongo-express:
    image: mongo-express:1.0
    container_name: mongo-express-botiga
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${MONGO_USER}
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${MONGO_PASSWORD}
      ME_CONFIG_MONGODB_SERVER: mongodb
    depends_on:
      - mongodb
    networks:
      - xarxa-botiga
```

---

### Bloque 2 – Modelo de datos, volúmenes y persistencia de datos

En esta práctica crearemos la estructura de datos necesaria para gestionar una tienda online.

#### 2.1 Script de inicialización

El script `mongo-init/init.js` se ejecuta automáticamente cuando el contenedor de MongoDB se inicia por primera vez. Este script es responsable de crear la base de datos `botiga`, sus colecciones y poblarlas con datos iniciales.

##### Estrategia de modelado: Embedding vs Referencia

Para el diseño de las colecciones, hemos adoptado la siguiente estrategia:

| Colección | Estrategia | Justificación |
|-----------|------------|----------------|
| **productes** | Independiente | Los productos son entidades autónomas que se modifican independientemente de los pedidos. |
| **clients** | **Referencia** | Un cliente puede tener muchos pedidos a lo largo del tiempo. Usar referencia evita duplicar la información del cliente en cada pedido y facilita la actualización de los datos del cliente. |
| **comandes** | **Embedding** + Referencia | Almacenamos los productos dentro de cada pedido (embedding) para mantener un snapshot del precio en el momento de la compra. El cliente se referencia mediante `client_id` para evitar duplicar datos del cliente. |

##### Estructura de las colecciones

**Colección `productes`:**

```javascript
{
  nom: String,           // Nombre del producto
  preu: Number,          // Precio en euros (decimal)
  categoria: String,     // 'electrònica', 'roba', 'llar', 'esport'...
  estoc: Number,         // Unidades disponibles
  valoracio: Number,     // De 1.0 a 5.0
  actiu: Boolean,        // Si el producto está disponible para la venta
  etiquetes: [String],   // Array de etiquetas
  creat_el: Date         // Fecha de creación
}
```

**Colección `clients` (modelo por referencia):**

```javascript
{
  nom: String,           // Nombre completo del cliente
  email: String,         // Correo electrónico (único)
  telefon: String,       // Número de teléfono
  adreca: {              // Dirección completa (embedding)
    carrer: String,
    ciutat: String
  },
  data_registre: Date,   // Fecha de registro
  actiu: Boolean         // Si el cliente está activo
}
```

**Colección `comandes` (modelo mixto: embedding de productos + referencia a cliente):**

```javascript
{
  client_id: ObjectId,   // Referencia al cliente (ObjectId)
  data_comanda: Date,    // Fecha del pedido
  estat: String,         // 'pendent', 'processant', 'enviat', 'lliurat', 'cancel·lat'
  productes: [{          // Array de productos (embedding)
    producte_id: ObjectId,
    nom: String,
    preu: Number,
    quantitat: Number
  }],
  subtotal: Number,      // Suma de precios sin impuestos
  total: Number,         // Total a pagar
  metode_pagament: String // 'targeta', 'paypal', 'transferència'
}
```

##### Script de inicialización completo

El script `init.js` completo realiza las siguientes operaciones:

1. **Crea la base de datos `botiga`** y sus colecciones (`productes`, `clients`, `comandes`)
2. **Crea índices** para optimizar las consultas más frecuentes
3. **Inserta 10 documentos** en la colección `productes`
4. **Inserta 10 documentos** en la colección `clients`
5. **Inserta 10 documentos** en la colección `comandes`

```javascript
// =====================================================
// CREAR BASE DE DATOS BOTIGA Y COLECCIONES
// =====================================================

// Cambiar a la base de datos botiga
db = db.getSiblingDB('botiga');

// Crear colecciones
db.createCollection('productes');
db.createCollection('clients');
db.createCollection('comandes');

// Crear índices para optimizar consultas
db.productes.createIndex({ nom: 1 });
db.productes.createIndex({ categoria: 1 });
db.clients.createIndex({ email: 1 }, { unique: true });
db.comandes.createIndex({ client_id: 1 });
db.comandes.createIndex({ data_comanda: -1 });

// =====================================================
// INSERTAR PRODUCTES (10 documentos)
// =====================================================
db.productes.insertMany([
  { nom: "iPhone 15 Pro", preu: 1199.99, categoria: "electrònica", estoc: 25, valoracio: 4.8, actiu: true, etiquetes: ["smartphone", "apple", "5g"], creat_el: new Date("2024-01-15") },
  { nom: "Samsung Galaxy S24", preu: 1099.99, categoria: "electrònica", estoc: 30, valoracio: 4.6, actiu: true, etiquetes: ["smartphone", "android", "5g"], creat_el: new Date("2024-01-20") },
  { nom: "Nike Air Max", preu: 129.99, categoria: "roba", estoc: 50, valoracio: 4.7, actiu: true, etiquetes: ["zapatilles", "esport"], creat_el: new Date("2024-02-01") },
  { nom: "Samsung 4K TV 55\"", preu: 699.99, categoria: "electrònica", estoc: 12, valoracio: 4.5, actiu: true, etiquetes: ["televisió", "4k"], creat_el: new Date("2024-01-10") },
  { nom: "Joc de llençols 150x200", preu: 39.99, categoria: "llar", estoc: 100, valoracio: 4.3, actiu: true, etiquetes: ["llençols", "dormitori"], creat_el: new Date("2024-02-10") },
  { nom: "Pilota de bàsquet", preu: 24.99, categoria: "esport", estoc: 75, valoracio: 4.6, actiu: true, etiquetes: ["basquet", "pilota"], creat_el: new Date("2024-02-15") },
  { nom: "Nordic Ware Paella", preu: 49.99, categoria: "llar", estoc: 40, valoracio: 4.4, actiu: true, etiquetes: ["paella", "cuina"], creat_el: new Date("2024-02-20") },
  { nom: "Jaqueta de muntanya", preu: 89.99, categoria: "roba", estoc: 35, valoracio: 4.9, actiu: true, etiquetes: ["jaqueta", "muntanya"], creat_el: new Date("2024-03-01") },
  { nom: "AirPods Pro", preu: 249.99, categoria: "electrònica", estoc: 45, valoracio: 4.8, actiu: true, etiquetes: ["auriculars", "wireless"], creat_el: new Date("2024-01-25") },
  { nom: "Màquina de cafè", preu: 79.99, categoria: "llar", estoc: 20, valoracio: 4.5, actiu: true, etiquetes: ["cafè", "electrodomèstic"], creat_el: new Date("2023-12-01") }
]);

// =====================================================
// INSERTAR CLIENTS (10 documentos)
// =====================================================
db.clients.insertMany([
  { nom: "Joan Garcia", email: "joan.garcia@email.com", telefon: "654123456", adreca: { carrer: "Carrer Major 15", ciutat: "Barcelona" }, data_registre: new Date("2024-01-10"), actiu: true },
  { nom: "Maria López", email: "maria.lopez@email.com", telefon: "654234567", adreca: { carrer: "Avinguda Diagonal 234", ciutat: "Barcelona" }, data_registre: new Date("2024-01-12"), actiu: true },
  { nom: "Pere Martínez", email: "pere.martinez@email.com", telefon: "654345678", adreca: { carrer: "Carrer Colom 8", ciutat: "València" }, data_registre: new Date("2024-01-15"), actiu: true },
  { nom: "Anna Puig", email: "anna.puig@email.com", telefon: "654456789", adreca: { carrer: "Carrer Sants 123", ciutat: "Barcelona" }, data_registre: new Date("2024-01-18"), actiu: true },
  { nom: "Carles Roca", email: "carles.roca@email.com", telefon: "654567890", adreca: { carrer: "Gran Via 567", ciutat: "Madrid" }, data_registre: new Date("2024-01-20"), actiu: true },
  { nom: "Laura Ferrer", email: "laura.ferrer@email.com", telefon: "654678901", adreca: { carrer: "Carrer la Pau 42", ciutat: "València" }, data_registre: new Date("2024-01-22"), actiu: true },
  { nom: "Jordi Soler", email: "jordi.soler@email.com", telefon: "654789012", adreca: { carrer: "Rambla Catalunya 89", ciutat: "Barcelona" }, data_registre: new Date("2024-01-25"), actiu: false },
  { nom: "Marta Vila", email: "marta.vila@email.com", telefon: "654890123", adreca: { carrer: "Carrer del Mar 21", ciutat: "Tarragona" }, data_registre: new Date("2024-01-28"), actiu: true },
  { nom: "Albert Font", email: "albert.font@email.com", telefon: "654901234", adreca: { carrer: "Avinguda País Valencià 33", ciutat: "Alacant" }, data_registre: new Date("2024-02-01"), actiu: true },
  { nom: "Cristina Duran", email: "cristina.duran@email.com", telefon: "654012345", adreca: { carrer: "Passeig de Gràcia 101", ciutat: "Barcelona" }, data_registre: new Date("2024-02-05"), actiu: true }
]);

// Obtener IDs para los pedidos
const clientsList = db.clients.find().toArray();
const productesList = db.productes.find().toArray();

// =====================================================
// INSERTAR COMANDES (10 documentos)
// =====================================================
db.comandes.insertMany([
  { client_id: clientsList[0]._id, data_comanda: new Date("2024-02-01"), estat: "lliurat", productes: [{ producte_id: productesList[0]._id, nom: productesList[0].nom, preu: productesList[0].preu, quantitat: 1 }], subtotal: productesList[0].preu, total: productesList[0].preu, metode_pagament: "targeta" },
  { client_id: clientsList[1]._id, data_comanda: new Date("2024-02-05"), estat: "lliurat", productes: [{ producte_id: productesList[2]._id, nom: productesList[2].nom, preu: productesList[2].preu, quantitat: 2 }], subtotal: productesList[2].preu * 2, total: productesList[2].preu * 2, metode_pagament: "paypal" },
  { client_id: clientsList[2]._id, data_comanda: new Date("2024-02-10"), estat: "processant", productes: [{ producte_id: productesList[1]._id, nom: productesList[1].nom, preu: productesList[1].preu, quantitat: 1 }], subtotal: productesList[1].preu, total: productesList[1].preu, metode_pagament: "targeta" },
  { client_id: clientsList[3]._id, data_comanda: new Date("2024-02-12"), estat: "lliurat", productes: [{ producte_id: productesList[3]._id, nom: productesList[3].nom, preu: productesList[3].preu, quantitat: 1 }], subtotal: productesList[3].preu, total: productesList[3].preu, metode_pagament: "transferència" },
  { client_id: clientsList[4]._id, data_comanda: new Date("2024-02-15"), estat: "enviat", productes: [{ producte_id: productesList[4]._id, nom: productesList[4].nom, preu: productesList[4].preu, quantitat: 3 }], subtotal: productesList[4].preu * 3, total: productesList[4].preu * 3, metode_pagament: "targeta" },
  { client_id: clientsList[5]._id, data_comanda: new Date("2024-02-18"), estat: "pendent", productes: [{ producte_id: productesList[5]._id, nom: productesList[5].nom, preu: productesList[5].preu, quantitat: 1 }], subtotal: productesList[5].preu, total: productesList[5].preu, metode_pagament: "paypal" },
  { client_id: clientsList[6]._id, data_comanda: new Date("2024-02-20"), estat: "cancel·lat", productes: [{ producte_id: productesList[6]._id, nom: productesList[6].nom, preu: productesList[6].preu, quantitat: 1 }], subtotal: productesList[6].preu, total: productesList[6].preu, metode_pagament: "targeta" },
  { client_id: clientsList[7]._id, data_comanda: new Date("2024-02-22"), estat: "lliurat", productes: [{ producte_id: productesList[7]._id, nom: productesList[7].nom, preu: productesList[7].preu, quantitat: 2 }], subtotal: productesList[7].preu * 2, total: productesList[7].preu * 2, metode_pagament: "transferència" },
  { client_id: clientsList[8]._id, data_comanda: new Date("2024-02-25"), estat: "enviat", productes: [{ producte_id: productesList[8]._id, nom: productesList[8].nom, preu: productesList[8].preu, quantitat: 1 }], subtotal: productesList[8].preu, total: productesList[8].preu, metode_pagament: "paypal" },
  { client_id: clientsList[9]._id, data_comanda: new Date("2024-02-28"), estat: "pendent", productes: [{ producte_id: productesList[9]._id, nom: productesList[9].nom, preu: productesList[9].preu, quantitat: 1 }], subtotal: productesList[9].preu, total: productesList[9].preu, metode_pagament: "targeta" }
]);

print("✅ Base de dades 'botiga' inicialitzada correctament!");
print("📊 Col·leccions creades:");
print(`   - productes: ${db.productes.countDocuments()} documents`);
print(`   - clients: ${db.clients.countDocuments()} documents`);
print(`   - comandes: ${db.comandes.countDocuments()} documents`);
```

##### Índices creados para optimización

| Colección | Índice | Tipo | Justificación |
|-----------|--------|------|----------------|
| productes | `nom` | Ascendente | Búsquedas de productos por nombre |
| productes | `categoria` | Ascendente | Filtrado por categoría |
| clients | `email` | Único | Evitar emails duplicados y búsquedas rápidas |
| comandes | `client_id` | Ascendente | Obtener pedidos de un cliente específico |
| comandes | `data_comanda` | Descendente | Ordenar pedidos por fecha (más recientes primero) |

#### 2.2 Volúmenes y persistencia

Docker Compose utiliza **volúmenes** para garantizar que los datos de MongoDB persistan incluso después de detener o eliminar los contenedores.

```yaml
volumes:
  - ./data:/data/db                    # Persistencia de datos de MongoDB
  - ./mongo-init:/docker-entrypoint-initdb.d  # Scripts de inicialización
```

| Volumen | Propósito |
|---------|-----------|
| `./data:/data/db` | Almacena los datos de MongoDB en el sistema host. La carpeta `data/` se crea automáticamente en el proyecto. |
| `./mongo-init:/docker-entrypoint-initdb.d` | Monta la carpeta con scripts `.js` que se ejecutan en la primera inicialización del contenedor. |

#### 2.3 Redes

Se ha creado una red personalizada llamada `xarxa-botiga` para que los contenedores puedan comunicarse entre sí de forma aislada:

```yaml
networks:
  xarxa-botiga:
    driver: bridge
```

```yaml
networks:
  - xarxa-botiga
```

| Característica | Descripción |
|----------------|-------------|
| **Driver** | `bridge` - Red aislada para contenedores en el mismo host |
| **Comunicación** | Los contenedores se comunican por nombre de servicio (`mongodb-botiga`, `mongoexpress-botiga`) |
| **Aislamiento** | La red está aislada de otras redes Docker |

---