import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeApiError,
	NodeConnectionType,
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
