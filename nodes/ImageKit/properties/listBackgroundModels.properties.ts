import type { INodeProperties } from 'n8n-workflow';

export const listBackgroundModelsProperties: INodeProperties[] = [
	{
		displayName: 'No Fields',
		name: 'noFields',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['listBackgroundModels'],
			},
		},
		description: 'This operation has no additional fields.',
	},
];

