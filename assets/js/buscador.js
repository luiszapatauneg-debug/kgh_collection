document.addEventListener('DOMContentLoaded', () => {
    const inputBusqueda = document.getElementById('query');
    const tituloSeccion = document.querySelector('section > header.major > h2');
    const formulario = inputBusqueda ? inputBusqueda.closest('form') : null;

    if (!inputBusqueda) return;

    // Función auxiliar para cerrar el menú visual
    function cerrarMenuBusqueda() {
        inputBusqueda.blur();
        const panelBusqueda = inputBusqueda.closest('.search-panel, #searchPanel, .search-modal, form');
        if (panelBusqueda) {
            panelBusqueda.classList.remove('active', 'visible', 'open');
        }
        document.body.classList.remove('search-visible', 'is-search-visible');
    }

    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            cerrarMenuBusqueda();
        });
    }

    inputBusqueda.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            cerrarMenuBusqueda();
        }
    });

    // --- LÓGICA DE BÚSQUEDA ---
    inputBusqueda.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();
        
        // Elementos a controlar para evitar el "bug" visual
        const billboard = document.getElementById('billboard-principal');
        const contenedorCamisas = document.getElementById('contenedor-camisas');
        const seccionCamisas = contenedorCamisas ? contenedorCamisas.closest('section') : null;
        const btnVerMasOfertas = document.getElementById('seccion-ver-mas');
        const btnVerMasCamisas = document.getElementById('seccion-ver-mas-camisas');

        // 1. SI ESTÁ VACÍO: Restaurar vista original
        if (termino === "") {
            if (billboard) billboard.style.display = 'block';
            if (seccionCamisas) seccionCamisas.style.display = 'block';
            if (btnVerMasOfertas) btnVerMasOfertas.style.display = 'block';
            if (btnVerMasCamisas) btnVerMasCamisas.style.display = 'block';
            
            // Recargar para limpiar cualquier residuo de CSS o estado
            location.reload(); 
            return;
        }

        // 2. SI HAY TÉRMINO: Ocultar todo lo innecesario
        if (billboard) billboard.style.display = 'none';
        if (seccionCamisas) seccionCamisas.style.display = 'none';
        if (btnVerMasOfertas) btnVerMasOfertas.style.display = 'none';
        if (btnVerMasCamisas) btnVerMasCamisas.style.display = 'none';

        // 3. Filtrar productos
        const filtrados = productosData.filter(prod => {
            let textoDetalles = prod.detalles ? prod.detalles.join(' ') : '';
            let textoTags = prod.tags ? prod.tags : '';
            let textoMarca = prod.marca ? prod.marca : '';
            const textoCompleto = `${prod.nombre} ${prod.descripcion} ${textoTags} ${textoMarca} ${textoDetalles}`.toLowerCase();
            
            return textoCompleto.includes(termino);
        });

        // 4. Actualizar título
        if (tituloSeccion) {
            tituloSeccion.textContent = `🔍 Resultados para: "${termino}"`;
        }

        // 5. Renderizar
        if (typeof mostrarProductos === 'function') {
            mostrarProductos(filtrados);
        }
    });
});