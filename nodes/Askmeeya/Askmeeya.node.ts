import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { documentDescription } from './resources/document';
import { folderDescription } from './resources/folder';
import { projectDescription } from './resources/project';

export class Askmeeya implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Askmeeya',
		name: 'askmeeya',
		icon: { light: 'file:askmeeya.svg', dark: 'file:askmeeya.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Askmeeya API',
		defaults: {
			name: 'Askmeeya',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'askmeeyaApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.apiUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Folder',
						value: 'folder',
					},
					{
						name: 'Project',
						value: 'project',
					},
				],
				default: 'document',
			},
			...documentDescription,
			...folderDescription,
			...projectDescription,
		],
	};
}
