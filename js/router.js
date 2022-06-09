const { Router } = require("express");
const { Contenedor } = require("./contenedor.js");
const PRODUCTO_INEXISTENTE = "Producto no encontrado";
const HTTP_STATUS_ERROR_BAD_REQUEST = 400;
const HTTP_STATUS_ERROR_NOT_FOUND = 404;

const router = Router();

// creo el objeto productos con el contenido de productos.txt
const productos = new Contenedor("./data/productos.txt");

// Crea un objeto con el mensaje de error para responder
function buildErrorMessage(mensaje) {
  return {
    error: mensaje,
  };
}

// retorna todos los productos
router.get("/", (req, res) => {
  res.send(productos.getAll());
});

// retorna el producto por id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = productos.getById(id);
  if (result) {
    res.send(result);
  } else {
    res
      .status(HTTP_STATUS_ERROR_NOT_FOUND)
      .send(buildErrorMessage(PRODUCTO_INEXISTENTE));
  }
});

// agregar un nuevo producto
router.post("/", (req, res) => {
  const productoNuevo = req.body;
  const error = productos.validaProducto(productoNuevo);
  if (!error) {
    res.send(productos.save(productoNuevo));
  } else {
    res.status(HTTP_STATUS_ERROR_BAD_REQUEST).send(buildErrorMessage(error));
  }
});

// actualizar un producto
router.put("/:id", (req, res) => {
  const productoActualizado = req.body;
  const id = Number(req.params.id);
  const error = productos.validaProducto(productoActualizado);
  if (!error) {
    const result = productos.updateById(id, productoActualizado);
    if (result) {
      res.send(result);
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(buildErrorMessage(PRODUCTO_INEXISTENTE));
    }
  } else {
    res.status(HTTP_STATUS_ERROR_BAD_REQUEST).send(buildErrorMessage(error));
  }
});

// borro un producto
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = productos.deleteById(id);
  if (result) {
    res.send(result);
  } else {
    res
      .status(HTTP_STATUS_ERROR_NOT_FOUND)
      .send(buildErrorMessage(PRODUCTO_INEXISTENTE));
  }
});

module.exports = { router };
