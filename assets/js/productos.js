// --- LISTA MAESTRA DE PRODUCTOS ---

const productosData = [
   


/* ========================================== */
             /* CABALLERO   */
/* ========================================== */

{
    id: "camisa-urbana-01",
    nombre: "sueter china adidas ",
    precio: 80.00,
    precioTachado: 100,
    categoria: "caballero-sueteres",
    marca: "adidas", // <--- 1. Agrega la marca en minúsculas para que el filtro la detecte
    imagen: "images/sueter_china_azul.jpg",
    fotosExtras: ["images/sueter_china_blanco.jpg", "images/sueter_china_negro.jpg", "images/sueter_china_azul.jpg"],
    tallas: ["S", "M", "L", "XL"],
    colores: [
        { nombre: "negro", hex: "#000000", foto: "images/sueter_china_negro.jpg" },  // <--- 2. Pon los nombres de los colores en minúsculas (ej: "negro", "blanco")
        { nombre: "blanco", hex: "#FFFFFF", foto: "images/sueter_china_blanco.jpg" },
        { nombre: "azul", hex: "#132783", foto: "images/sueter_china_azul.jpg" }
    ],
    descripcion: "Algodón de alta densidad, corte boxy fit.",
    detalles: ["Material: 100% Algodón", "Peso: 250gsm"]
},

 {
    id: "camisa-prada-01",
    nombre: "camisa nike",
    precio: 28.00,
    categoria: "caballero-camisas",
    marca: "nike", // <--- 1. Agrega la marca en minúsculas para que el filtro la detecte
    imagen: "images/camisa_nike_blanca.jpg",
    fotosExtras: ["images/camisa_nike_negra.jpg", "images/camisa_nike_gris.jpg", "images/camisa_nike_blanca.jpg"],
    tallas: ["S", "M", "L", "XL"],
    colores: [
        { nombre: "negro", hex: "#000000", foto: "images/camisa_nike_negra.jpg" },  // <--- 2. Pon los nombres de los colores en minúsculas (ej: "negro", "blanco")
        { nombre: "blanco", hex: "#FFFFFF", foto: "images/camisa_nike_blanca.jpg" },
        { nombre: "gris", hex: "#808080", foto: "images/camisa_nike_gris.jpg" }
    ],
    descripcion: "Algodón de alta densidad, corte boxy fit.",
    detalles: ["Material: 100% Algodón", "Peso: 250gsm", "marca: nike "]
},

{
    id: "zapato-urbano-01",
    nombre: "Zapatillas Urbanas Sport",
    precio: 40.00,
    categoria: "caballero-zapatos",
    marca: "nike",
    imagen: "images/ZAPATOS_UNO.jpg",
    fotosExtras: ["images/ZAPATOSUNO_BLANCO.jpg", "images/ZAPATOS_UNO.jpg"],
    tallas: ["40", "41", "42", "43"],
    colores: [
        { nombre: "negro", hex: "#000000", foto: "images/ZAPATOS_UNO.jpg" },
        { nombre: "blanco", hex: "#FFFFFF", foto: "images/ZAPATOSUNO_BLANCO.jpg" }
    ],
    descripcion: "Diseño ergonómico para máximo confort diario.",
    detalles: ["Suela de goma antideslizante", "Material sintético respirable"]
},
{
    id: "sueter-hoodie-01",
    nombre: "Suéter Hoodie Minimalista",
    precio: 32.00,
    categoria: "caballero-sueteres",
    marca: "zara",
    imagen: "images/SUETER_UNO_GRIS.jpg",
    fotosExtras: ["images/SUETER_UNO_NEGRO.jpg", "images/SUETER_UNO_GRIS.jpg"],
    tallas: ["M", "L", "XL"],
    colores: [
        { nombre: "gris", hex: "#808080", foto: "images/SUETER_UNO_GRIS.jpg" },
        { nombre: "negro", hex: "#000000", foto: "images/SUETER_UNO_NEGRO.jpg" }
    ],
    descripcion: "Suéter con capucha y franela perchada por dentro.",
    detalles: ["Algodón y poliéster", "Bolsillo tipo canguro"]
},
{
    id: "accesorio-gorra-01",
    nombre: "Gorra Trucker Casual",
    precio: 15.00,
    categoria: "caballero-accesorios",
    marca: "nike",
    imagen: "images/gorra_uno_negra.jpg",
    fotosExtras: ["images/gorra_uno_azul.jpg","images/gorra_uno_negra.jpg"],
    tallas: ["Única"],
    colores: [
        { nombre: "negro", hex: "#000000", foto:"images/gorra_uno_negra.jpg" },
        { nombre: "azul", hex: "#132783", foto:"images/gorra_uno_azul.jpg" }
    ],
    descripcion: "Gorra ajustable con malla trasera para mayor frescura.",
    detalles: ["Cierre ajustable de broche", "Panel frontal reforzado"]
},


/* ========================================== */
             /* DAMA   */
/* ========================================== */

{
    id: "blusa-elegante-01",
    nombre: "Blusa Casual Satinada",
    precio: 22.00,
    categoria: "dama-camisas",
    marca: "zara",
    imagen: "images/blusa_uno_blanca.jpg",
    fotosExtras: ["images/blusa_uno_negra.jpg", "images/blusa_uno_blanca.jpg"],
    tallas: ["S", "M", "L"],
    colores: [
        { nombre: "blanco", hex: "#FFFFFF", foto:"images/blusa_uno_blanca.jpg" },
        { nombre: "negro", hex: "#000000", foto: "images/blusa_uno_negra.jpg" }
    ],
    descripcion: "Tela suave al tacto con caída elegante.",
    detalles: ["100% Satén", "Corte clásico formal-casual"]
},

{
    id: "zapato-tacon-01",
    nombre: "Zapatos Casuales Bajos",
    precio: 38.00,
    precioTachado: 50,
    categoria: "dama-zapatos",
    marca: "nike",
    imagen: "images/tacondama_uno_blanco.jpg",
    fotosExtras: ["images/tacondama_uno_negro.jpg","images/tacondama_uno_blanco.jpg"],
    tallas: ["36", "37", "38", "39"],
    colores: [
        { nombre: "beige", hex: "#F5F5DC", foto: "images/tacondama_uno_blanco.jpg" },
        { nombre: "negro", hex: "#000000", foto: "images/tacondama_uno_negro.jpg" }
    ],
    descripcion: "Calzado cómodo y versátil para el día a día.",
    detalles: ["Plantilla acolchada", "Suela flexible"]
},

{
    id: "sueter-dama-01",
    nombre: "Cardigan Tejido Ligero",
    precio: 29.00,
    categoria: "dama-sueteres",
    marca: "zara",
    imagen: "images/cardigan_uno_gris.jpg",
    fotosExtras: ["images/cardigan_uno_negro.jpg","images/cardigan_uno_gris.jpg"],
    tallas: ["S", "M", "L", "XL"],
    colores: [
        { nombre: "gris", hex: "#808080", foto:"images/cardigan_uno_gris.jpg" },
        { nombre: "negro", hex: "#080808", foto: "images/cardigan_uno_negro.jpg" }
    ],
    descripcion: "Suéter abierto tejido fino ideal para cualquier clima.",
    detalles: ["Tejido acanalado", "Corte holgado"]
},

{
    id: "accesorio-cartera-01",
    nombre: "Bolso de Mano Minimalista",
    precio: 30.00,
    categoria: "dama-accesorios",
    marca: "zara",
    imagen: "images/cartera_uno_negra.jpg",
    fotosExtras: ["images/cartera_uno_blanca.jpg","images/cartera_uno_negra.jpg"],
    tallas: ["Única"],
    colores: [
        { nombre: "negro", hex: "#000000", foto: "images/cartera_uno_negra.jpg" },
        { nombre: "beige", hex: "#F5F5DC", foto: "images/cartera_uno_blanca.jpg"}
    ],
    descripcion: "Cartera elegante con correa ajustable incluida.",
    detalles: ["Cierre metálico seguro", "Compartimiento interno con cremallera"]
}




];