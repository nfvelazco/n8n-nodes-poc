import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeConnectionType,
} from 'n8n-workflow';

export class ApiKeyRequest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'API Key Request',
		name: 'apiKeyRequest',
		icon: 'fa:key',
		group: ['transform'],
		version: 1,
		description: 'Hace una petición HTTP con API Key en el header',
		defaults: { name: 'API Key Request' },
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'apiKeyCredential',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'string',
				default: '',
				description: 'Endpoint relativo a la URL base',
			},
			{
				displayName: 'Método',
				name: 'method',
				type: 'options',
				options: [
					{ name: 'GET', value: 'GET' },
					{ name: 'POST', value: 'POST' },
				],
				default: 'GET',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('apiKeyCredential');
		const apiKey = credentials.apiKey as string;
		const baseUrl = credentials.baseUrl as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const endpoint = this.getNodeParameter('endpoint', i) as string;
				const method = this.getNodeParameter('method', i) as 'GET' | 'POST';

				const response = await this.helpers.httpRequest({
					method, // 'GET' | 'POST' es aceptado directamente
					url: `${baseUrl}${endpoint}`,
					headers: {
						'api-key': apiKey,
					},
				});

				returnData.push({ json: response });
			} catch (error) {
				throw new NodeApiError(this.getNode(), error as any, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
