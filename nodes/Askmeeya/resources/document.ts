import type {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

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
				name: 'Create',
				value: 'create',
				action: 'Create a document',
				routing: {
					request: {
						method: 'POST',
						url: '/meeya/documents/',
					},
					send: {
						preSend: [
							async function (
								this: IExecuteSingleFunctions,
								requestOptions: IHttpRequestOptions,
							) {
								const binaryPropertyName = this.getNodeParameter(
									'binaryPropertyName',
								) as string;
								const titleParam = this.getNodeParameter('title') as string;
								const folderId = this.getNodeParameter('folderId');
								const extractImages = this.getNodeParameter('extractImages') as boolean;

								const item = this.getInputData();
								const binaryData = item.binary?.[binaryPropertyName];
								if (!binaryData) {
									throw new Error(
										`Binary property "${binaryPropertyName}" not found on input item`,
									);
								}

								const title =
									titleParam?.toString().trim() ||
									binaryData.fileName ||
									'Untitled document';

								const buffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);

								type MultipartRequestOptions = IHttpRequestOptions & {
									formData?: Record<string, unknown>;
								};

								const multipartRequestOptions = requestOptions as MultipartRequestOptions;

								const formData: Record<string, unknown> = {
									title: title,
									extract_images_required: String(extractImages),
									file: {
										value: buffer,
										options: {
											filename: binaryData.fileName || 'upload',
											contentType: binaryData.mimeType || 'application/octet-stream',
										},
									},
								};

								if (folderId !== undefined && folderId !== null) {
									formData.folder = String(folderId);
								}

								multipartRequestOptions.formData = formData;

								delete multipartRequestOptions.body;
								multipartRequestOptions.json = false;
								delete multipartRequestOptions.headers?.['Content-Type'];

								return requestOptions;
							},
						],
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
						url: '/meeya/documents/',
						body: {
							id: '={{$parameter.documentId}}',
						},
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
						url: '=/meeya/documents/{{$parameter.documentId}}/',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many documents',
				routing: {
					request: {
						method: 'GET',
						url: '/meeya/documents/',
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
						url: '/meeya/documents/',
						body: {
							id: '={{$parameter.documentId}}',
							title: '={{$parameter.title}}',
							archived: '={{$parameter.archived}}',
							folder: '={{$parameter.folderId}}',
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
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description:
			'Name of the binary property that holds the file to upload, typically "data"',
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
