# botiga-docker
## Resumen del proyecto

El proyecto consiste en **diseñar e implementar el backend de una tienda online** utilizando una base de datos NoSQL (MongoDB) ejecutada dentro de contenedores Docker. Se simula un entorno real donde los datos de productos, clientes y pedidos se almacenan y gestionan de forma no relacional.

El núcleo del proyecto es crear una estructura de base de datos funcional y persistente, accesible tanto mediante comandos directos como a través de una interfaz web (Mongo Express). Se definen modelos de datos para tres colecciones principales (productos, clientes y comandas), decidiendo en cada caso si usar embedding o referencias según el comportamiento esperado de los datos.

Además, se incorporan buenas prácticas de desarrollo profesional: uso de control de versiones (Git), documentación técnica completa (README), persistencia mediante volúmenes Docker, y orquestación de servicios con Docker Compose.

El proyecto no es solo una serie de ejercicios sueltos, sino un **sistema completo y reproducible** que cualquier desarrollador podría levantar en su máquina para estudiar o extender, demostrando competencias clave en bases de datos NoSQL, contenedores y optimización de consultas con índices.
