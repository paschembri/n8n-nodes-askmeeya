import type { INodeProperties } from 'n8n-workflow';

export const folderDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['folder'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many folders',
				routing: {
					request: {
						method: 'GET',
						url: '/meeya/folders/',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a folder',
				routing: {
					request: {
						method: 'POST',
						url: '/meeya/folders/',
						body: {
							name: '={{$parameter.name}}',
							parent_id: '={{$parameter.parentId}}',
						},
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a folder',
				routing: {
					request: {
						method: 'PATCH',
						url: '/meeya/folders/',
						body: {
							folder: '={{$parameter.folderId}}',
							name: '={{$parameter.name}}',
						},
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a folder',
				routing: {
					request: {
						method: 'DELETE',
						url: '/meeya/folders/',
						body: {
							folder: '={{$parameter.folderId}}',
						},
					},
				},
			},
		],
		default: 'getMany',
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['update', 'delete'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Parent ID',
		name: 'parentId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create'],
			},
		},
	},
];
