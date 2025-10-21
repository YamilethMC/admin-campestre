# Archivos de Ejemplo para el Sistema de Gestión de Socios

## Descripción

Este directorio contiene archivos de ejemplo para probar las funcionalidades de carga de datos en el sistema de gestión de socios y estados de cuenta.

## Archivos Incluidos

### socios_ejemplo.csv
- Contiene 8 registros de ejemplo de socios
- Campos incluidos: numero_socio, nombre, apellidos, email, telefono, foraneo, direccion, id_sistema_entradas
- Puede ser utilizado para probar la funcionalidad de carga masiva de socios

### Archivos PDF de estados de cuenta
- 3_estado_cuenta.pdf - Estado de cuenta para el socio con número 3
- 4_estado_cuenta.pdf - Estado de cuenta para el socio con número 4
- 5_estado_cuenta.pdf - Estado de cuenta para el socio con número 5
- 6_estado_cuenta.pdf - Estado de cuenta para el socio con número 6

### Para crear el archivo ZIP
- Selecciona los archivos PDF de estados de cuenta
- Comprime en un archivo ZIP (puedes hacerlo con el menú contextual en Windows: "Enviar a" > "Carpeta comprimida")
- El nombre del archivo ZIP puede ser "estados_cuenta_octubre_2025.zip"

## Cómo usar

1. Para cargar socios: Ve al módulo "Carga Masiva Socios" y selecciona el archivo CSV
2. Para cargar estados de cuenta: Ve al módulo "Estados de Cuenta (ZIP)" y selecciona el archivo ZIP que contenga los PDFs
3. El sistema identificará automáticamente los estados de cuenta con los socios basándose en el número de socio en el nombre del archivo

## Notas

- El sistema busca el número de socio en el nombre del archivo (ej. '3_estado_cuenta.pdf' se asociará con el socio número 3)
- Todos los archivos PDF son documentos PDF válidos con contenido de ejemplo
- El archivo CSV sigue el formato exacto que espera la aplicación