# Guía para desarrolladores: Agregar un nuevo nodo personalizado

## 1. Crear el archivo del nodo

Crea una nueva carpeta y archivo para tu nodo, por ejemplo:
```
nodes/MiNuevoNodo/MiNuevoNodo.node.ts
```

## 2. Implementar la clase del nodo

Usa la siguiente estructura básica como referencia:

```typescript
import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
    NodeConnectionType,
} from 'n8n-workflow';

export class MiNuevoNodo implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Mi Nuevo Nodo',
        name: 'miNuevoNodo',
        icon: 'fa:star',
        group: ['transform'],
        version: 1,
        description: 'Descripción de mi nuevo nodo',
        defaults: { name: 'Mi Nuevo Nodo' },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        properties: [
            // Define tus parámetros aquí
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // Tu lógica aquí
        return [this.getInputData()];
    }
}
```

## 3. Agregar la ruta del nodo compilado en el package.json

En la propiedad `"n8n.nodes"` de tu `package.json`, agrega la ruta al archivo `.js` compilado:

```json
"n8n": {
  "nodes": [
    "dist/TextProcessor/TextProcessor.node.js",
    "dist/NumberCalculator/NumberCalculator.node.js",
    "dist/MiNuevoNodo/MiNuevoNodo.node.js"
  ]
}
```

## 4. Compilar el proyecto

Ejecuta:
```bash
npm run build
```

## 5. Publicar una nueva versión (opcional)

1. Sube la versión en `package.json`.
2. Ejecuta:
   ```bash
   npm publish --access public
   ```

## 6. Reiniciar n8n y probar el nuevo nodo

---

**Consejo:**  
Si quieres asegurarte de que el build siempre refleje tu código actual, puedes agregar al script de build en tu `package.json`:

```json
"build": "rmdir /s /q dist && tsc && gulp build:icons"
```
(En Windows. En Linux/Mac usa `rm -rf dist && tsc && gulp build:icons`)

---

¡Listo! Así puedes mantener tu paquete organizado y facilitar la colaboración.