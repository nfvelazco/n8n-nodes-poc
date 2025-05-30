import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ApiKeyCredential implements ICredentialType {
	name = 'apiKeyCredential';
	displayName = 'API Key Credential';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
		},
	];
}
