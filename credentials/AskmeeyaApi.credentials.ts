import type { IAuthenticate, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class AskmeeyaApi implements ICredentialType {
	name = 'askmeeyaApi';
	displayName = 'Askmeeya API';
	documentationUrl = 'https://github.com/paschembri/n8n-nodes-askmeeya';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://staging.meeya.app',
		},
	];
	authenticate: IAuthenticate = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/api/token-validity/',
		},
	};
}