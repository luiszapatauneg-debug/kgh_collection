import pandas as pd
import json
import re

# Nombre de tu archivo Excel
excel_path = 'Copia de 2 INVENTARIO_ORGANIZADO.xlsx'
xls = pd.ExcelFile(excel_path)

# Mapeo de hojas de Excel a tus categorías web
sheet_to_category = {
    'camisas': 'dama-camisas',
    'Accesorios y Joyería': 'dama-accesorios',
    'Calzado': 'dama-calzado',
    'Monederos': 'dama-monederos',
    'carteras': 'dama-carteras',
    ' Lentes': 'dama-lentes',
    'relojes': 'dama-relojes',
    'Perfumería ': 'dama-perfumeria',
    'bragas': 'dama-bragas',
    'vestidos': 'dama-vestidos',
    'top': 'dama-top',
    'faldas': 'dama-faldas',
    'chaquetas': 'dama-chaquetas',
    'pantalones': 'dama-pantalones',
    'conjuntos set': 'dama-conjuntos',
    'CHALECOS': 'dama-chalecos'
}

# Mapeo de subcarpetas en minúsculas (correspondientes a cada categoría)
sheet_to_subfolder = {
    'camisas': 'camisas',
    'Accesorios y Joyería': 'accesorios',
    'Calzado': 'calzado',
    'Monederos': 'monederos',
    'carteras': 'carteras',
    ' Lentes': 'lentes',
    'relojes': 'relojes',
    'Perfumería ': 'perfumeria',
    'bragas': 'bragas',
    'vestidos': 'vestidos',
    'top': 'top',
    'faldas': 'faldas',
    'chaquetas': 'chaquetas',
    'pantalones': 'pantalones',
    'conjuntos set': 'conjuntos',
    'CHALECOS': 'chalecos'
}

# Diccionario de colores a códigos HEX
colores_hex = {
    "negro": "#000000", "blanco": "#FFFFFF", "rojo": "#FF0000",
    "azul": "#0000FF", "rosa": "#FFC0CB", "rosado": "#FFC0CB",
    "rosa gold": "#B76E79", "beige": "#F5F5DC", "marron": "#8B4513",
    "gris": "#808080", "amarillo": "#FFFF00", "vino": "#722F37",
    "mostaza": "#FFDB58", "fucsia": "#FF00FF", "verde": "#008000",
    "celeste": "#87CEEB", "naranja": "#FFA500"
}

def detectar_color_en_texto(texto):
    texto_lower = str(texto).lower()
    for col_nombre in colores_hex.keys():
        if col_nombre in texto_lower:
            return col_nombre
    return None

def extraer_stock(val):
    if pd.isna(val):
        return 5  # Stock por defecto si está vacío
    val_str = str(val).upper().strip()
    numeros = re.findall(r'\d+', val_str)
    if numeros:
        return int(numeros[0])
    return 5

productos_list = []

for sheet_name, cat_key in sheet_to_category.items():
    if sheet_name not in xls.sheet_names:
        continue
    df = pd.read_excel(excel_path, sheet_name=sheet_name)
    subfolder = sheet_to_subfolder.get(sheet_name, 'otros')
    
    for _, row in df.iterrows():
        cod = str(row.get('CodProd', '')).strip()
        nombre = str(row.get('NOMBRE PRODUCTO', '')).strip()
        
        if not cod or cod == 'nan' or not nombre or nombre == 'nan':
            continue
            
        # Limpieza de Precio
        precio_raw = row.get('Refere $', 0)
        try:
            precio = float(str(precio_raw).replace('$', '').strip()) if not pd.isna(precio_raw) else 0.0
        except:
            precio = 0.0
            
        marca = str(row.get('Marca', 'SIN MARCA')).strip().lower()
        if marca == 'nan': marca = 'sin marca'
        
        desc = str(row.get('Descripcion', '')).strip()
        if desc == 'nan': desc = nombre

        # Limpieza de Tallas
        talla_str = str(row.get('Talla', 'UNICA')).strip()
        if talla_str == 'nan': talla_str = 'UNICA'
        tallas = [t.strip() for t in talla_str.replace('/', ',').split(',') if t.strip()]

        color_general = str(row.get('Color', '')).strip().lower()
        stock_fila = extraer_stock(row.get('Unidad', 5))

        # Recopilar todas las fotos de la fila con su subcarpeta en minúsculas
        fotos_encontradas = []
        for col in df.columns:
            col_up = str(col).upper()
            if 'FOTO' in col_up and not pd.isna(row[col]):
                foto_val = str(row[col]).strip()
                if foto_val and foto_val != 'nan':
                    fotos_encontradas.append(f"images/fotos_productos/{subfolder}/{foto_val}")

        if not fotos_encontradas:
            fotos_encontradas = [f"images/fotos_productos/{subfolder}/{nombre}.jpeg"]

        imagen_principal = fotos_encontradas[0]
        
        # Construir array de colores con su stock individual
        colores_obj = []
        for foto_path in fotos_encontradas:
            nombre_archivo = foto_path.split('/')[-1]
            color_detectado = detectar_color_en_texto(nombre_archivo)
            
            if not color_detectado:
                color_detectado = detectar_color_en_texto(color_general)
                if not color_detectado:
                    color_detectado = "único"
            
            hex_code = colores_hex.get(color_detectado, "#CCCCCC")
            
            if not any(c['nombre'] == color_detectado for c in colores_obj):
                colores_obj.append({
                    "nombre": color_detectado,
                    "hex": hex_code,
                    "foto": foto_path,
                    "stock": stock_fila  # 👈 Stock específico vinculado a este color
                })

        if not colores_obj:
            colores_obj.append({
                "nombre": "único",
                "hex": "#CCCCCC",
                "foto": imagen_principal,
                "stock": stock_fila
            })

        prod_obj = {
            "id": cod.lower(),
            "nombre": nombre,
            "precio": precio,
            "categoria": cat_key,
            "marca": marca,
            "imagen": imagen_principal,
            "fotosExtras": fotos_encontradas,
            "tallas": tallas,
            "colores": colores_obj,
            "stock": stock_fila,
            "descripcion": desc,
            "detalles": [f"Categoría: {sheet_name.capitalize()}", f"Stock disponible: {stock_fila}"]
        }
        productos_list.append(prod_obj)

# Exportar a productos.js
js_output = f"window.productosData = {json.dumps(productos_list, indent=4, ensure_ascii=False)};"

with open('productos.js', 'w', encoding='utf-8') as f:
    f.write(js_output)

print(f"¡Éxito total! Se procesaron {len(productos_list)} productos con rutas limpias en minúsculas y stock por variante.")