# n8n-nodes-custom-logger

Paquete de nodos personalizados para n8n que permite registrar logs customizados en una base de datos PostgreSQL.

## Características
- Recibe un JSON como entrada.
- Inserta logs en PostgreSQL con los campos: status_code, data (JSON), message (opcional), origin (opcional).
- Permite configuración de conexión vía credenciales de n8n o directa desde el nodo.

## Instalación

```
npm install n8n-nodes-custom-logger-snoop
```

## Uso
Agrega el nodo "Custom Logger" en tu workflow de n8n y configura los parámetros requeridos.

---
