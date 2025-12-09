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
		displayName: 'Model Name or ID',
		name: 'model',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getBackgroundModels',
		},
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['removeBackground'],
			},
		},
	},
];

