// =====================================================
// CREAR BASE DE DATOS BOTIGA Y COLECCIONES
// =====================================================

// Cambiar a la base de datos botiga
db = db.getSiblingDB('botiga');

// Crear col·leccions
db.createCollection('productes');
db.createCollection('clients');
db.createCollection('comandes');

// Crear índexos
db.productes.createIndex({ nom: 1 });
db.productes.createIndex({ categoria: 1 });
db.clients.createIndex({ email: 1 }, { unique: true });
db.comandes.createIndex({ client_id: 1 });
db.comandes.createIndex({ data_comanda: -1 });

// =====================================================
// INSERTAR PRODUCTES (10 documents)
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
// INSERTAR CLIENTS (10 documents)
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

// Obtener IDs para las comandes
const clientsList = db.clients.find().toArray();
const productesList = db.productes.find().toArray();

// =====================================================
// INSERTAR COMANDES (10 documents)
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