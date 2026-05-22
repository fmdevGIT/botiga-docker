// =====================================================
// BOTIGA DOCKERMON - CONSULTES AVANÇADES I ÍNDEXS (CORREGIT)
// =====================================================

db = db.getSiblingDB('botiga');

print("==========================================");
print("CONSULTES AVANÇADES I ÍNDEXS");
print("==========================================\n");

// =====================================================
// PREPARACIÓ DE DADES
// =====================================================
if (db.productos.countDocuments() === 0) {
  print("⚠️ La col·lecció 'productos' està buida. S'inseriran productes de demostració.\n");
  db.productos.insertMany([
    { nombre: "Smartwatch X100", precio: 149.99, categoria: "electrónica", stock: 30, valoracion: 4.5, activo: true, etiquetas: ["smartwatch", "wearable"] },
    { nombre: "Auriculares Bluetooth", precio: 29.99, categoria: "electrónica", stock: 100, valoracion: 4.2, activo: true, etiquetas: ["auriculares", "bluetooth"] },
    { nombre: "Funda móvil universal", precio: 9.99, categoria: "accesoris", stock: 200, valoracion: 3.8, activo: true, etiquetas: ["funda", "móvil"] },
    { nombre: "Càrrega ràpida USB-C", precio: 15.99, categoria: "electrónica", stock: 50, valoracion: 4.7, activo: true, etiquetas: ["carregador", "usb-c"] },
    { nombre: "Oferta: Cable USB-C 2m", precio: 2.99, categoria: "ofertas", stock: 500, valoracion: 4.0, activo: true, etiquetas: ["cable", "oferta"] },
    { nombre: "Telèfon intel·ligent Z5", precio: 399.99, categoria: "electrónica", stock: 15, valoracion: 4.8, activo: true, etiquetas: ["smartphone"] },
    { nombre: "Oferta: Funda + protector", precio: 12.99, categoria: "ofertas", stock: 0, valoracion: 3.5, activo: false, etiquetas: ["funda", "oferta"] }
  ]);
  print("✅ Productes d'exemple inserits.\n");
}

if (db.pedidos.countDocuments() === 0) {
  print("⚠️ La col·lecció 'pedidos' està buida. S'inseriran comandes de demostració.\n");
  db.pedidos.insertMany([
    { cliente: "Ana Martínez", producto: "Smartwatch X100", total: 149.99, data: new Date("2025-01-15") },
    { cliente: "Carlos Ruiz", producto: "Auriculares Bluetooth", total: 29.99, data: new Date("2025-01-20") },
    { cliente: "Ana Martínez", producto: "Funda mòbil universal", total: 9.99, data: new Date("2025-02-01") },
    { cliente: "Laura Gómez", producto: "Telèfon intel·ligent Z5", total: 399.99, data: new Date("2025-02-10") },
    { cliente: "Carlos Ruiz", producto: "Càrrega ràpida USB-C", total: 15.99, data: new Date("2025-02-14") },
    { cliente: "Ana Martínez", producto: "Cable USB-C 2m", total: 2.99, data: new Date("2025-02-20") },
    { cliente: "Laura Gómez", producto: "Auriculares Bluetooth", total: 29.99, data: new Date("2025-03-01") }
  ]);
  print("✅ Comandes d'exemple inserides a la col·lecció 'pedidos'.\n");
}

// =====================================================
// 4.1 CONSULTES AVANÇADES (CORREGIDES)
// =====================================================

print("--- 4.1 CONSULTES AVANÇADES ---\n");

// 1. $and: productes actius amb preu entre 20 i 100€
print("1. Productes actius amb preu entre 20 i 100€ ($and):");
const filtro1 = { $and: [ { activo: true }, { precio: { $gte: 20, $lte: 100 } } ] };
const count1 = db.productos.countDocuments(filtro1);
print(`   📊 Trobats: ${count1}`);
if (count1 > 0) {
  db.productos.find(filtro1).forEach(p => print(`   - ${p.nombre}: ${p.precio}€ (actiu: ${p.activo})`));
}
print("\n");

// 2. $or: productes de categoria 'electrónica' o valoració >= 4.5
print("2. Productes de categoria 'electrónica' o valoració >= 4.5 ($or):");
const filtro2 = { $or: [ { categoria: "electrónica" }, { valoracion: { $gte: 4.5 } } ] };
const count2 = db.productos.countDocuments(filtro2);
print(`   📊 Trobats: ${count2}`);
if (count2 > 0) {
  db.productos.find(filtro2).forEach(p => print(`   - ${p.nombre} (cat: ${p.categoria}, valoració: ${p.valoracion})`));
}
print("\n");

// 3. $regex: productes que continguin 'cable' (case-insensitive)
print("3. Productes que continguin 'cable' al nom ($regex):");
const filtro3 = { nombre: { $regex: /cable/i } };
const count3 = db.productos.countDocuments(filtro3);
print(`   📊 Trobats: ${count3}`);
if (count3 > 0) {
  db.productos.find(filtro3).forEach(p => print(`   - ${p.nombre}`));
}
print("\n");

// 4. sort + limit: 5 productes més cars
print("4. 5 productes més cars (sort per preu descendent + limit 5):");
const result4 = db.productos.find().sort({ precio: -1 }).limit(5);
print(`   📊 Resultats:`);
result4.forEach(p => print(`   - ${p.nombre}: ${p.precio}€`));
print("\n");

// 5. Agregació: comptar per categoria
print("5. Nombre de productes per categoria (aggregation $group):");
const result5 = db.productos.aggregate([
  { $group: { _id: "$categoria", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
result5.forEach(doc => print(`   - ${doc._id}: ${doc.count} producte(s)`));
print("\n");

// 6. Agregació: preu mitjà per categoria
print("6. Preu mitjà per categoria (aggregation $avg):");
const result6 = db.productos.aggregate([
  { $group: { _id: "$categoria", preu_mitja: { $avg: "$precio" } } },
  { $sort: { preu_mitja: -1 } }
]);
result6.forEach(doc => print(`   - ${doc._id}: ${doc.preu_mitja.toFixed(2)}€ de mitjana`));
print("\n");

// 7. Total gastat per client (sobre col·lecció 'pedidos')
print("7. Total consumit per client (agregació sobre 'pedidos'):");
const result7 = db.pedidos.aggregate([
  { $group: { _id: "$cliente", total_gastat: { $sum: "$total" } } },
  { $sort: { total_gastat: -1 } }
]);
result7.forEach(doc => print(`   - ${doc._id}: ${doc.total_gastat.toFixed(2)}€`));
print("\n");

// =====================================================
// 4.2 GESTIÓ D'ÍNDEXS
// =====================================================

print("--- 4.2 GESTIÓ D'ÍNDEXS ---\n");

print("7. Creant índex simple al camp 'categoria'...");
db.productos.createIndex({ categoria: 1 });
print("   ✅ Índex { categoria: 1 } creat (o ja existia).\n");

print("8. Creant índex compost per (categoria, preu)...");
db.productos.createIndex({ categoria: 1, precio: -1 });
print("   ✅ Índex { categoria: 1, precio: -1 } creat.\n");

print("9. Creant índex de text al camp 'nombre'...");
db.productos.createIndex({ nombre: "text" });
print("   ✅ Índex de text { nombre: 'text' } creat.\n");

print("10. Comparativa d'execució: consulta sense índex vs amb índex.\n");

// Consulta que inicialment no té índex (camp 'stock')
print("   --- Consulta sense índex (cerca per stock > 100) ---");
const querySenseIndex = { stock: { $gt: 100 } };
let explain = db.productos.find(querySenseIndex).explain("executionStats");
print(`   🔍 Etapa de cerca: ${explain.queryPlanner.winningPlan.stage}`);
print(`   📄 Documents examinats (totalDocsExamined): ${explain.executionStats.totalDocsExamined}`);
print(`   📊 Documents retornats (nReturned): ${explain.executionStats.nReturned}`);
print(`   ⏱ Temps d'execució (ms): ${explain.executionStats.executionTimeMillis}\n`);

print("   Creant índex temporal al camp 'stock' per a la comparació...");
db.productos.createIndex({ stock: 1 });

print("   --- Consulta AMB índex (stock > 100) ---");
explain = db.productos.find(querySenseIndex).explain("executionStats");
print(`   🔍 Etapa de cerca: ${explain.queryPlanner.winningPlan.stage}`);
print(`   📄 Documents examinats (totalDocsExamined): ${explain.executionStats.totalDocsExamined}`);
print(`   📊 Documents retornats (nReturned): ${explain.executionStats.nReturned}`);
print(`   ⏱ Temps d'execució (ms): ${explain.executionStats.executionTimeMillis}`);
print("\n   ➕ Diferència observada: amb índex es redueix dràsticament el nombre de documents examinats (totalDocsExamined) i millora el temps d'execució.\n");

print("11. Llistant tots els índexs de la col·lecció 'productos':");
db.productos.getIndexes().forEach(idx => printjson(idx));
print("\n");

print("==========================================");
print("✅ Totes les consultes avançades i gestió d'índexs s'han completat!");
print("==========================================\n");