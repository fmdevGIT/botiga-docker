# Práctica A5 P1.5 - BOTIGA-DOCKER-MONGODB

## Preguntas de la práctica

### Bloque 1

> Cual es la diferencia entre `docker run` y `docker compose up`?

La diferencia principal entre `docker run` y `docker compose up` radica en su propósito y funcionalidad.
`docker run` se utiliza para ejecutar un contenedor individualmente, mientras que `docker compose up` se emplea para iniciar y gestionar múltiples contenedores definidos en un archivo `docker-compose.yml`, facilitando la orquestación de aplicaciones complejas con múltiples servicios.

> Para que sirve la instrucción depends_on? Garantiza que el servicio dependiente esté completamente operativo?

La instrucción `depends_on` en Docker Compose se utiliza para definir dependencias entre servicios, indicando que un servicio debe iniciarse antes que otro. Sin embargo, `depends_on` no garantiza que el servicio dependiente esté completamente operativo; solo asegura que el contenedor se haya iniciado. Para garantizar la operatividad completa, es necesario implementar mecanismos adicionales, como scripts de espera o health checks.

>Explica cual es la diferencia entre una red bridge por defecto y una red personalizada (con nombre) en Docker Compose.

La diferencia entre una red bridge por defecto y una red personalizada (con nombre) en Docker Compose radica en la configuración y el aislamiento. La red bridge por defecto es creada automáticamente por Docker para cada contenedor, lo que puede llevar a conflictos de nombres y dificultades para gestionar la comunicación entre contenedores. En cambio, una red personalizada con nombre permite definir un espacio de nombres específico, facilitando la comunicación entre contenedores y proporcionando un mayor control sobre la configuración de la red, como la asignación de subredes y gateways.

---

### Bloque 2

#### 2.2 Prueba de persistencia

Demuestra que los volúmenes funcionan correctamente siguiendo estos pasos y documenta cada paso con una captura de pantalla:

* **Comprobamos que la base de datos existe**
![alt text](img/persistence1.png)

* **Tras reiniciar el container para que se apliquen los cambios con `docker compose down` y `docker compose up -d`**

![alt text](img/persistence2.png)

Comprobamos que la base de datos sigue existiendo tras el reinicio del contenedor, lo que confirma que los datos se han persistido correctamente gracias a los volúmenes definidos en el `docker-compose.yml`.

#### 2.3 Preguntas teóricas

> 1 - Qué pasaria si no definiesemos ningún volumen en el docker-compose.yml? Haz la prueba y documenta el resultado.

Si no definimos ningún volumen en el `docker-compose.yml`, el archivo de inicialización de la base de datos 'init.js' que tenemos en el directorio `mongo-init` de nuestro proyecto, no se ejecutará, y en el caso de que se ejecutase desde el propio contenedor, los datos generados se almacenarán dentro del sistema de archivos del contenedor. Esto significa que si el contenedor se detiene o se elimina, todos los datos almacenados en él se perderán. Para probar esto, podemos ejecutar un contenedor de MongoDB sin definir un volumen, crear una base de datos y luego eliminar el contenedor. Al volver a crear el contenedor, veremos que la base de datos y los datos creados anteriormente ya no están disponibles, confirmando que los datos se han perdido debido a la falta de un volumen persistente.

* **Eliminar la definicion de los volumenes en el docker-compose.yml**

```yaml
volumes:
      - ./data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
```
* **Recrear el contenedor, crear una base de datos y eliminar el contenedor**

```bash
docker compose down
docker compose up -d
```
![alt text](img/newDataBase.png)

Tras reiniciar el container para que se apliquen los cambios...
```bash
docker compose down
docker compose up -d
```
... comprobamos que la base de datos creada anteriormente ya no existe.

![alt text](image.png)

> 2 - Explica la diferencia entre un volumen y un bind mount. ¿Cuál es la mejor opción para cada caso?

Un volumen en Docker es un área de almacenamiento gestionada por Docker que se utiliza para persistir datos generados por y utilizados por los contenedores. Los volúmenes son independientes del ciclo de vida de los contenedores, lo que significa que los datos almacenados en un volumen no se eliminan cuando el contenedor se detiene o se elimina. 

Por otro lado, un bind mount es una forma de montar un directorio del host directamente en el contenedor. Esto permite que los cambios realizados en el directorio del host se reflejen inmediatamente en el contenedor y viceversa. La mejor opción para cada caso depende de la necesidad de persistencia y la facilidad de gestión: los volúmenes son ideales para datos que necesitan persistir más allá del ciclo de vida del contenedor, mientras que los bind mounts son útiles para desarrollo y pruebas donde se requiere acceso directo a los archivos del host.

> 3 - Explica la diferencia entre la estrategia embedding y la estrategia referencia con ejemplos. Es necesario que los ejemplos sean diferentes a los expuestos en este documento.

La estrategia de embedding en MongoDB implica almacenar documentos relacionados dentro de un mismo documento, lo que permite acceder a toda la información relacionada en una sola consulta. Por ejemplo, si tenemos una colección de "usuarios" y cada usuario tiene una lista de "direcciones", podríamos almacenar las direcciones como un array dentro del documento del usuario.
**ejemplo de embedding: Colección "usuarios"**

```json
{
  "_id": ObjectId("..."),
  "nombre": "Juan",
  "direcciones": [
    {
      "calle": "Calle 123",
      "ciudad": "Ciudad A"
    },
    {
      "calle": "Avenida 456",
      "ciudad": "Ciudad B"
    }
  ]
}
```
En cambio, la estrategia de referencia implica almacenar documentos relacionados en colecciones separadas y utilizar referencias (como ObjectId) para vincularlos. Siguiendo el mismo ejemplo, podríamos tener una colección de "usuarios" y otra colección de "direcciones", donde cada dirección tiene un campo que referencia al usuario al que pertenece.

**ejemplo de referencia:**

Colección "usuarios":
```json
{
  "_id": ObjectId("..."),
  "nombre": "Juan"
}
```
Colección "direcciones":
```json
{
  "_id": ObjectId("..."),
  "calle": "Calle 123",
  "ciudad": "Ciudad A",
  "usuario_id": ObjectId("...") // Referencia al usuario
}
```
La estrategia de embedding es más eficiente para consultas que requieren acceder a toda la información relacionada, mientras que la estrategia de referencia es más adecuada para relaciones más complejas o cuando los datos relacionados pueden crecer de manera independiente.

> 4 - Explica que estrategia o estrategias has utilizado en la colección pedidos y por qué.

En la colección de pedidos, he utilizado una combinación de estrategias de embedding y referencia. Para los detalles del pedido, como los productos incluidos, cantidades y precios, he optado por la estrategia de embedding, ya que estos datos están estrechamente relacionados con el pedido y se acceden con frecuencia juntos. Esto permite realizar consultas eficientes para obtener toda la información del pedido en una sola consulta.

Sin embargo, para la información del cliente asociado al pedido, he utilizado la estrategia de referencia, ya que los datos del cliente pueden ser compartidos entre múltiples pedidos y pueden crecer de manera independiente. Esto permite mantener una estructura de datos más flexible y evita la duplicación de información del cliente en cada pedido, facilitando la gestión y actualización de los datos del cliente sin afectar a los pedidos existentes.