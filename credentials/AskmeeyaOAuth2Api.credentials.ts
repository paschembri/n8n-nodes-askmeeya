import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class AskmeeyaOAuth2Api implements ICredentialType {
	name = 'askmeeyaOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Askmeeya OAuth2 API';

	icon: Icon = {
		light: 'file:askmeeya.svg',
		dark: 'file:askmeeya.dark.svg',
	};

	// Link to your community node's README
	documentationUrl = 'https://github.com/org/-askmeeya?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://api.example.com/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api.example.com/oauth/token',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'users:read users:write companies:read',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
