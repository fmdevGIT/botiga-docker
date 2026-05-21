# Botiga Docker

## Resumen del proyecto
El proyecto consiste en **diseñar e implementar el backend de una tienda online** utilizando una base de datos NoSQL (MongoDB) ejecutada dentro de contenedores Docker. Se simula un entorno real donde los datos de productos, clientes y pedidos se almacenan y gestionan de forma no relacional.

El núcleo del proyecto es crear una estructura de base de datos funcional y persistente, accesible tanto mediante comandos directos como a través de una interfaz web (Mongo Express). Se definen modelos de datos para tres colecciones principales (productos, clientes y comandas), decidiendo en cada caso si usar embedding o referencias según el comportamiento esperado de los datos.

Además, se incorporan buenas prácticas de desarrollo profesional: uso de control de versiones (Git), documentación técnica completa (README), persistencia mediante volúmenes Docker, y orquestación de servicios con Docker Compose.

El proyecto no es solo una serie de ejercicios sueltos, sino **un sistema completo y reproducible** que cualquier desarrollador podría levantar en su máquina para estudiar o extender, demostrando competencias clave en bases de datos NoSQL, contenedores y optimización de consultas con índices.

## Prerrequisitos
| Requisito | Versión mínima | Comprobación | Implementado |
|-|-|-|-|
| WSL | 2.0 | `wsl --list --verbose` | Debian 13 (WSL 2) |
| Docker | 20.10 o superior | `docker --version` | 29.4.3 |
| Docker Compose | V2 (integrados en Docker) | `docker compose version` | v5.1.3 |
| Git | 2.20 o superior | `git --version` | 2.47.3 |
| Navegador web | actualizado |||
| Editor de código (opcional) |	VS Code, etc. | `code --version` |VSCode 1.117.0 |
---


## Guia de desarrollo del proyecto




### 1. Configuracion del entorno de desarrollo
* **Checklist**
* [ ] **Creación de la estructura de carpetas en WSL** 
* [ ] **Configuración del SCV (GitHub)**
* [ ] **Instruccions d'instal·lació i posada en marxa**
* [ ] **Estructura de fitxers**
* [ ] **Comandes principals per operar l'entorn (com fer consultes i crear dades)**
* [ ] **Explicació dels volums i xarxes configurats**