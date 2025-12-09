import type { INodeProperties } from 'n8n-workflow';

export const removeBackgroundProperties: INodeProperties[] = [
	{
		displayName: 'Image Binary Field',
		name: 'imageBinaryField',
		type: 'string',
		default: 'data',
		placeholder: 'data',
		description: 'Name of the binary field containing the image',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['removeBackground'],
			},
		},
		required: true,
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getBackgroundModels',
		},
		default: 'u2net',
		description: 'Background-removal model to use',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['removeBackground'],
			},
		},
	},
];

