#!/bin/bash

# Script para crear la estructura completa del package de n8n
echo "🚀 Creando estructura del package de n8n..."

# Crear directorio principal
mkdir -p n8n-nodes-custom-test
cd n8n-nodes-custom-test

# Crear estructura de carpetas
mkdir -p nodes/TextProcessor
mkdir -p nodes/NumberCalculator
mkdir -p dist

echo "📁 Estructura de carpetas creada"

# Crear package.json
cat > package.json << 'EOF'
{
  "name": "n8n-nodes-custom-test",
  "version": "0.1.0",
  "description": "Package de prueba con dos nodos personalizados para n8n",
  "keywords": [
    "n8n-community-node-package"
  ],
  "license": "MIT",
  "homepage": "",
  "author": {
    "name": "",
    "email": ""
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "main": "index.js",
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "format": "prettier nodes credentials --write",
    "lint": "eslint nodes credentials package.json",
    "lintfix": "eslint nodes credentials package.json --fix",
    "prepublishOnly": "npm run build && npm run lint -s"
  },
  "files": [
    "dist"
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [],
    "nodes": [
      "dist/nodes/TextProcessor/TextProcessor.node.js",
      "dist/nodes/NumberCalculator/NumberCalculator.node.js"
    ]
  },
  "devDependencies": {
    "@typescript-eslint/parser": "^5.45.0",
    "eslint-plugin-n8n-nodes-base": "^1.11.0",
    "gulp": "^4.0.2",
    "n8n-workflow": "*",
    "prettier": "^2.7.1",
    "typescript": "^4.8.4"
  },
  "peerDependencies": {
    "n8n-workflow": "*"
  }
}
EOF

# Crear tsconfig.json
cat > tsconfig.json << 'EOF'
{
	"compilerOptions": {
		"module": "commonjs",
		"target": "es2019",
		"lib": ["es2019"],
		"declaration": true,
		"outDir": "./dist",
		"strict": true,
		"noImplicitAny": true,
		"esModuleInterop": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true
	},
	"include": ["nodes/**/*"],
	"exclude": ["node_modules/**/*", "dist/**/*"]
}
EOF

# Crear gulpfile.js
cat > gulpfile.js << 'EOF'
const { src, dest } = require('gulp');

function buildIcons() {
	return src('nodes/**/*.{png,svg}').pipe(dest('dist/nodes'));
}

exports['build:icons'] = buildIcons;
EOF

# Crear .eslintrc.js
cat > .eslintrc.js << 'EOF'
module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:n8n-nodes-base/recommended'],
	rules: {
		'n8n-nodes-base/node-dirname-against-convention': 'error',
		'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
		'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
		'n8n-nodes-base/node-filename-against-convention': 'error',
	},
};
EOF

# Crear .prettierrc
cat > .prettierrc << 'EOF'
{
	"semi": true,
	"trailingComma": "all",
	"singleQuote": true,
	"printWidth": 100,
	"useTabs": true
}
EOF

# Crear TextProcessor.node.ts
cat > nodes/TextProcessor/TextProcessor.node.ts << 'EOF'
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class TextProcessor implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Text Processor',
		name: 'textProcessor',
		icon: 'fa:text-width',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Procesa texto de diferentes maneras',
		defaults: {
			name: 'Text Processor',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Uppercase',
						value: 'uppercase',
						description: 'Convierte el texto a mayúsculas',
						action: 'Convert text to uppercase',
					},
					{
						name: 'Lowercase',
						value: 'lowercase',
						description: 'Convierte el texto a minúsculas',
						action: 'Convert text to lowercase',
					},
					{
						name: 'Reverse',
						value: 'reverse',
						description: 'Invierte el orden de los caracteres',
						action: 'Reverse text',
					},
					{
						name: 'Count Characters',
						value: 'count',
						description: 'Cuenta el número de caracteres',
						action: 'Count characters in text',
					},
				],
				default: 'uppercase',
			},
			{
				displayName: 'Text Field',
				name: 'textField',
				type: 'string',
				default: 'text',
				required: true,
				description: 'El campo que contiene el texto a procesar',
			},
			{
				displayName: 'Output Field',
				name: 'outputField',
				type: 'string',
				default: 'processedText',
				required: true,
				description: 'El campo donde se guardará el resultado',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const textField = this.getNodeParameter('textField', i) as string;
				const outputField = this.getNodeParameter('outputField', i) as string;

				const inputText = items[i].json[textField] as string;

				if (typeof inputText !== 'string') {
					throw new NodeOperationError(
						this.getNode(),
						`El campo '${textField}' debe contener texto`,
						{ itemIndex: i },
					);
				}

				let result: string | number;

				switch (operation) {
					case 'uppercase':
						result = inputText.toUpperCase();
						break;
					case 'lowercase':
						result = inputText.toLowerCase();
						break;
					case 'reverse':
						result = inputText.split('').reverse().join('');
						break;
					case 'count':
						result = inputText.length;
						break;
					default:
						throw new NodeOperationError(
							this.getNode(),
							`Operación desconocida: ${operation}`,
							{ itemIndex: i },
						);
				}

				const newItem: INodeExecutionData = {
					json: {
						...items[i].json,
						[outputField]: result,
					},
				};

				returnData.push(newItem);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: items[i].json,
						error,
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
EOF

# Crear NumberCalculator.node.ts
cat > nodes/NumberCalculator/NumberCalculator.node.ts << 'EOF'
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class NumberCalculator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Number Calculator',
		name: 'numberCalculator',
		icon: 'fa:calculator',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Realiza operaciones matemáticas simples',
		defaults: {
			name: 'Number Calculator',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Suma dos números',
						action: 'Add two numbers',
					},
					{
						name: 'Subtract',
						value: 'subtract',
						description: 'Resta dos números',
						action: 'Subtract two numbers',
					},
					{
						name: 'Multiply',
						value: 'multiply',
						description: 'Multiplica dos números',
						action: 'Multiply two numbers',
					},
					{
						name: 'Divide',
						value: 'divide',
						description: 'Divide dos números',
						action: 'Divide two numbers',
					},
					{
						name: 'Square',
						value: 'square',
						description: 'Calcula el cuadrado de un número',
						action: 'Calculate square of a number',
					},
				],
				default: 'add',
			},
			{
				displayName: 'First Number Field',
				name: 'firstNumberField',
				type: 'string',
				default: 'number1',
				required: true,
				description: 'El campo que contiene el primer número',
			},
			{
				displayName: 'Second Number Field',
				name: 'secondNumberField',
				type: 'string',
				default: 'number2',
				required: true,
				description: 'El campo que contiene el segundo número',
				displayOptions: {
					hide: {
						operation: ['square'],
					},
				},
			},
			{
				displayName: 'Output Field',
				name: 'outputField',
				type: 'string',
				default: 'result',
				required: true,
				description: 'El campo donde se guardará el resultado',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const firstNumberField = this.getNodeParameter('firstNumberField', i) as string;
				const outputField = this.getNodeParameter('outputField', i) as string;

				const firstNumber = Number(items[i].json[firstNumberField]);

				if (isNaN(firstNumber)) {
					throw new NodeOperationError(
						this.getNode(),
						`El campo '${firstNumberField}' debe contener un número válido`,
						{ itemIndex: i },
					);
				}

				let result: number;

				if (operation === 'square') {
					result = firstNumber * firstNumber;
				} else {
					const secondNumberField = this.getNodeParameter('secondNumberField', i) as string;
					const secondNumber = Number(items[i].json[secondNumberField]);

					if (isNaN(secondNumber)) {
						throw new NodeOperationError(
							this.getNode(),
							`El campo '${secondNumberField}' debe contener un número válido`,
							{ itemIndex: i },
						);
					}

					switch (operation) {
						case 'add':
							result = firstNumber + secondNumber;
							break;
						case 'subtract':
							result = firstNumber - secondNumber;
							break;
						case 'multiply':
							result = firstNumber * secondNumber;
							break;
						case 'divide':
							if (secondNumber === 0) {
								throw new NodeOperationError(
									this.getNode(),
									'No se puede dividir por cero',
									{ itemIndex: i },
								);
							}
							result = firstNumber / secondNumber;
							break;
						default:
							throw new NodeOperationError(
								this.getNode(),
								`Operación desconocida: ${operation}`,
								{ itemIndex: i },
							);
					}
				}

				const newItem: INodeExecutionData = {
					json: {
						...items[i].json,
						[outputField]: result,
					},
				};

				returnData.push(newItem);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: items[i].json,
						error,
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
EOF

# Crear README.md
cat > README.md << 'EOF'
# n8n-nodes-custom-test

Este es un package de prueba para n8n que contiene dos nodos personalizados simples:

## Nodos incluidos

### 1. Text Processor
Un nodo que procesa texto con las siguientes operaciones:
- **Uppercase**: Convierte texto a mayúsculas
- **Lowercase**: Convierte texto a minúsculas  
- **Reverse**: Invierte el orden de los caracteres
- **Count Characters**: Cuenta el número de caracteres

### 2. Number Calculator
Un nodo que realiza operaciones matemáticas simples:
- **Add**: Suma dos números
- **Subtract**: Resta dos números
- **Multiply**: Multiplica dos números
- **Divide**: Divide dos números
- **Square**: Calcula el cuadrado de un número

## Instalación

1. Clona este repositorio
2. Ejecuta `npm install` para instalar las dependencias
3. Ejecuta `npm run build` para compilar el código
4. Instala el package en tu instancia de n8n

## Desarrollo

- `npm run dev`: Compila en modo watch
- `npm run build`: Compila el proyecto
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código

## Uso

Una vez instalado, encontrarás los nodos "Text Processor" y "Number Calculator" en la categoría "Transform" de n8n.

### Ejemplo de uso - Text Processor:
```json
{
  "text": "Hola Mundo"
}