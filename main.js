let carrito = [];
let totalCompra = 0;

function agregarAlCarrito(nombreProducto, precioProducto, cantidad) {
    cantidad = parseInt(cantidad);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }

    const productoExistente = carrito.find(item => item.nombre === nombreProducto);

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        productoExistente.subtotal = productoExistente.cantidad * productoExistente.precio;
    } else {
        carrito.push({
            nombre: nombreProducto,
            precio: precioProducto,
            cantidad: cantidad,
            subtotal: precioProducto * cantidad
        });
    }

    actualizarCarrito();
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById("listaCarrito");
    const totalCompraElement = document.getElementById("totalCompra");

    listaCarrito.innerHTML = '';
    totalCompra = 0;

    carrito.forEach(producto => {
        const li = document.createElement("li");
        li.innerHTML = `${producto.nombre} - ${producto.cantidad} x $${producto.precio.toLocaleString()} = $${producto.subtotal.toLocaleString()}`;
        listaCarrito.appendChild(li);
        totalCompra += producto.subtotal;
    });

    totalCompraElement.innerText = `$${totalCompra.toLocaleString()}`;
}

function agregarATablaCompras() {
    const tablaCompras = document.getElementById("tablaCompras");

    carrito.forEach(producto => {
        let filaExistente = Array.from(tablaCompras.getElementsByTagName("tr")).find(
            row => row.cells[0].innerText === producto.nombre
        );

        if (filaExistente) {

            let cantidadCell = filaExistente.cells[1];
            let subtotalCell = filaExistente.cells[3];

            const nuevaCantidad = parseInt(cantidadCell.innerText) + producto.cantidad;
            cantidadCell.innerText = nuevaCantidad;

            const nuevoSubtotal = nuevaCantidad * producto.precio;
            subtotalCell.innerText = `$${nuevoSubtotal.toLocaleString()}`;
        } else {
            const row = document.createElement("tr");

            const nombreCell = document.createElement("td");
            nombreCell.innerText = producto.nombre;
            row.appendChild(nombreCell);

            const cantidadCell = document.createElement("td");
            cantidadCell.innerText = producto.cantidad;
            row.appendChild(cantidadCell);

            const precioCell = document.createElement("td");
            precioCell.innerText = `$${producto.precio.toLocaleString()}`;
            row.appendChild(precioCell);

            const subtotalCell = document.createElement("td");
            subtotalCell.innerText = `$${producto.subtotal.toLocaleString()}`;
            row.appendChild(subtotalCell);

            tablaCompras.appendChild(row);
        }
    });

    recalcularSumaTotal();
}

function recalcularSumaTotal() {
    let sumaTotal = 0;
    const tablaCompras = document.getElementById("tablaCompras");
    const filas = tablaCompras.getElementsByTagName("tr");
    
    for (let fila of filas) {
        const subtotalCell = fila.cells[3];
        if (subtotalCell) {
            const subtotal = parseFloat(subtotalCell.innerText.replace('$', '').trim().replace(/\./g, '').replace(',', '.'));
            sumaTotal += subtotal;
        }
    }

    const sumaTotalElement = document.getElementById("sumaTotal");
    sumaTotalElement.innerText = `$${sumaTotal.toLocaleString()}`;
}

document.getElementById("comprar").addEventListener("click", function() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    agregarATablaCompras();

    carrito = [];
    actualizarCarrito();
    document.getElementById("totalCompra").innerText = "$0";
});

document.getElementById("limpiar").addEventListener("click", function() {
    carrito = [];
    actualizarCarrito();
    document.getElementById("totalCompra").innerText = "$0";
});

document.getElementById("borrar").addEventListener("click", function() {
    const tablaCompras = document.getElementById("tablaCompras");

    if (tablaCompras.rows.length > 0) {
        tablaCompras.deleteRow(tablaCompras.rows.length - 1);

        carrito.pop();

        actualizarCarrito();

        recalcularSumaTotal();
    } else {
        alert("La tabla de compras está vacía.");
    }
});

