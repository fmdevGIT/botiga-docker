// =====================================================
// BOTIGA DOCKERMON - OPERACIONES CRUD
// =====================================================
// Este archivo contiene todas las operaciones CRUD sobre la colección 'productos'
// Ejecutar: docker exec -it mongodb-botiga mongosh -u admin -p admin123 --authenticationDatabase admin --file /queries/crud.js

// Conectar a la base de datos botiga
db = db.getSiblingDB('botiga');

print("==========================================");
print("OPERACIONES CRUD SOBRE LA COLECCIÓN 'PRODUCTOS'");
print("==========================================\n");

// =====================================================
// 3.1 CREATE (INSERCIÓN)
// =====================================================

print("--- 3.1 CREATE (INSERCIÓN) ---\n");

// 1. Insertar un nuevo producto individual con insertOne()
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

// 2. Insertar 3 productos nuevos de la categoría 'ofertas' con insertMany()
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
print(`   ✅ Productos insertados: ${resultadoInsertMany.insertedIds.length}`);
print(`   📊 Documentos afectados: ${resultadoInsertMany.acknowledged ? resultadoInsertMany.insertedIds.length : 0}\n`);

// =====================================================
// 3.2 READ (LECTURA)
// =====================================================

print("--- 3.2 READ (LECTURA) ---\n");

// 3. Listar todos los productos de la colección
print("3. Listando todos los productos de la colección:");
const todosProductos = db.productos.find();
print(`   📊 Total productos encontrados: ${db.productos.countDocuments()}\n`);
todosProductos.forEach(producto => {
  printjson(producto);
});
print("\n");

// 4. Buscar productos con precio inferior a 50€
print("4. Productos con precio inferior a 50€:");
const productosPrecioBajo = db.productos.find({ precio: { $lt: 50 } });
print(`   📊 Productos encontrados: ${productosPrecioBajo.length()}\n`);
productosPrecioBajo.forEach(producto => {
  print(`   - ${producto.nombre}: ${producto.precio}€`);
});
print("\n");

// 5. Buscar productos de una categoría específica con stock > 0
print("5. Productos de categoría 'electrónica' con stock > 0:");
const productosCategoria = db.productos.find({ 
  categoria: "electrónica", 
  stock: { $gt: 0 } 
});
print(`   📊 Productos encontrados: ${productosCategoria.length()}\n`);
productosCategoria.forEach(producto => {
  print(`   - ${producto.nombre}: stock ${producto.stock} unidades, ${producto.precio}€`);
});
print("\n");

// 6. Buscar productos con valoración >= 4.0 (solo nombre, precio y valoración)
print("6. Productos con valoración >= 4.0 (proyección: nombre, precio, valoración):");
const productosValoracion = db.productos.find(
  { valoracion: { $gte: 4.0 } },
  { projection: { nombre: 1, precio: 1, valoracion: 1, _id: 0 } }
);
print(`   📊 Productos encontrados: ${productosValoracion.length()}\n`);
productosValoracion.forEach(producto => {
  print(`   - ${producto.nombre}: ${producto.precio}€ (⭐ ${producto.valoracion})`);
});
print("\n");

// 7. Buscar productos por etiqueta
print("7. Productos con la etiqueta 'smartphone':");
const productosPorEtiqueta = db.productos.find({ etiquetas: "smartphone" });
print(`   📊 Productos encontrados: ${productosPorEtiqueta.length()}\n`);
productosPorEtiqueta.forEach(producto => {
  print(`   - ${producto.nombre}: ${producto.precio}€`);
  print(`     Etiquetas: ${producto.etiquetas.join(", ")}`);
});
print("\n");

// =====================================================
// 3.3 UPDATE (ACTUALIZACIÓN)
// =====================================================

print("--- 3.3 UPDATE (ACTUALIZACIÓN) ---\n");

// 8. Actualizar el precio de un producto específico con updateOne()
print("8. Actualizando el precio del producto 'Smartwatch X100'...");
const resultadoUpdateOne = db.productos.updateOne(
  { nombre: "Smartwatch X100" },
  { $set: { precio: 129.99 } }
);
print(`   ✅ Precio actualizado de 149.99€ a 129.99€`);
print(`   📊 Documentos modificados: ${resultadoUpdateOne.modifiedCount}\n`);

// 9. Aumentar el stock de todos los productos de una categoría en 10 unidades
print("9. Aumentando stock +10 unidades a todos los productos de categoría 'electrónica'...");
const resultadoUpdateMany = db.productos.updateMany(
  { categoria: "electrónica" },
  { $inc: { stock: 10 } }
);
print(`   ✅ Stock incrementado en 10 unidades`);
print(`   📊 Documentos modificados: ${resultadoUpdateMany.modifiedCount}\n`);

// 10. Añadir una nueva etiqueta a un producto existente
print("10. Añadiendo la etiqueta 'promo' al producto 'iPhone 15 Pro'...");
const resultadoAddEtiqueta = db.productos.updateOne(
  { nombre: "iPhone 15 Pro" },
  { $addToSet: { etiquetas: "promo" } }
);
print(`   ✅ Etiqueta 'promo' añadida`);
print(`   📊 Documentos modificados: ${resultadoAddEtiqueta.modifiedCount}\n`);

// 11. Desactivar (activo: false) todos los productos sin stock
print("11. Desactivando (activo: false) todos los productos sin stock (stock = 0)...");
const resultadoDesactivar = db.productos.updateMany(
  { stock: { $eq: 0 } },
  { $set: { activo: false } }
);
print(`   ✅ Productos sin stock desactivados`);
print(`   📊 Documentos modificados: ${resultadoDesactivar.modifiedCount}\n`);

// =====================================================
// 3.4 DELETE (ELIMINACIÓN)
// =====================================================

print("--- 3.4 DELETE (ELIMINACIÓN) ---\n");

// 12. Eliminar un producto por su nombre
print("12. Eliminando el producto 'Smartwatch X100'...");
const resultadoDeleteOne = db.productos.deleteOne({ nombre: "Smartwatch X100" });
print(`   ✅ Producto eliminado`);
print(`   📊 Documentos eliminados: ${resultadoDeleteOne.deletedCount}\n`);

// 13. Eliminar todos los productos de la categoría 'ofertas'
print("13. Eliminando todos los productos de la categoría 'ofertas'...");
const resultadoDeleteMany = db.productos.deleteMany({ categoria: "ofertas" });
print(`   ✅ Productos de la categoría 'ofertas' eliminados`);
print(`   📊 Documentos eliminados: ${resultadoDeleteMany.deletedCount}\n`);

// =====================================================
// RESUMEN FINAL
// =====================================================

print("==========================================");
print("RESUMEN FINAL DEL ESTADO DE LA COLECCIÓN");
print("==========================================");
const totalProductos = db.productos.countDocuments();
print(`📊 Total productos en la colección: ${totalProductos}`);

const productosActivos = db.productos.countDocuments({ activo: true });
print(`📊 Productos activos: ${productosActivos}`);

const productosInactivos = db.productos.countDocuments({ activo: false });
print(`📊 Productos inactivos: ${productosInactivos}`);

const categorias = db.productos.distinct("categoria");
print(`📊 Categorías disponibles: ${categorias.join(", ")}`);

print("\n✅ Todas las operaciones CRUD se han completado correctamente!");
print("==========================================\n");