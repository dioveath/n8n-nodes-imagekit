import type { INodeProperties } from 'n8n-workflow';

export const detectFacesProperties: INodeProperties[] = [
	{
		displayName: 'Image Binary Field',
		name: 'imageBinaryField',
		type: 'string',
		default: 'data',
		placeholder: 'data',
		description: 'Name of the binary field containing the image',
		displayOptions: {
			show: {
				resource: ['face'],
				operation: ['detectFaces'],
			},
		},
		required: true,
	},
	{
		displayName: 'Confidence Threshold',
		name: 'confidence_threshold',
		type: 'number',
		typeOptions: {
			minValue: 0,
			maxValue: 1,
			numberStepSize: 0.01,
		},
		default: 0.25,
		description: 'Minimum confidence threshold for face detection (0-1)',
		displayOptions: {
			show: {
				resource: ['face'],
				operation: ['detectFaces'],
			},
		},
	},
];

