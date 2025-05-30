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
