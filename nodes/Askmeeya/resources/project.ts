import type { INodeProperties } from 'n8n-workflow';

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many projects',
				routing: {
					request: {
						method: 'GET',
						url: '/meeya/projects/',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a project',
				routing: {
					request: {
						method: 'POST',
						url: '/meeya/projects/',
						body: {
							name: '={{$parameter.name}}',
						},
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a project',
				routing: {
					request: {
						method: 'PATCH',
						url: '/meeya/projects/',
						body: {
							project_id: '={{$parameter.projectId}}',
							name: '={{$parameter.name}}',
						},
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a project',
				routing: {
					request: {
						method: 'DELETE',
						url: '/meeya/projects/',
						body: {
							project_id: '={{$parameter.projectId}}',
						},
					},
				},
			},
		],
		default: 'getMany',
	},
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
				operation: ['create', 'update'],
			},
		},
	},
];
