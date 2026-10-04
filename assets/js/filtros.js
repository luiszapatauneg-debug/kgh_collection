document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaActiva = urlParams.get("cat");
    const panelFiltros = document.getElementById("panel-filtros-categoria");

    if (panelFiltros) {
        if (categoriaActiva && categoriaActiva !== "ofertas") {
            panelFiltros.style.display = "block";
        } else {
            panelFiltros.style.display = "none";
        }
    }

    const selectPrecio = document.getElementById("filtro-precio");
    const selectMarca = document.getElementById("filtro-marca");
    const selectColor = document.getElementById("filtro-color");

    // Función unificada y blindada para calcular productos según la categoría de la URL
    const obtenerListaPorCategoria = () => {
        if (typeof productosData === "undefined") return [];
        let lista = productosData;

        if (!categoriaActiva || categoriaActiva === "todo" || categoriaActiva === "todos") {
            return lista;
        }

        const catLimpia = categoriaActiva.toLowerCase().trim();

        if (catLimpia === "ofertas") {
            return productosData.filter(p => p.precioTachado || p.categoria === "ofertas");
        } 
        
        // 🍾 Licores Generales (Rones, Whiskeys, Cervezas, Vinos)
        if (catLimpia === "licores") {
            const licoresValidos = ["rones", "whiskeys", "cervezas", "vinos"];
            return productosData.filter(p => p.categoria && licoresValidos.includes(p.categoria.toLowerCase()));
        } 
        
        // 🔥 Licores en Oferta (Ej: licores-ofertas)
        if (catLimpia === "licores-ofertas") {
            const licoresValidos = ["rones", "whiskeys", "cervezas", "vinos"];
            return productosData.filter(p => p.categoria && licoresValidos.includes(p.categoria.toLowerCase()) && (p.precioTachado || p.categoria === "ofertas"));
        }

        // Subcategorías de ofertas (Ej: caballero-ofertas, dama-ofertas, etc.)
        if (catLimpia.endsWith("-ofertas")) {
            const categoriaBase = catLimpia.replace("-ofertas", "");
            return productosData.filter(p => {
                if (!p.categoria) return false;
                const catProd = p.categoria.toLowerCase();
                return (catProd === categoriaBase || catProd.startsWith(categoriaBase + "-")) && (p.precioTachado || p.categoria === "ofertas");
            });
        }

        // Categorías estándar generales
        return productosData.filter(p => {
            if (!p.categoria) return false;
            const catProd = p.categoria.toLowerCase();
            return catProd === catLimpia || catProd.startsWith(catLimpia + "-");
        });
    };

    if (selectPrecio && selectMarca && selectColor) {
        const ejecutarFiltros = () => {
            const precioVal = selectPrecio.value;
            const marcaVal = selectMarca.value.toLowerCase();
            const colorVal = selectColor.value.toLowerCase();

            if (typeof productosData === "undefined") return;

            let lista = obtenerListaPorCategoria();

            // Actualizamos los selects de marcas y colores dinámicamente
            actualizarOpcionesFiltros(lista);

            const filtradosFinales = lista.filter(prod => {
                let cumplePrecio = true;
                if (precioVal === "ofertas") {
                    cumplePrecio = prod.precioTachado || prod.categoria === "ofertas";
                }
                if (precioVal === "bajo") cumplePrecio = prod.precio < 20;
                if (precioVal === "medio") cumplePrecio = prod.precio >= 20 && prod.precio <= 50;
                if (precioVal === "alto") cumplePrecio = prod.precio > 50;

                let cumpleMarca = true;
                if (marcaVal !== "todas") {
                    cumpleMarca = prod.marca && prod.marca.toLowerCase() === marcaVal;
                }

                let cumpleColor = true;
                if (colorVal !== "todos") {
                    let coincideColorSimple = prod.color && prod.color.toLowerCase() === colorVal;
                    let coincideEnArray = prod.colores && prod.colores.some(c => c.nombre.toLowerCase() === colorVal);
                    cumpleColor = coincideColorSimple || coincideEnArray;
                }

                return cumplePrecio && cumpleMarca && cumpleColor;
            });

            if (typeof mostrarProductos === 'function') {
                mostrarProductos(filtradosFinales);
            }
        };

        // Carga inicial al abrir la página de categoría
        let listaInicial = obtenerListaPorCategoria();
        actualizarOpcionesFiltros(listaInicial);
        
        if (typeof mostrarProductos === 'function') {
            mostrarProductos(listaInicial);
        }

        selectPrecio.addEventListener("change", ejecutarFiltros);
        selectMarca.addEventListener("change", ejecutarFiltros);
        selectColor.addEventListener("change", ejecutarFiltros);
    }
});

// --- FUNCIÓN DE ACTUALIZACIÓN DINÁMICA DE SELECTS ---
function actualizarOpcionesFiltros(listaActual) {
    const selectMarca = document.getElementById("filtro-marca");
    const selectColor = document.getElementById("filtro-color");

    if (!selectMarca || !selectColor) return;

    const marcaActualSeleccionada = selectMarca.value;
    const colorActualSeleccionado = selectColor.value;

    const marcasUnicas = [...new Set(
        listaActual
            .filter(p => p.marca)
            .map(p => p.marca.trim())
    )].sort();

    const coloresSet = new Set();
    listaActual.forEach(p => {
        if (p.color) coloresSet.add(p.color.trim().toLowerCase());
        if (p.colores && Array.isArray(p.colores)) {
            p.colores.forEach(c => {
                if (c.nombre) coloresSet.add(c.nombre.trim().toLowerCase());
            });
        }
    });
    const coloresUnicos = [...coloresSet].sort();

    selectMarca.innerHTML = `<option value="todas">Todas las marcas</option>`;
    marcasUnicas.forEach(marca => {
        const marcaFormateada = marca.charAt(0).toUpperCase() + marca.slice(1);
        selectMarca.innerHTML += `<option value="${marca}">${marcaFormateada}</option>`;
    });

    selectColor.innerHTML = `<option value="todos">Todos los colores</option>`;
    coloresUnicos.forEach(color => {
        const colorFormateado = color.charAt(0).toUpperCase() + color.slice(1);
        selectColor.innerHTML += `<option value="${color}">${colorFormateado}</option>`;
    });

    if ([...selectMarca.options].some(opt => opt.value === marcaActualSeleccionada)) {
        selectMarca.value = marcaActualSeleccionada;
    }
    if ([...selectColor.options].some(opt => opt.value === colorActualSeleccionado)) {
        selectColor.value = colorActualSeleccionado;
    }
}

// --- LÓGICA DEL PANEL DESPLEGABLE DE FILTROS ---
document.addEventListener("DOMContentLoaded", function() {
    const btnToggle = document.getElementById("btn-toggle-filtros");
    const cajaSelects = document.getElementById("caja-selects-filtros");
    const iconoFlecha = document.getElementById("icono-flecha");

    if (btnToggle && cajaSelects) {
        btnToggle.addEventListener("click", function() {
            if (cajaSelects.style.display === "none" || cajaSelects.style.display === "") {
                cajaSelects.style.display = "block";
                if (iconoFlecha) iconoFlecha.textContent = "▲";
            } else {
                cajaSelects.style.display = "none";
                if (iconoFlecha) iconoFlecha.textContent = "▼";
            }
        });
    }
});