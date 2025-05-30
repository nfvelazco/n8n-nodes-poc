import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeApiError,
	NodeConnectionType,
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
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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

				let inputText: string;

				// Intenta obtener el valor del campo del JSON de entrada
				const value = items[i].json[textField];

				if (typeof value === 'string') {
					// Si el valor es un string, úsalo directamente
					inputText = value;
				} else if (value === undefined) {
					// Si el campo no existe, usa el valor literal del parámetro
					inputText = textField;
				} else {
					// Si el valor no es un string, lanza un error
					throw new NodeOperationError(
						this.getNode(),
						`El campo '${textField}' debe contener texto, pero contiene: ${JSON.stringify(value)}`,
						{ itemIndex: i },
					);
				}

				let result: string | number;

				// Procesa según la operación seleccionada
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
						error: error as NodeApiError | NodeOperationError,
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
