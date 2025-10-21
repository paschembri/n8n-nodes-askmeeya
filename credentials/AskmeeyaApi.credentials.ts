import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
  Icon,
} from 'n8n-workflow';

export class AskmeeyaApi implements ICredentialType {
  name = 'askmeeyaApi';
  displayName = 'Askmeeya API';
  documentationUrl = 'https://github.com/paschembri/n8n-nodes-askmeeya';

  // ✅ Fix: Icon must be an object in your version
  icon: Icon = {
    light: 'file:askmeeya.svg',
    dark: 'file:askmeeya.svg',
  };

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
    {
      displayName: 'API URL',
      name: 'apiUrl',
      type: 'string',
      default: 'https://staging.meeya.app',
    },
  ];

  // Bearer auth
  authenticate: IAuthenticateGeneric = {
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
      url: '/auth/',
      method: 'GET',
    },
  };
}
