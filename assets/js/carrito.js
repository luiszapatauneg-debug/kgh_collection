// --- CARRITO DE COMPRAS - COMPUTADORAS VENEZUELA ---

document.addEventListener("DOMContentLoaded", () => {
    // Sincronizar el select del carrito con lo que guardó el usuario
    const selectMoneda = document.getElementById('moneda-select');
    if (selectMoneda && typeof monedaActual !== 'undefined') {
        selectMoneda.value = monedaActual;
    }

    // Pintar el carrito
    if (typeof renderizarCarritoVisual === 'function') {
        renderizarCarritoVisual();
    }
});

// 1. Sincronizar todos los precios del carrito con la lista maestra (PRODUCTOS.JS)

function sincronizarPreciosCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let carritoModificado = false;

    // --- SEGURIDAD: Si no existen datos, no hagas nada y sal de la función ---
    let listaProductos = typeof productosData !== 'undefined' ? productosData : (typeof productos !== 'undefined' ? productos : []);
    
    // Si listaProductos está vacío, detenemos la ejecución aquí mismo sin errores
    if (!listaProductos || listaProductos.length === 0) {
        console.warn("La lista de productos aún no está disponible para sincronizar.");
        return; 
    }

    carrito.forEach(item => {
        let productoOficial = null;

        if (item.id) {
            productoOficial = listaProductos.find(p => p.id === item.id);
        }

        if (!productoOficial && item.nombre) {
            let nombreItem = item.nombre.toLowerCase().trim();
            productoOficial = listaProductos.find(p => p.nombre && p.nombre.toLowerCase().trim() === nombreItem);
        }
        
        if (productoOficial) {
            let precioOficial = parseFloat(productoOficial.precio);
            
            if (parseFloat(item.precio) !== precioOficial || item.nombre !== productoOficial.nombre) {
                console.log(`Actualizando ${productoOficial.nombre}: precio viejo ${item.precio} -> nuevo ${precioOficial}`);
                item.precio = precioOficial;
                item.nombre = productoOficial.nombre;
                item.id = productoOficial.id;
                carritoModificado = true;
            }
        }
    });

    if (carritoModificado) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
}

// 2. Función unificada para agregar al carrito

function agregarAlCarrito(nombre, precio) {

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

   

    let precioFinal = parseFloat(precio);

    let nombreOficial = nombre;

    let idEncontrado = null;



    let listaProductos = typeof productosData !== 'undefined' ? productosData : (typeof productos !== 'undefined' ? productos : null);



    if (listaProductos && Array.isArray(listaProductos)) {

        let productoOficial = listaProductos.find(p =>

            (p.nombre && p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()) ||

            (p.id && p.id === nombre)

        );

       

        if (productoOficial) {

            nombreOficial = productoOficial.nombre;

            precioFinal = parseFloat(productoOficial.precio);

            idEncontrado = productoOficial.id || null;

        }

    }

   

    let productoExistente = carrito.find(item => item.nombre.trim().toLowerCase() === nombreOficial.trim().toLowerCase());

   

    if (productoExistente) {

        productoExistente.cantidad += 1;

        productoExistente.precio = precioFinal; // Actualizamos al precio actual

    } else {

        carrito.push({

            id: idEncontrado,

            nombre: nombreOficial,

            precio: precioFinal,

            cantidad: 1

        });

    }

   

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`¡"${nombreOficial}" fue agregado al carrito! 🛒`);

}



// 3. Función unificada (Soporta ID, talla y color)
window.agregarAlCarritoPorId = function(idProducto, talla = null, color = null) {
    let listaProductos = typeof productosData !== 'undefined' ? productosData : (typeof productos !== 'undefined' ? productos : null);
    
    if (!listaProductos) {
        console.error("No se encuentra la lista de productos.");
        return;
    }
    
    let productoOficial = listaProductos.find(p => p.id === idProducto);
    
    if (productoOficial) {
        let nombre = productoOficial.nombre;
        let precio = parseFloat(productoOficial.precio);
        
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Creamos un identificador único que incluya la talla y el color seleccionados
        let idUnico = idProducto + (talla ? `-${talla}` : '') + (color ? `-${color}` : '');
        
        let productoExistente = carrito.find(item => item.idUnico === idUnico);
        
       // Capturamos la foto exacta que se está mostrando en el modal/pantalla en este momento
        let imgElement = document.getElementById('modal-img') || document.querySelector('.producto-img-principal') || document.querySelector('.img-producto');
        let fotoSeleccionada = imgElement ? imgElement.src : (productoOficial.imagen || 'images/default.jpg');

        if (productoExistente) {
            productoExistente.cantidad += 1;
            // Actualizamos la foto por si cambió de color en esta nueva adición
            productoExistente.imagen = fotoSeleccionada; 
        } else {
            carrito.push({
                idUnico: idUnico,
                id: idProducto,
                nombre: nombre,
                precio: precio,
                imagen: fotoSeleccionada, // <-- ¡Aquí guardamos la foto del color elegido!
                talla: talla || 'N/A',   
                color: color || 'N/A',   
                cantidad: 1
            });
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        alert(`¡"${nombre}" fue agregado al carrito! 🛒`);
    } else {
        alert("Producto no encontrado en la base de datos.");
    }
};


// 4. Disminuir cantidad

function disminuirCantidad(index) {

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito[index].cantidad > 1) {

        carrito[index].cantidad -= 1;

    } else {

        carrito.splice(index, 1);

    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarCarritoVisual();

}



// 5. Aumentar cantidad

function aumentarCantidad(index) {

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito[index].cantidad += 1;

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarCarritoVisual();

}



// 6. Eliminar producto

function eliminarDelCarrito(index) {

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito.splice(index, 1);

    localStorage.setItem('carrito', JSON.stringify(carrito));
   actualizarContadorCarrito();
    renderizarCarritoVisual();

}



// 7. Renderizar carrito visualmente
function renderizarCarritoVisual() {
    let contenedor = document.getElementById('tabla-carrito-container');
    if (!contenedor) return;

    sincronizarPreciosCarrito();
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let listaProductos = typeof productosData !== 'undefined' ? productosData : [];

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p style="text-align:center; padding: 20px;">Tu carrito está vacío.</p>`;
        return;
    }

    let html = `<div class="carrito-items-list">`;
    let totalGeneral = 0;

    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;

      let productoOficial = listaProductos.find(p => p.id === item.id);
        // Priorizamos la foto específica del color que guardó el usuario, si no existe usa la oficial
        let imagen = item.imagen || (productoOficial ? productoOficial.imagen : 'images/default.jpg');
        let descripcion = productoOficial && productoOficial.descripcion ? productoOficial.descripcion : '';

        // Preparamos el texto de las variantes (talla y color)
        let variacionesHtml = '';
        if (item.talla && item.talla !== 'N/A') {
            variacionesHtml += `Talla: <strong>${item.talla}</strong> `;
        }
        if (item.color && item.color !== 'N/A') {
            let colorLower = item.color.toLowerCase().trim();
            
            // Diccionario para traducir nombres comunes de colores a códigos CSS válidos
            let mapaColores = {
                'blanco': '#ffffff',
                'negro': '#000000',
                'rojo': '#ff0000',
                'azul': '#0000ff',
                'verde': '#008000',
                'amarillo': '#ffff00',
                'gris': '#808080',
                'morado': '#800080',
                'naranja': '#ffa500',
                'rosado': '#ffc0cb',
                'celeste': '#87ceeb'
            };

            // Si está en el diccionario usamos el código CSS, si no, usamos el valor que tenga (por si es un HEX ej: #333333)
            let colorCss = mapaColores[colorLower] || item.color;

            // Verificamos si es blanco o un color muy claro para ponerle un borde visible
            let esBlanco = colorLower === 'blanco' || colorCss === '#ffffff' || colorCss === '#fff';
            let estiloBorde = esBlanco ? 'border: 1px solid #777;' : 'border: 1px solid transparent;';
            
            variacionesHtml += `Color: <span style="display:inline-block; width:12px; height:12px; background:${colorCss}; border-radius:50%; vertical-align:middle; ${estiloBorde} margin-right: 3px;"></span> ${item.color}`;
        }

        html += `
            <div class="carrito-item-card" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ddd; padding: 15px 0; gap: 15px;">
                <img src="${imagen}" alt="${item.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                
                <div class="carrito-info-controls" style="flex-grow: 1;">
                    <h4 style="margin: 0 0 5px 0;">${item.nombre}</h4>
                    ${descripcion ? `<p style="margin: 0 0 5px 0; font-size: 0.85rem; color: #666;">${descripcion}</p>` : ''}
                    ${variacionesHtml ? `<p style="margin: 0 0 5px 0; font-size: 0.85rem; color: #444;">${variacionesHtml}</p>` : ''}
                <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">${formatearPrecio(item.precio)}</p>
                    
                    <div class="carrito-botones-cantidad" style="display: flex; align-items: center; gap: 10px;">
                        <button class="btn-cantidad" onclick="disminuirCantidad(${index})">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-cantidad" onclick="aumentarCantidad(${index})">+</button>
                    </div>
                </div>

               <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                    <div>
                        <button class="btn-editar" onclick="abrirModalEdicion(${index})" title="Editar opciones" style="background: none; border: none; cursor: pointer; font-size: 1.1rem; margin-right: 5px;">✏️</button>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})" title="Eliminar producto" style="background: none; border: none; cursor: pointer; font-size: 1.1rem;">🗑️</button>
                    </div>
              <p style="font-weight: bold; margin: 0; color: #222;">${formatearPrecio(subtotal)}</p>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // 💡 Calculamos ambos montos de forma fija para mostrarlos juntos
    const tasa = typeof tasaCambioBCV !== 'undefined' ? tasaCambioBCV : 36.50;
    const totalBs = totalGeneral * tasa;
    const totalBsFormateado = totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    html += `
        <div style="margin-top: 20px; text-align: right; border-top: 2px solid #ddd; padding-top: 15px;">
            <h3 style="margin: 0 0 5px 0; font-size: 1rem; color: #e2e0da;">Total a Pagar:</h3>
            <div style="font-size: 1.3rem; font-weight: bold; color: #d4af37;">
                <span>$${totalGeneral.toFixed(2)} USD</span> 
                <span style="color: #d4af37; margin: 0 8px;">/</span> 
                <span style="color: #d4af37;">Bs. ${totalBsFormateado}</span>
            </div>
        </div>
    `;
    contenedor.innerHTML = html;
}

// 8. Finalizar compra por WhatsApp (Modificado para abrir el formulario modal)

let numeroWhatsAppGlobal = "";



function finalizarCompraWhatsApp(numeroWhatsApp) {

    sincronizarPreciosCarrito();

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

   

    if (carrito.length === 0) {

        alert("Tu carrito está vacío. ¡Agrega al menos un producto antes de pedir!");

        return;

    }



    numeroWhatsAppGlobal = numeroWhatsApp;



    // Verificar si en el carrito hay algún producto de licor (categorías "rones" o "licores")

    let listaProductos = typeof productosData !== 'undefined' ? productosData : [];

    const tieneLicores = carrito.some(item => {

        let prodOriginal = listaProductos.find(p => p.id === item.id || p.nombre === item.nombre);

        return prodOriginal && (prodOriginal.categoria === "rones" || prodOriginal.categoria === "licores");

    });


    // Mostrar modal de datos

    const modalWsp = document.getElementById('modal-whatsapp');

    if (modalWsp) modalWsp.style.display = 'flex';

}



// Ocultar/Mostrar campo de zona según el tipo de entrega

// Controlar visibilidad del delivery, zona y métodos de pago según la opción elegida
function actualizarOpcionesEntrega() {
    const tipo = document.getElementById('wsp-entrega').value;
    const contZona = document.getElementById('contenedor-zona');
    const inputZona = document.getElementById('wsp-zona');
    const labelZona = contZona ? contZona.querySelector('label') : null;
    
    // Avisos
    const avisoDelivery = document.getElementById('aviso-delivery');
    const avisoEnvio = document.getElementById('aviso-envio');
    
    // Empresa de Envío
    const contEmpresaEnvio = document.getElementById('contenedor-empresa-envio');
    
    // Métodos de pago
    const opcionPuntoVenta = document.getElementById('opcion-punto-venta');
    const opcionEfectivo = document.getElementById('opcion-efectivo');
    const selectPago = document.getElementById('wsp-pago');

    if (tipo === 'Retirar en Tienda') {
        // --- 1. RETIRAR EN TIENDA ---
        if (contZona) contZona.style.setProperty('display', 'none', 'important');
        if (inputZona) inputZona.required = false;
        if (avisoDelivery) avisoDelivery.style.setProperty('display', 'none', 'important');
        if (avisoEnvio) avisoEnvio.style.setProperty('display', 'none', 'important');
        if (contEmpresaEnvio) contEmpresaEnvio.style.setProperty('display', 'none', 'important');

        // Mostramos Efectivo y ocultamos Punto de Venta (o muéstralo si aplica en tienda)
        if (opcionEfectivo) {
            opcionEfectivo.hidden = false;
            opcionEfectivo.disabled = false;
        }
        if (opcionPuntoVenta) {
            opcionPuntoVenta.hidden = false;
            opcionPuntoVenta.disabled = false;
        }

    } else if (tipo === 'Envio Nacional') {
        // --- 2. ENVÍO NACIONAL ---
        if (contZona) contZona.style.setProperty('display', 'block', 'important');
        if (inputZona) {
            inputZona.required = true;
            inputZona.placeholder = "Ej. Ciudad, Estado...";
        }
        if (labelZona) labelZona.textContent = "Dirección de Destino / Agencia:";

        if (avisoDelivery) avisoDelivery.style.setProperty('display', 'none', 'important');
        if (avisoEnvio) avisoEnvio.style.setProperty('display', 'block', 'important');
        if (contEmpresaEnvio) contEmpresaEnvio.style.setProperty('display', 'block', 'important');
        
        // 💡 Ocultar Efectivo y Punto de Venta usando hidden y disabled
        if (opcionEfectivo) {
            opcionEfectivo.hidden = true;
            opcionEfectivo.disabled = true;
        }
        if (opcionPuntoVenta) {
            opcionPuntoVenta.hidden = true;
            opcionPuntoVenta.disabled = true;
        }

        // Si tenía seleccionado Efectivo o Punto de Venta, lo cambiamos automáticamente a Pago Móvil
        if (selectPago && (selectPago.value === 'Efectivo USD' || selectPago.value === 'Punto de Venta')) {
            selectPago.value = 'Pago Móvil';
        }

    } else {
        // --- 3. DELIVERY A DOMICILIO ---
        if (contZona) contZona.style.setProperty('display', 'block', 'important');
        if (inputZona) {
            inputZona.required = true;
            inputZona.placeholder = "Ej. Alta Vista, Unare, Centro...";
        }
        if (labelZona) labelZona.textContent = "Zona / Sector:";

        if (avisoDelivery) avisoDelivery.style.setProperty('display', 'block', 'important');
        if (avisoEnvio) avisoEnvio.style.setProperty('display', 'none', 'important');
        if (contEmpresaEnvio) contEmpresaEnvio.style.setProperty('display', 'none', 'important');

        // Permitir Efectivo (por si pagan al delivery) pero ocultar Punto de Venta
        if (opcionEfectivo) {
            opcionEfectivo.hidden = false;
            opcionEfectivo.disabled = false;
        }
        if (opcionPuntoVenta) {
            opcionPuntoVenta.hidden = true;
            opcionPuntoVenta.disabled = true;
        }

        // Si tenía seleccionado Punto de Venta, lo cambiamos a Pago Móvil
        if (selectPago && selectPago.value === 'Punto de Venta') {
            selectPago.value = 'Pago Móvil';
        }
    }
}

// ⚠️ IMPORTANTE: Asegúrate de llamar a esta función justo cuando se abra el modal del carrito 
// para que el formulario se pinte bien desde el primer segundo según lo que esté seleccionado por defecto:
// actualizarOpcionesEntrega();


// Eventos para cerrar y enviar el formulario del modal de WhatsApp
document.addEventListener("DOMContentLoaded", () => {
    const btnCerrarWsp = document.getElementById('cerrar-modal-wsp');
    const modalWsp = document.getElementById('modal-whatsapp');
    const formWspDatos = document.getElementById('form-whatsapp-datos');

    if (btnCerrarWsp && modalWsp) {
        btnCerrarWsp.addEventListener('click', () => {
            modalWsp.style.display = 'none';
        });
    }
    
    if (formWspDatos) {
        formWspDatos.addEventListener('submit', (e) => {
            e.preventDefault();

            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            let listaProductos = typeof productosData !== 'undefined' ? productosData : [];

            const nombre = document.getElementById('wsp-nombre').value;
            const sucursalSeleccionada = document.getElementById('wsp-sucursal').value;
            const entrega = document.getElementById('wsp-entrega').value;
            const zona = document.getElementById('wsp-zona').value;
            const empresaEnvio = document.getElementById('wsp-empresa-envio') ? document.getElementById('wsp-empresa-envio').value : '';
            const pago = document.getElementById('wsp-pago').value;
           
            // 📍 DICCIONARIO DE GERENTES
            const numerosGerentes = {
                "Puerto Ordaz - villa colombia": "5804249081574",    
                "Puerto Ordaz - Alta Vista": "5804249081574",  
                "puerto ordaz- unare": "5804121311937"         
            };

            const numeroDestino = numerosGerentes[sucursalSeleccionada] || numeroWhatsAppGlobal;

            // 📍 EMPAQUETAR TODOS LOS DATOS PARA LA ORDEN DE PEDIDO VISUAL
            const datosPedidoFactura = {
                fecha: new Date().toLocaleString(),
                sucursal: sucursalSeleccionada,
                cliente: nombre,
                entrega: entrega,
                zona: zona || 'N/A',
                empresaEnvio: empresaEnvio || 'N/A',
                pago: pago,
                productos: carrito
            };

            const jsonString = JSON.stringify(datosPedidoFactura);
            const datosCodificados = encodeURIComponent(jsonString);

            // Construcción del mensaje para WhatsApp
            let mensaje = `*¡Hola! Nuevo Pedido Web 🛒*\n`;
            mensaje += `📍 *Sucursal Destino:* ${sucursalSeleccionada}\n\n`;
            mensaje += `👤 *Cliente:* ${nombre}\n`;
            mensaje += `🚚 *Método de Entrega:* ${entrega}\n`;
            
            // Si es Envío Nacional, añadimos la empresa elegida y la agencia/dirección
            if (entrega === 'Envio Nacional') {
                mensaje += `📦 *Empresa de Envío:* ${empresaEnvio}\n`;
                mensaje += `📍 *Destino / Agencia:* ${zona}\n`;
            } else if (entrega === 'Delivery') {
                mensaje += `📍 *Zona / Sector:* ${zona}\n`;
            }

            mensaje += `💳 *Método de Pago:* ${pago}\n`;
            mensaje += `\n*Detalle del pedido:*\n`;

            let totalGeneralUsd = 0;
            carrito.forEach((item, index) => {
                let subtotal = item.precio * item.cantidad;
                totalGeneralUsd += subtotal;

                let detallesExtra = "";
                if (item.talla && item.talla !== 'N/A') detallesExtra += ` (Talla: ${item.talla})`;
                if (item.color && item.color !== 'N/A') detallesExtra += ` (Color: ${item.color})`;

                // Imprimimos cada producto limpio
                mensaje += `${index + 1}. *${item.nombre}* x${item.cantidad} - ${formatearPrecio(subtotal)}${detallesExtra}\n`;
            });

            // 💡 CÁLCULO DE AMBOS TOTALES (USD y VES) PARA EL MENSAJE FINAL
            const tasa = typeof tasaCambioBCV !== 'undefined' ? tasaCambioBCV : 36.50;
            const totalBs = totalGeneralUsd * tasa;
            const totalBsFormateado = totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            mensaje += `\n💰 *TOTAL A PAGAR:*\n`;
            mensaje += `• $${totalGeneralUsd.toFixed(2)} USD\n`;
            mensaje += `• Bs. ${totalBsFormateado}\n`;

            // 🔗 ENLACE DE LA ORDEN VISUAL
            let urlBase = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            let urlFacturaVisual = `${urlBase}/factura.html?data=${datosCodificados}`;
            
            mensaje += `\n🔗 *Ver orden visual y fotos:* ${urlFacturaVisual}\n`;
            mensaje += `\n¿Me confirman disponibilidad y métodos de pago?`;

            let mensajeCodificado = encodeURIComponent(mensaje);
            let urlWhatsApp = `https://wa.me/${numeroDestino}?text=${mensajeCodificado}`;

            window.location.href = urlWhatsApp;
            if (modalWsp) modalWsp.style.display = 'none';
        });
    }
});



// 9. Auto-ejecutar al cargar la página del carrito

document.addEventListener("DOMContentLoaded", () => {

    renderizarCarritoVisual();

}); 



// 10. Abrir el modal en modo edición desde el carrito
function abrirModalEdicion(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let item = carrito[index];
    
    if (!item) return;

    // Guardamos el índice actual en una variable global para que el render.js sepa qué elemento estamos editando
    window.indiceItemEnEdicion = index;

    // Llamamos a la función abrirModal que ya vive en el render.js usando el ID del producto
    if (typeof abrirModal === 'function') {
        abrirModal(item.id);
        
        // Opcional: Si el modal tiene un selector de talla o color, intentamos preseleccionar los que ya tenía el usuario
        setTimeout(() => {
            let selectTalla = document.getElementById('modal-select-talla');
            if (selectTalla && item.talla && item.talla !== 'N/A') {
                selectTalla.value = item.talla;
            }
            // Aquí puedes dejar que el usuario elija de nuevo o dejar el estado inicial
        }, 100);
    } else {
        console.error("No se encontró la función abrirModal");
    }
}

// 11. Guardar los cambios hechos en el modal al editar el carrito
function guardarEdicionCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let item = carrito[index];
    
    if (!item) return;

    // Capturar la nueva talla seleccionada
    const selectTalla = document.getElementById('modal-select-talla');
    let nuevaTalla = selectTalla ? selectTalla.value : (item.talla || 'N/A');

    // Capturar el nuevo color seleccionado
    let nuevoColor = window.colorSeleccionado || item.color || 'N/A';

    // Capturar la nueva foto que se muestra tras el cambio de color
    let imgElement = document.getElementById('modal-img');
    if (imgElement) {
        item.imagen = imgElement.src;
    }
    
    // Actualizamos las propiedades del item
    item.talla = nuevaTalla;
    item.color = nuevoColor;

    // Actualizamos el identificador único para que el carrito sepa que esta combinación es distinta si cambia
    if (item.id) {
        let sufijoTalla = (item.talla && item.talla !== 'N/A') ? `-${item.talla}` : '';
        let sufijoColor = (item.color && item.color !== 'N/A') ? `-${item.color}` : '';
        item.idUnico = item.id + sufijoTalla + sufijoColor;
    }

    // Guardamos en el localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Limpiamos la variable de edición global
    window.indiceItemEnEdicion = null;

    // Cerramos el modal y refrescamos la vista del carrito
    if (typeof cerrarModal === 'function') {
        cerrarModal();
    }
    renderizarCarritoVisual();
}

// para saber cuantos productos hay en el carrito 
function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Suma la cantidad total de piezas de todos los productos en el carrito
    let totalItems = carrito.reduce((acumulador, item) => acumulador + (item.cantidad || 1), 0);
    
    // 1. Actualizamos el badge del botón flotante
    const badgeFlotante = document.getElementById('contador-carrito-flotante');
    if (badgeFlotante) {
        badgeFlotante.textContent = totalItems;
        badgeFlotante.style.display = totalItems === 0 ? 'none' : 'inline-block';
    }

    // 2. Actualizamos el badge del menú lateral
    const badgeMenu = document.getElementById('contador-carrito-menu');
    if (badgeMenu) {
        badgeMenu.textContent = totalItems;
        badgeMenu.style.display = totalItems === 0 ? 'none' : 'inline-block';
    }

    // 3. ✨ NUEVO: Actualizamos el badge del header principal que acabamos de crear
    const badgeHeader = document.getElementById('contador-carrito-header');
    if (badgeHeader) {
        badgeHeader.textContent = totalItems;
        badgeHeader.style.display = totalItems === 0 ? 'none' : 'flex';
    }
}

// Ejecutar automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

function formatearPrecio(precioUsd) {
    const tasa = typeof tasaCambioBCV !== 'undefined' ? tasaCambioBCV : 36.50;
    const moneda = typeof monedaActual !== 'undefined' ? monedaActual : 'USD';
    
    if (moneda === 'VES') {
        const bs = precioUsd * tasa;
        return `Bs. ${bs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
        return `$${precioUsd.toFixed(2)}`;
    }
}