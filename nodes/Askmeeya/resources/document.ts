import type { INodeProperties } from 'n8n-workflow';

export const documentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many documents',
				routing: {
					request: {
						method: 'GET',
						url: '/api/documents/',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a document',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/documents/{{$parameter.documentId}}/',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a document',
				routing: {
					request: {
						method: 'POST',
						url: '/api/documents/',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						body: {
							title: '={{$parameter.title}}',
							file: '={{$binary.file}}',
							folder: '={{$parameter.folderId}}',
							extract_images_required: '={{$parameter.extractImages}}',
						},
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a document',
				routing: {
					request: {
						method: 'PATCH',
						url: '/api/documents/',
						body: {
							id: '={{$parameter.documentId}}',
							title: '={{$parameter.title}}',
							archived: '={{$parameter.archived}}',
							folder: '={{$parameter.folderId}}',
						},
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a document',
				routing: {
					request: {
						method: 'DELETE',
						url: '/api/documents/',
						body: {
							id: '={{$parameter.documentId}}',
						},
					},
				},
			},
		],
		default: 'getMany',
	},
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		default: '',

		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'File',
		name: 'file',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Extract Images',
		name: 'extractImages',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Archived',
		name: 'archived',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['update'],
			},
		},
	},
];
