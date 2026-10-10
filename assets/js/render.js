document.addEventListener('DOMContentLoaded', () => {
    const barraEnvios = document.getElementById('barra-envios'); 
    const seccionLooks = document.getElementById('seccion-looks');
    const seccionIdeasLooks = document.querySelectorAll('.seccion-ideas-looks');
    const bannerLogoPrincipal = document.getElementById('banner-logo-principal'); 
    const billboard = document.getElementById('billboard-principal');
    const segundoBillboard = document.getElementById('billboard-segundo'); 
    const seccionCategorias = document.getElementById('seccion-categorias-destacadas'); // 👈 Capturamos el nuevo carrusel
    const tituloSeccion = document.getElementById('titulo-seccion-principal') || document.querySelector('section > header.major > h2');
    const seccionComfort = document.querySelectorAll('.seccion-comfort');
    // Leer qué categoría viene en la URL
    const params = new URLSearchParams(window.location.search);
    const categoriaFiltro = params.get('cat');

    // Capturar elementos de la Interfaz
    const contDama = document.getElementById('contenedor-dama-camisas');
    const btnVerTodoDama = document.getElementById('contenedor-btn-ver-todo');


// --- SOLUCIÓN DEFINITIVA PARA ACORDEÓN MULTINIVEL EN EL MENÚ ---
    setTimeout(() => {
        if (typeof $ !== 'undefined') {
            // 1. Desactivar el evento global original de la plantilla en los openers
            $('#menu .opener').off('click');

            // 2. Crear nuestro propio evento seguro con stopPropagation
            $('#menu').on('click', '.opener', function(e) {
                e.preventDefault();
                e.stopPropagation(); // ¡Esto es lo que frena el cierre global!

                const $this = $(this);
                $this.toggleClass('active');
                $this.parent().toggleClass('active');
                $this.next('ul').slideToggle(300);
            });
        }
    }, 400);


    // Diccionario de títulos para la tienda
    const nombresCategorias = {
        "camisas": "👕 Camisas y Ropa",
        "caballero": "👔 Catálogo para Caballero",
        "caballero-camisas": "👔 Camisas de Caballero",
        "caballero-zapatos": "👞 Zapatos de Caballero",
        "caballero-sueteres": "🧥 Suéteres de Caballero",
        "caballero-accesorios": "🕶️ Accesorios de Caballero",
        "caballero-ofertas": "🔥 Ofertas Exclusivas para Caballero",
        // DAMA GENERAL
        "dama": "👗 Catálogo para Dama",
        "dama-ofertas": "🔥 Ofertas Exclusivas para Dama",

        // ROPA SUPERIOR
        "dama-camisas": "👚 Camisas y Blusas de Dama",
        "dama-top": "👕 Tops y T-Shirts de Dama",
        "dama-chaquetas": "🧥 Chaquetas de Dama",
        "dama-chalecos": "🦺 Chalecos de Dama",

        // ROPA INFERIOR Y PIEZAS COMPLETAS
        "dama-pantalones": "👖 Pantalones de Dama",
        "dama-vestidos": "👗 Vestidos de Dama",
        "dama-conjuntos": "✨ Conjuntos y Sets de Dama",
        "dama-faldas": "💃 Faldas de Dama",
        "dama-bragas": "🩱 Bragas y Jumpsuits de Dama",

        // CALZADO Y MARROQUINERÍA
        "dama-calzado": "👠 Calzado de Dama",
        "dama-carteras": "👜 Carteras de Dama",
        "dama-monederos": "👛 Monederos y Billeteras de Dama",

        // ACCESORIOS Y BELLEZA
        "dama-accesorios": "💎 Accesorios y Joyería de Dama",
        "dama-lentes": "🕶️ Lentes de Dama",
        "dama-relojes": "⌚ Relojes de Dama",
        "dama-perfumeria": "✨ Perfumería de Dama",
        "todos": "📦 Catálogo Completo"
    };

    // Función global para pintar productos en un contenedor específico
    window.renderizarProductosEnContenedor = function(idContenedor, lista) {
        const contenedor = document.getElementById(idContenedor);
        if (!contenedor) return;

        contenedor.innerHTML = "";
        
        if (!lista || lista.length === 0) {
            contenedor.innerHTML = "<p style='padding: 20px; text-align: center;'>No hay productos disponibles por el momento.</p>";
            return;
        }

        lista.forEach(prod => {
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
                    ${etiquetaDescuento}
                    <img src="${prod.imagen}" alt="${prod.nombre}" />
                </a>
                <h3><a href="javascript:void(0)" onclick="abrirModal('${prod.id}')" style="text-decoration:none; color:inherit;">${prod.nombre}</a></h3>
                <p class="precio-producto">${htmlPrecio}</p>
            `;
            contenedor.appendChild(article);
        });
    };

    // FUNCIÓN PUENTE: Activa el modo de búsqueda SOLO si se ejecuta activamente una búsqueda con texto
    window.mostrarProductos = function(lista) {
        const inputBusqueda = document.getElementById('query');
        const hayBusquedaActiva = inputBusqueda && inputBusqueda.value.trim().length > 0;

        if (!hayBusquedaActiva && (!categoriaFiltro || categoriaFiltro === "todos")) {
            return;
        }
        document.querySelectorAll('.seccion-ideas-looks').forEach(sec => {
            sec.style.setProperty('display', 'none', 'important');
        });

        document.querySelectorAll('.seccion-comfort').forEach(sec => {
            sec.style.setProperty('display', 'none', 'important');
        });

       if (seccionLooks) seccionLooks.style.setProperty('display', 'none', 'important');
        if (billboard) billboard.style.display = 'none';
        if (segundoBillboard) segundoBillboard.style.display = 'none';
        if (seccionCategorias) seccionCategorias.style.setProperty('display', 'none', 'important'); // 👈 Se oculta en búsqueda
        if (btnVerTodoDama) btnVerTodoDama.style.setProperty('display', 'none', 'important');
        if (tituloSeccion) tituloSeccion.textContent = "🔍 Resultados de búsqueda";

        window.renderizarProductosEnContenedor('contenedor-dama-camisas', lista);
    };

    // --- LÓGICA DE CARGA INICIAL DE LA PÁGINA ---
    const esPaginaInicio = !categoriaFiltro || categoriaFiltro === "todos" || categoriaFiltro === "todo";

    if (esPaginaInicio) {
        // VISTA PÁGINA PRINCIPAL (HOME)
        document.querySelectorAll('.seccion-ideas-looks').forEach(sec => {
            sec.style.setProperty('display', 'block', 'important');
        });

        document.querySelectorAll('.seccion-comfort').forEach(sec => {
            sec.style.setProperty('display', 'block', 'important'); // 👈 Se muestra en el Home
        });

       if (seccionLooks) seccionLooks.style.setProperty('display', 'block', 'important');
        if (barraEnvios) barraEnvios.style.setProperty('display', 'block', 'important');
        if (bannerLogoPrincipal) bannerLogoPrincipal.style.setProperty('display', 'block', 'important');
        if (billboard) billboard.style.display = 'block';
        if (segundoBillboard) segundoBillboard.style.display = 'block';
        if (seccionCategorias) seccionCategorias.style.setProperty('display', 'block', 'important'); // 👈 Se muestra en el Home
        if (btnVerTodoDama) btnVerTodoDama.style.setProperty('display', 'block', 'important');
        document.body.classList.add('pagina-inicio');

        if (tituloSeccion) tituloSeccion.textContent = "👗 Lo Mejor para Dama";

        if (contDama && typeof productosData !== 'undefined') {
            let prodsDama = productosData.filter(p => p.categoria && p.categoria.toLowerCase().includes("dama"));
            window.renderizarProductosEnContenedor('contenedor-dama-camisas', prodsDama);
        }
    } else {
        // VISTA DE CATEGORÍA ESPECÍFICA
        if (barraEnvios) barraEnvios.style.setProperty('display', 'none', 'important');
        if (bannerLogoPrincipal) bannerLogoPrincipal.style.setProperty('display', 'none', 'important');
        if (billboard) billboard.style.display = 'none';
        if (segundoBillboard) segundoBillboard.style.display = 'none';
        if (seccionCategorias) seccionCategorias.style.setProperty('display', 'none', 'important'); // 👈 Se oculta en categorías
        if (btnVerTodoDama) btnVerTodoDama.style.setProperty('display', 'none', 'important');
        document.body.classList.remove('pagina-inicio');

        const catLimpia = categoriaFiltro.toLowerCase().trim();
        let productosAMostrar = typeof productosData !== 'undefined' ? productosData : [];

        if (catLimpia === "ofertas") {
            productosAMostrar = productosData.filter(p => p.precioTachado || p.categoria === "ofertas");
        } else {
            productosAMostrar = productosData.filter(p => {
                if (!p.categoria) return false;
                const catProd = p.categoria.toLowerCase();

                if (catLimpia.endsWith("-ofertas")) {
                    const categoriaBase = catLimpia.replace("-ofertas", "");
                    return (catProd === categoriaBase || catProd.startsWith(categoriaBase + "-")) && (p.precioTachado || p.categoria === "ofertas");
                }

                return catProd === catLimpia || catProd.startsWith(catLimpia + "-");
            });
        }

        // Cambiar título según la categoría activa
        if (tituloSeccion) {
            if (nombresCategorias[catLimpia]) {
                tituloSeccion.textContent = nombresCategorias[catLimpia];
            } else {
                tituloSeccion.textContent = "Catálogo de " + categoriaFiltro.charAt(0).toUpperCase() + categoriaFiltro.slice(1);
            }
        }

        // Pintar productos en la pantalla
        window.renderizarProductosEnContenedor('contenedor-dama-camisas', productosAMostrar);
    }
});


// --- LÓGICA DEL MODAL DE DETALLES Y MINIATURAS ---
function abrirModal(id) {
    window.colorSeleccionado = null; 
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
    const nuevoBtnComprar = btnComprar.cloneNode(true);
    btnComprar.parentNode.replaceChild(nuevoBtnComprar, btnComprar);

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
    window.indiceItemEnEdicion = null; 
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal-producto');
    const btnCerrar = document.getElementById('cerrar-modal');
    if (modal && (e.target === modal || e.target === btnCerrar)) {
        cerrarModal();
    }
});

// --- LÓGICA AUTOMÁTICA PARA EL SHOP THE LOOK (AL HACER CLIC) ---
window.toggleLookPopup = function(btn, event) {
    event.stopPropagation();
    const popupActual = btn.nextElementSibling;
    if (!popupActual) return;

    // Obtener el ID del producto desde el botón
    const productId = btn.getAttribute('data-product-id');

    // Buscar el producto en productosData en tiempo real
    if (typeof productosData !== 'undefined' && productosData) {
        const producto = productosData.find(p => String(p.id).trim() === String(productId).trim());

        if (producto) {
            // Pintar la tarjeta usando clases de CSS limpias
            popupActual.innerHTML = `
                <a href="javascript:void(0)" onclick="abrirModal('${producto.id}')">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="look-popup-img">
                    <h4 class="look-popup-title">${producto.nombre}</h4>
                    <p class="look-popup-precio">$${producto.precio}</p>
                </a>
            `;
        } else {
            popupActual.innerHTML = `<p class="look-popup-error">Producto no encontrado (${productId})</p>`;
        }
    }

    // Cierra todos los demás popups
    document.querySelectorAll('.look-popup').forEach(p => {
        if (p !== popupActual) p.classList.remove('active');
    });

    // Alterna el actual
    popupActual.classList.toggle('active');
};

// Cerrar al hacer clic fuera
document.addEventListener('click', () => {
    document.querySelectorAll('.look-popup').forEach(p => p.classList.remove('active'));
});