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
								const debugRequest = this.getNodeParameter('debugRequest', false) as boolean;

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
									headers?: Record<string, string>;
								};

								const multipartRequestOptions = requestOptions as MultipartRequestOptions;

								interface BinaryChunk {
									length: number;
								}

								interface BufferFactory {
									from: (data: string, encoding?: string) => BinaryChunk;
									concat: (chunks: BinaryChunk[]) => BinaryChunk;
								}

								const bufferFactory = (buffer as unknown as {
									constructor: BufferFactory;
								}).constructor;

								if (!bufferFactory) {
									throw new Error('Binary Buffer helper unavailable in runtime environment');
								}

								const boundary = `askmeeya-${Date.now().toString(16)}`;
								const crlf = '\r\n';

								const bodyChunks: BinaryChunk[] = [];

								const appendField = (name: string, value: string) => {
									bodyChunks.push(
										bufferFactory.from(
											`--${boundary}${crlf}Content-Disposition: form-data; name="${name}"${crlf}${crlf}${value}${crlf}`,
											'utf8',
										),
									);
								};

								appendField('title', title);
								appendField('extract_images_required', String(extractImages));

								if (folderId !== undefined && folderId !== null) {
									appendField('folder', String(folderId));
								}

								const fileHeaders = `--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="${
									binaryData.fileName || 'upload'
								}"${crlf}Content-Type: ${
									binaryData.mimeType || 'application/octet-stream'
								}${crlf}${crlf}`;
								bodyChunks.push(bufferFactory.from(fileHeaders, 'utf8'));
								bodyChunks.push(buffer as unknown as BinaryChunk);
								bodyChunks.push(bufferFactory.from(crlf, 'utf8'));

								if (debugRequest) {
									appendField('debug_title', title);
									appendField('debug_binary_property', binaryPropertyName);
								}

								bodyChunks.push(
									bufferFactory.from(`--${boundary}--${crlf}`, 'utf8'),
								);

								const multipartBody = bufferFactory.concat(bodyChunks);

								multipartRequestOptions.body = multipartBody as unknown as IHttpRequestOptions['body'];
								multipartRequestOptions.json = false;
								multipartRequestOptions.headers = {
									...(multipartRequestOptions.headers ?? {}),
									'Content-Type': `multipart/form-data; boundary=${boundary}`,
									'Content-Length': String(multipartBody.length),
								};

								if (debugRequest && this.logger) {
									this.logger.info('Askmeeya document upload payload', {
										title,
										folderId,
										extractImages,
										binaryPropertyName,
										fileName: binaryData.fileName,
										contentType: binaryData.mimeType,
									});

									multipartRequestOptions.headers['X-Debug-1'] = title;
									multipartRequestOptions.headers['X-Debug-2'] = binaryPropertyName;
								}

								return multipartRequestOptions;
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
		displayName: 'Debug Request',
		name: 'debugRequest',
		type: 'boolean',
		default: false,
		description:
			'Whether to log payload details and add debug headers to help inspect the outbound request',
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
