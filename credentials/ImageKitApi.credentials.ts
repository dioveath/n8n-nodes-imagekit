import type {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ImageKitApi implements ICredentialType {
	name = 'imageKitApi';

	displayName = 'ImageKit API';

	documentationUrl = 'https://github.com/dioveath/n8n-nodes-imagekit';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:8000',
			description: 'Base URL of the ImageKit API service',
			required: true,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/health',
			method: 'GET',
		},
	};
}

