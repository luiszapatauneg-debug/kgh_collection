document.addEventListener('DOMContentLoaded', () => {
    const billboard = document.getElementById('billboard-principal');
    const segundoBillboard = document.getElementById('billboard-segundo'); 
    const tituloSeccion = document.getElementById('titulo-seccion-principal') || document.querySelector('section > header.major > h2');

    // Leer qué categoría viene en la URL
    const params = new URLSearchParams(window.location.search);
    const categoriaFiltro = params.get('cat');

    // Capturar elementos de la Interfaz
    const contDama = document.getElementById('contenedor-dama-camisas');
    const btnVerTodoDama = document.getElementById('contenedor-btn-ver-todo');

    // Diccionario de títulos para la tienda
    const nombresCategorias = {
        "camisas": "👕 Camisas y Ropa",
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

        // Si no hay texto en el buscador, no alteramos el Home en el inicio
        if (!hayBusquedaActiva && (!categoriaFiltro || categoriaFiltro === "todos")) {
            return;
        }

        if (billboard) billboard.style.display = 'none';
        if (segundoBillboard) segundoBillboard.style.display = 'none';
        if (btnVerTodoDama) btnVerTodoDama.style.setProperty('display', 'none', 'important');
        if (tituloSeccion) tituloSeccion.textContent = "🔍 Resultados de búsqueda";

        window.renderizarProductosEnContenedor('contenedor-dama-camisas', lista);
    };

    // --- LÓGICA DE CARGA INICIAL DE LA PÁGINA ---
    const esPaginaInicio = !categoriaFiltro || categoriaFiltro === "todos" || categoriaFiltro === "todo";

    if (esPaginaInicio) {
        // VISTA PÁGINA PRINCIPAL (HOME)
        if (billboard) billboard.style.display = 'block';
        if (segundoBillboard) segundoBillboard.style.display = 'block';
        if (btnVerTodoDama) btnVerTodoDama.style.setProperty('display', 'block', 'important');
        document.body.classList.add('pagina-inicio');

        if (tituloSeccion) tituloSeccion.textContent = "👗 Lo Mejor para Dama";

        if (contDama && typeof productosData !== 'undefined') {
            let prodsDama = productosData.filter(p => p.categoria && p.categoria.toLowerCase().includes("dama"));
            window.renderizarProductosEnContenedor('contenedor-dama-camisas', prodsDama);
        }
    } else {
        // VISTA DE CATEGORÍA ESPECÍFICA
        if (billboard) billboard.style.display = 'none';
        if (segundoBillboard) segundoBillboard.style.display = 'none';
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