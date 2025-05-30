import { INodeType, INodeTypeDescription, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';

export class HelloWorldNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Hello World',
    name: 'helloWorld',
    group: ['transform'],
    version: 1,
    description: 'Nodo de prueba Hello World',
    defaults: {
      name: 'Hello World',
      color: '#f39c12',
    },
    inputs: ['main' as any],
    outputs: ['main' as any],
    properties: [
      {
        displayName: 'Mensaje',
        name: 'mensaje',
        type: 'string',
        default: '¡Hola mundo!',
        description: 'Mensaje a mostrar',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const results: INodeExecutionData[] = [];
    for (let i = 0; i < items.length; i++) {
      const mensaje = this.getNodeParameter('mensaje', i) as string;
      results.push({ json: { mensaje } });
    }
    return [results];
  }
}

export default HelloWorldNode;
