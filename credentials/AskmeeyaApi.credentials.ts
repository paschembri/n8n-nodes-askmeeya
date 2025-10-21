import type {
	IAuthenticate,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
	IRequestOptionsSimplifiedAuth,
} from 'n8n-workflow';

export class AskmeeyaApi implements ICredentialType {
	name = 'askmeeyaApi';
	displayName = 'Askmeeya API';
	documentationUrl = 'https://github.com/paschembri/n8n-nodes-askmeeya';
	icon: Icon = 'file:askmeeya.svg';
	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '26ysazLxwvmxD7lt8ZgSpwkJcHHsRw8u',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Audience',
			name: 'audience',
			type: 'string',
			default: 'https://staging.meeya.app',
		},
		{
			displayName: 'Auth URL',
			name: 'authUrl',
			type: 'string',
			default: 'https://meeya.eu.auth0.com/oauth/token',
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
			auth: {
				type: 'oauth2',
				oauth2: {
					grantType: 'generic',
					accessTokenUrl: '={{$credentials.authUrl}}',
					clientId: '={{$credentials.clientId}}',
					clientSecret: '={{$credentials.clientSecret}}',
					scope: 'openid profile email',
					authMethod: 'body',
					body: {
						grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
						realm: 'Username-Password-Authentication',
						clientId: '={{$credentials.clientId}}',
						clientSecret: '={{$credentials.clientSecret}}',
						username: '={{$credentials.username}}',
						password: '={{$credentials.password}}',
						audience: '={{$credentials.audience}}',
					},
				},
			},
		} as unknown as IRequestOptionsSimplifiedAuth,
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/auth/',
		},
	};
}
