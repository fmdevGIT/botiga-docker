// =====================================================
// BOTIGA DOCKERMON - OPERACIONES CRUD (CORREGIDO)
// =====================================================

db = db.getSiblingDB('botiga');

print("==========================================");
print("OPERACIONES CRUD SOBRE LA COLECCIÓN 'PRODUCTOS'");
print("==========================================\n");

// Limpiar colección antes de empezar (evita duplicados)
db.productos.deleteMany({});
print("🧹 Colección 'productos' limpiada.\n");

// =====================================================
// 3.1 CREATE (INSERCIÓN)
// =====================================================

print("--- 3.1 CREATE (INSERCIÓN) ---\n");

// 1. Insertar un nuevo producto individual
print("1. Insertando un nuevo producto individual...");
const nuevoProducto = {
  nombre: "Smartwatch X100",
  precio: 149.99,
  categoria: "electrónica",
  stock: 30,
  valoracion: 4.5,
  activo: true,
  etiquetas: ["smartwatch", "wearable", "salud"],
  creado_el: new Date()
};
const resultadoInsertOne = db.productos.insertOne(nuevoProducto);
print(`   ✅ Producto insertado. _id: ${resultadoInsertOne.insertedId}`);
print(`   📊 Documentos afectados: ${resultadoInsertOne.acknowledged ? 1 : 0}\n`);

// 2. Insertar 3 productos de la categoría 'ofertas'
print("2. Insertando 3 productos de la categoría 'ofertas'...");
const productosOfertas = [
  {
    nombre: "Oferta: Auriculares Bluetooth",
    precio: 19.99,
    categoria: "ofertas",
    stock: 100,
    valoracion: 4.2,
    activo: true,
    etiquetas: ["auriculares", "bluetooth", "oferta"],
    creado_el: new Date()
  },
  {
    nombre: "Oferta: Funda móvil universal",
    precio: 4.99,
    categoria: "ofertas",
    stock: 200,
    valoracion: 3.8,
    activo: true,
    etiquetas: ["funda", "móvil", "oferta"],
    creado_el: new Date()
  },
  {
    nombre: "Oferta: Cable USB-C 2m",
    precio: 2.99,
    categoria: "ofertas",
    stock: 500,
    valoracion: 4.0,
    activo: true,
    etiquetas: ["cable", "usb-c", "oferta"],
    creado_el: new Date()
  }
];
const resultadoInsertMany = db.productos.insertMany(productosOfertas);
// CORRECCIÓN: insertedIds es un objeto, usar Object.keys().length
const numInsertados = Object.keys(resultadoInsertMany.insertedIds).length;
print(`   ✅ Productos insertados: ${numInsertados}`);
print(`   📊 Documentos afectados: ${resultadoInsertMany.acknowledged ? numInsertados : 0}\n`);

// =====================================================
// 3.2 READ (LECTURA) - CORREGIDO
// =====================================================

print("--- 3.2 READ (LECTURA) ---\n");

// 3. Listar todos los productos
print("3. Listando todos los productos de la colección:");
const totalProductos = db.productos.countDocuments();
print(`   📊 Total productos encontrados: ${totalProductos}\n`);
db.productos.find().forEach(producto => printjson(producto));
print("\n");

// 4. Productos con precio < 50€
print("4. Productos con precio inferior a 50€:");
const filtroPrecio = { precio: { $lt: 50 } };
const countPrecio = db.productos.countDocuments(filtroPrecio);
print(`   📊 Productos encontrados: ${countPrecio}\n`);
db.productos.find(filtroPrecio).forEach(producto => {
  print(`   - ${producto.nombre}: ${producto.precio}€`);
});
print("\n");

// 5. Productos categoría 'electrónica' con stock > 0
print("5. Productos de categoría 'electrónica' con stock > 0:");
const filtroElectronica = { categoria: "electrónica", stock: { $gt: 0 } };
const countElectronica = db.productos.countDocuments(filtroElectronica);
print(`   📊 Productos encontrados: ${countElectronica}\n`);
db.productos.find(filtroElectronica).forEach(producto => {
  print(`   - ${producto.nombre}: stock ${producto.stock} unidades, ${producto.precio}€`);
});
print("\n");

// 6. Productos con valoración >= 4.0 (proyección)
print("6. Productos con valoración >= 4.0 (proyección: nombre, precio, valoración):");
const filtroValoracion = { valoracion: { $gte: 4.0 } };
const countValoracion = db.productos.countDocuments(filtroValoracion);
print(`   📊 Productos encontrados: ${countValoracion}\n`);
db.productos.find(filtroValoracion, { nombre: 1, precio: 1, valoracion: 1, _id: 0 })
  .forEach(producto => {
    print(`   - ${producto.nombre}: ${producto.precio}€ (⭐ ${producto.valoracion})`);
  });
print("\n");

// 7. Productos con etiqueta 'smartphone' (aunque no haya, se muestra correctamente)
print("7. Productos con la etiqueta 'smartphone':");
const filtroEtiqueta = { etiquetas: "smartphone" };
const countEtiqueta = db.productos.countDocuments(filtroEtiqueta);
print(`   📊 Productos encontrados: ${countEtiqueta}\n`);
db.productos.find(filtroEtiqueta).forEach(producto => {
  print(`   - ${producto.nombre}: ${producto.precio}€`);
  print(`     Etiquetas: ${producto.etiquetas.join(", ")}`);
});
print("\n");

// =====================================================
// 3.3 UPDATE (ACTUALIZACIÓN)
// =====================================================

print("--- 3.3 UPDATE (ACTUALIZACIÓN) ---\n");

// 8. Actualizar precio del Smartwatch X100
print("8. Actualizando el precio del producto 'Smartwatch X100'...");
const resUpdateOne = db.productos.updateOne(
  { nombre: "Smartwatch X100" },
  { $set: { precio: 129.99 } }
);
print(`   ✅ Precio actualizado a 129.99€`);
print(`   📊 Documentos modificados: ${resUpdateOne.modifiedCount}\n`);

// 9. Aumentar stock +10 a todos los 'electrónica'
print("9. Aumentando stock +10 unidades a todos los productos de categoría 'electrónica'...");
const resUpdateMany = db.productos.updateMany(
  { categoria: "electrónica" },
  { $inc: { stock: 10 } }
);
print(`   ✅ Stock incrementado en 10 unidades`);
print(`   📊 Documentos modificados: ${resUpdateMany.modifiedCount}\n`);

// 10. Añadir etiqueta 'promo' a 'iPhone 15 Pro' (si no existe, no pasa nada)
print("10. Añadiendo la etiqueta 'promo' al producto 'iPhone 15 Pro'...");
const resAddTag = db.productos.updateOne(
  { nombre: "iPhone 15 Pro" },
  { $addToSet: { etiquetas: "promo" } }
);
print(`   ✅ Etiqueta 'promo' añadida (si existía el producto)`);
print(`   📊 Documentos modificados: ${resAddTag.modifiedCount}\n`);

// 11. Desactivar productos sin stock
print("11. Desactivando (activo: false) todos los productos sin stock (stock = 0)...");
const resDesactivar = db.productos.updateMany(
  { stock: { $eq: 0 } },
  { $set: { activo: false } }
);
print(`   ✅ Productos sin stock desactivados`);
print(`   📊 Documentos modificados: ${resDesactivar.modifiedCount}\n`);

// =====================================================
// 3.4 DELETE (ELIMINACIÓN)
// =====================================================

print("--- 3.4 DELETE (ELIMINACIÓN) ---\n");

// 12. Eliminar Smartwatch X100
print("12. Eliminando el producto 'Smartwatch X100'...");
const resDeleteOne = db.productos.deleteOne({ nombre: "Smartwatch X100" });
print(`   ✅ Producto eliminado`);
print(`   📊 Documentos eliminados: ${resDeleteOne.deletedCount}\n`);

// 13. Eliminar todos los productos de categoría 'ofertas'
print("13. Eliminando todos los productos de la categoría 'ofertas'...");
const resDeleteMany = db.productos.deleteMany({ categoria: "ofertas" });
print(`   ✅ Productos de la categoría 'ofertas' eliminados`);
print(`   📊 Documentos eliminados: ${resDeleteMany.deletedCount}\n`);

// =====================================================
// RESUMEN FINAL
// =====================================================

print("==========================================");
print("RESUMEN FINAL DEL ESTADO DE LA COLECCIÓN");
print("==========================================");
const totalFinal = db.productos.countDocuments();
print(`📊 Total productos en la colección: ${totalFinal}`);
print(`📊 Productos activos: ${db.productos.countDocuments({ activo: true })}`);
print(`📊 Productos inactivos: ${db.productos.countDocuments({ activo: false })}`);
const categorias = db.productos.distinct("categoria");
print(`📊 Categorías disponibles: ${categorias.join(", ") || "ninguna"}`);

print("\n✅ Todas las operaciones CRUD se han completado correctamente!");
print("==========================================\n");