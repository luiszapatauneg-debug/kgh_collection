document.addEventListener('DOMContentLoaded', () => {
    const billboard = document.getElementById('billboard-principal');
    const segundoBillboard = document.getElementById('billboard-segundo'); // 👈 Tu segundo billboard
    const tituloSeccion = document.querySelector('section > header.major > h2');

    // 1. Leer qué categoría viene en la URL
    const params = new URLSearchParams(window.location.search);
    const categoriaFiltro = params.get('cat');

    // Capturar elementos de la Interfaz
    const seccionesHome = document.querySelectorAll('.seccion-carrusel-home');
    const contenedorOfertas = document.getElementById('contenedor-ofertas');
    const contCaballero = document.getElementById('contenedor-caballero-camisas');
    const contDama = document.getElementById('contenedor-dama-camisas');
    const btnVerMasOfertas = document.getElementById('seccion-ver-mas');

    // --- MOSTRAR U OCULTAR SEGÚN LA PÁGINA ---
    if (!categoriaFiltro || categoriaFiltro === "todos" || categoriaFiltro === "todo") {
        if (billboard) billboard.style.display = 'block';
        if (segundoBillboard) segundoBillboard.style.display = 'block'; // 👈 Lo muestra en el home
        document.body.classList.add('pagina-inicio');
        
        // Mostrar todas las secciones del Home
        seccionesHome.forEach(sec => sec.style.display = 'block');
        if (btnVerMasOfertas) btnVerMasOfertas.style.display = 'block';
    } else {
        if (billboard) billboard.style.display = 'none';
        if (segundoBillboard) segundoBillboard.style.display = 'none'; // 👈 Lo oculta en las categorías
        document.body.classList.remove('pagina-inicio');

        // Ocultar los carruseles múltiples del Home para que no estorben en categorías
        seccionesHome.forEach(sec => sec.style.display = 'none');
        if (btnVerMasOfertas) btnVerMasOfertas.style.display = 'none';
    }

    // Diccionario de títulos para la tienda
    const nombresCategorias = {
        "rones": "🍾 Rones y Bebidas",
        "cervezas": "🍻 Cervezas",
        "vinos": "🍷 Vinos",
        "whiskeys": "🥃 Whiskeys",
        "camisas": "👕 Camisas y Ropa",
        "licores": "📦 Catálogo de Licores",
        "caballero": "👔 Catálogo para Caballero",
        "caballero-camisas": "👔 Camisas de Caballero",
        "caballero-zapatos": "👞 Zapatos de Caballero",
        "caballero-sueteres": "🧥 Suéteres de Caballero",
        "caballero-accesorios": "🕶️ Accesorios de Caballero",
        "caballero-ofertas": "🔥 Ofertas Exclusivas para Caballero",
        "dama": "👗 Catálogo para Dama",
        "dama-camisas": "👚 Blusas y Camisas de Dama",
        "dama-zapatos": "👠 Zapatos de Dama",
        "dama-sueteres": "🧥 Suéteres de Dama",
        "dama-accesorios": "👜 Accesorios de Dama",
        "dama-ofertas": "🔥 Ofertas Exclusivas para Dama",
        "licores-ofertas": "🔥 Ofertas Destacadas de licores",
        "todos": "📦 Catálogo Completo"
    };

    /// 2. Poner el título principal según la categoría (Solo si NO estamos en el carrito)
    if (tituloSeccion && !window.location.pathname.includes('carrito.html')) {
        const catBusqueda = categoriaFiltro ? categoriaFiltro.toLowerCase() : "";
        
        if (catBusqueda && nombresCategorias[catBusqueda]) {
            tituloSeccion.textContent = nombresCategorias[catBusqueda];
        } else if (!catBusqueda || catBusqueda === "todos") {
            tituloSeccion.textContent = "🔥 Ofertas Destacadas y Disponibles";
        } else {
            tituloSeccion.textContent = "Catálogo de " + categoriaFiltro.charAt(0).toUpperCase() + categoriaFiltro.slice(1);
        }
    }

   // 3. Función global para pintar productos en un contenedor específico
    window.renderizarProductosEnContenedor = function(idContenedor, lista) {
        const contenedor = document.getElementById(idContenedor);
        if (!contenedor) return;

        contenedor.innerHTML = "";
        
        if (lista.length === 0) {
            contenedor.innerHTML = "<p>No hay productos disponibles por el momento.</p>";
            return;
        }

        lista.forEach(prod => {
            // 🏷️ NUEVO: Calculamos y creamos la etiqueta de descuento flotante
            let etiquetaDescuento = "";
            if (prod.precioTachado && prod.precioTachado > prod.precio) {
                let descuento = Math.round(100 - (prod.precio * 100) / prod.precioTachado);
                etiquetaDescuento = `<span class="badge-descuento">-${descuento}%</span>`;
            }

            let htmlPrecio = prod.precioTachado
                ? `Precio normal: <span class="precio-tachado">$${prod.precioTachado}</span> <span class="precio-oferta">¡Oferta: $${prod.precio}!</span>`
                : `Precio: <span class="precio-normal">$${prod.precio}</span>`;

           let article = document.createElement('article');
            article.innerHTML = `
                <a href="javascript:void(0)" class="image" onclick="abrirModal('${prod.id}')">
                    ${etiquetaDescuento} <!-- 👈 Aquí se pinta la etiqueta en la esquina -->
                    <img src="${prod.imagen}" alt="${prod.nombre}" />
                </a>
                <h3><a href="javascript:void(0)" onclick="abrirModal('${prod.id}')" style="text-decoration:none; color:inherit;">${prod.nombre}</a></h3>
                <p class="precio-producto">${htmlPrecio}</p>
            `;
            contenedor.appendChild(article);
        });
    };

    // 4. FUNCIÓN PUENTE: Para que el buscador y los filtros usen el contenedor principal
    window.mostrarProductos = function(lista) {
        window.renderizarProductosEnContenedor('contenedor-ofertas', lista);
    };

   if (categoriaFiltro) {
        // --- VISTA DE CATEGORÍA ESPECÍFICA ---
        const catLimpia = categoriaFiltro.toLowerCase().trim();
        let productosAMostrar = productosData;
if (catLimpia === "ofertas") {
            productosAMostrar = productosData.filter(p => p.precioTachado || p.categoria === "ofertas");
        } else if (catLimpia === "todo" || catLimpia === "todos") {
            productosAMostrar = productosData;
        } else if (catLimpia === "licores") {
            // 🍾 Muestra TODOS los licores (rones, whiskeys, cervezas, vinos)
            const licoresValidos = ["rones", "whiskeys", "cervezas", "vinos"];
            productosAMostrar = productosData.filter(p => p.categoria && licoresValidos.includes(p.categoria.toLowerCase()));
        } else if (catLimpia === "licores-ofertas") {
            // 🔥 Muestra ÚNICAMENTE los licores que están en oferta
            const licoresValidos = ["rones", "whiskeys", "cervezas", "vinos"];
            productosAMostrar = productosData.filter(p => p.categoria && licoresValidos.includes(p.categoria.toLowerCase()) && (p.precioTachado || p.categoria === "ofertas"));
        } else {
            // 🌟 NUEVO: Detecta si piden ofertas de una categoría (ej: "caballero-ofertas")
            productosAMostrar = productosData.filter(p => {
                if (!p.categoria) return false;
                const catProd = p.categoria.toLowerCase();

                if (catLimpia.endsWith("-ofertas")) {
                    const categoriaBase = catLimpia.replace("-ofertas", "");
                    return (catProd === categoriaBase || catProd.startsWith(categoriaBase + "-")) && (p.precioTachado || p.categoria === "ofertas");
                }

                // Comportamiento normal para categorías estándar o subcategorías
                return catProd === catLimpia || catProd.startsWith(catLimpia + "-");
            });
        }

        // Forzamos que la sección de ofertas aparezca SOLO para mostrar los resultados de la categoría
        const seccionContenedorOfertas = contenedorOfertas ? contenedorOfertas.closest('section') : null;
        if (seccionContenedorOfertas) {
            seccionContenedorOfertas.style.display = 'block';
        }

        if (contenedorOfertas) {
            window.renderizarProductosEnContenedor('contenedor-ofertas', productosAMostrar);
        }

    
    } else {
        // --- VISTA DE LA PÁGINA PRINCIPAL (HOME CON MÚLTIPLES CARRUSELES) ---
        
        // Asegurar que las secciones del Home estén visibles
        seccionesHome.forEach(sec => sec.style.display = 'block');

        // 1. Carrusel de Ofertas (Inicio)
        if (contenedorOfertas) {
            let ofertasInicio = productosData.filter(p => p.precioTachado || p.categoria === "ofertas");
            window.renderizarProductosEnContenedor('contenedor-ofertas', ofertasInicio.slice(0, 4));
        }

        // 2. Carrusel exclusivo para Caballero
        if (contCaballero) {
            let prodsCaballero = productosData.filter(p => p.categoria && p.categoria.toLowerCase().includes("caballero"));
            window.renderizarProductosEnContenedor('contenedor-caballero-camisas', prodsCaballero.slice(0, 4));
        }

        // 3. Carrusel exclusivo para Dama
        if (contDama) {
            let prodsDama = productosData.filter(p => p.categoria && p.categoria.toLowerCase().includes("dama"));
            window.renderizarProductosEnContenedor('contenedor-dama-camisas', prodsDama.slice(0, 4));
        }

        if (btnVerMasOfertas) btnVerMasOfertas.style.display = 'block';
    }
});


// --- LÓGICA DEL MODAL DE DETALLES Y MINIATURAS ---
function abrirModal(id) {
    window.colorSeleccionado = null; // <-- Resetea el color al abrir el modal
    const producto = productosData.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('modal-img').src = producto.imagen;
    document.getElementById('modal-titulo').textContent = producto.nombre;
    document.getElementById('modal-descripcion').textContent = producto.descripcion;
   
    let htmlDetalles = producto.detalles ? producto.detalles.map(det => `<li>${det}</li>`).join('') : '';
    document.getElementById('modal-detalles').innerHTML = htmlDetalles;
   
    let htmlPrecio = producto.precioTachado
        ? `Precio normal: <span class="precio-tachado">$${producto.precioTachado}</span> <span class="precio-oferta">¡Oferta: $${producto.precio}!</span>`
        : `Precio: $${producto.precio}`;
    document.getElementById('modal-precio').innerHTML = htmlPrecio;

    const existingSelectors = document.getElementById('selector-opciones-dinamico');
    if (existingSelectors) existingSelectors.remove();

    let opcionesHTML = `<div id="selector-opciones-dinamico" style="margin: 15px 0;">`;

    if (producto.tallas && producto.tallas.length > 0) {
        opcionesHTML += `
            <div style="margin-bottom:10px;">
                <label><strong>Talla:</strong></label>
                <select id="modal-select-talla" style="width:100%; padding:8px; margin-top:5px;">
                    ${producto.tallas.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
            </div>`;
    }

   if (producto.colores && producto.colores.length > 0) {
        opcionesHTML += `
            <div style="margin-bottom:10px;">
                <label><strong>Color:</strong></label>
                <div id="modal-select-color" style="display:flex; gap:10px; margin-top:5px;">
                    ${producto.colores.map(c => `
                        <div class="color-circle" data-color="${c.nombre}" 
                             style="width:30px; height:30px; border-radius:50%; background-color:${c.hex}; border:2px solid #ccc; cursor:pointer;"
                             onclick="marcarColor(this, '${c.nombre}', '${c.foto}')"
                             title="${c.nombre}">
                        </div>
                    `).join('')}
                </div>
            </div>`;
   }
    opcionesHTML += `</div>`;
    document.getElementById('modal-descripcion').insertAdjacentHTML('afterend', opcionesHTML);

    const contenedorMiniaturas = document.getElementById('modal-miniaturas');
    if (contenedorMiniaturas) {
        contenedorMiniaturas.innerHTML = '';
        if (producto.fotosExtras && producto.fotosExtras.length > 0) {
            producto.fotosExtras.forEach(foto => {
                const imgMini = document.createElement('img');
                imgMini.src = foto;
                imgMini.style.width = '60px';
                imgMini.style.height = '60px';
                imgMini.style.objectFit = 'cover';
                imgMini.style.borderRadius = '6px';
                imgMini.style.cursor = 'pointer';
                imgMini.onclick = () => { document.getElementById('modal-img').src = foto; };
                contenedorMiniaturas.appendChild(imgMini);
            });
        }
    }

  const btnComprar = document.getElementById('modal-btn-comprar');
    // Limpiamos eventos anteriores para evitar duplicados
    const nuevoBtnComprar = btnComprar.cloneNode(true);
    btnComprar.parentNode.replaceChild(nuevoBtnComprar, btnComprar);

    // 🟢 AQUí VALIDAMOS SI VENIMOS A EDITAR DESDE EL CARRITO
    if (window.indiceItemEnEdicion !== null && window.indiceItemEnEdicion !== undefined) {
        let indiceActual = window.indiceItemEnEdicion;
        nuevoBtnComprar.textContent = "Guardar Cambios 💾";
        nuevoBtnComprar.onclick = (e) => {
            e.preventDefault();
            if (typeof guardarEdicionCarrito === 'function') {
                guardarEdicionCarrito(indiceActual);
            } else {
                console.error("Falta la función guardarEdicionCarrito");
            }
        };
    } else {
        // Comportamiento normal de compra desde el catálogo
        nuevoBtnComprar.textContent = "Agregar 🛒";
        nuevoBtnComprar.onclick = () => {
            const talla = document.getElementById('modal-select-talla') ? document.getElementById('modal-select-talla').value : null;
            
            let colorElegido = window.colorSeleccionado;
            if (!colorElegido && producto.colores && producto.colores.length > 0) {
                const circuloMarcado = document.querySelector('.color-circle[style*="border-color: rgb(0, 0, 0)"]') || document.querySelector('.color-circle[style*="border-color: #000"]');
                colorElegido = circuloMarcado ? circuloMarcado.getAttribute('data-color') : producto.colores[0].nombre;
            }

            agregarAlCarritoPorId(producto.id, talla, colorElegido); 
            cerrarModal();
        };
    }

    document.getElementById('modal-producto').style.display = 'flex';
}

window.marcarColor = function(elemento, nombreColor, fotoColor) {
    window.colorSeleccionado = nombreColor;
    document.querySelectorAll('.color-circle').forEach(el => el.style.borderColor = '#ccc');
    elemento.style.borderColor = '#000'; 

    if (fotoColor) {
        document.getElementById('modal-img').src = fotoColor;
    }
};

function cerrarModal() {
    document.getElementById('modal-producto').style.display = 'none';
    window.indiceItemEnEdicion = null; // 👈 Importante para limpiar el estado de edición
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal-producto');
    const btnCerrar = document.getElementById('cerrar-modal');
    if (modal && (e.target === modal || e.target === btnCerrar)) {
        cerrarModal();
    }
});
