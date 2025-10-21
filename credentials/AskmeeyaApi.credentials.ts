import type {
	IAuthenticate,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IDataObject,
	INodeProperties,
	Icon,
	IHttpRequestHelper,
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
	preAuthentication: ICredentialType['preAuthentication'] = async function (this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const existingAuthorization = typeof credentials.authorization === 'string' ? credentials.authorization : undefined;
		const existingAccessToken = typeof credentials.accessToken === 'string' ? credentials.accessToken : undefined;
		const existingTokenType = typeof credentials.tokenType === 'string' ? credentials.tokenType : undefined;
		const existingExpiresAt = credentials.expiresAt ? Number(credentials.expiresAt) : undefined;
		if (
			existingAuthorization &&
			existingAccessToken &&
			existingTokenType &&
			existingExpiresAt &&
			Date.now() < existingExpiresAt - 60_000
		) {
			return {
				authorization: existingAuthorization,
				accessToken: existingAccessToken,
				tokenType: existingTokenType,
				expiresAt: existingExpiresAt,
			};
		}

		const {
			authUrl,
			clientId,
			clientSecret,
			username,
			password,
			audience,
		} = credentials;

		if (!authUrl || typeof authUrl !== 'string') throw new Error('Missing Auth0 token endpoint URL.');
		if (!clientId || typeof clientId !== 'string') throw new Error('Missing Auth0 client ID.');
		if (!clientSecret || typeof clientSecret !== 'string') throw new Error('Missing Auth0 client secret.');
		if (!username || typeof username !== 'string') throw new Error('Missing username.');
		if (!password || typeof password !== 'string') throw new Error('Missing password.');

		const tokenResponse = (await this.helpers.httpRequest({
			method: 'POST',
			url: authUrl,
			body: {
				grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
				realm: 'Username-Password-Authentication',
				client_id: clientId,
				client_secret: clientSecret,
				username,
				password,
				audience,
				scope: 'openid profile email',
			},
			headers: {
				'Content-Type': 'application/json',
			},
			json: true,
		})) as IDataObject;

		const accessToken = tokenResponse.access_token as string | undefined;
		if (!accessToken) throw new Error('Auth0 token response missing access token.');

		const tokenType = (tokenResponse.token_type as string | undefined)?.trim() || 'Bearer';
		const expiresIn = tokenResponse.expires_in as number | string | undefined;
		const expiresAt = expiresIn ? Date.now() + Number(expiresIn) * 1000 : undefined;

		return {
			authorization: `${tokenType} ${accessToken}`.trim(),
			accessToken,
			tokenType,
			expiresAt,
		};
	};
	authenticate: IAuthenticate = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.authorization}}',
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
