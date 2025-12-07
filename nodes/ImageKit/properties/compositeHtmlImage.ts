import type { INodeProperties } from 'n8n-workflow';

export const compositeHtmlImageProperties: INodeProperties[] = [
	{
		displayName: 'HTML',
		name: 'html_inner',
		type: 'string',
		typeOptions: {
			rows: 20,
		},
		default: '<div>Hello, world!</div>',
		placeholder: '<div>Hello, world!</div>',
		description: 'HTML content to overlay on the image',
		displayOptions: {
			show: {
				operation: ['compositeHtmlImage'],
			},
		},
		required: true,
	},
	{
		displayName: 'Use Image',
		name: 'useImage',
		type: 'boolean',
		default: false,
		description: 'Whether to composite HTML on an existing image',
		displayOptions: {
			show: {
				operation: ['compositeHtmlImage'],
			},
		},
	},
	{
		displayName: 'Image Binary Field',
		name: 'imageBinaryField',
		type: 'string',
		default: 'data',
		placeholder: 'data',
		description: 'Name of the binary field containing the image',
		displayOptions: {
			show: {
				operation: ['compositeHtmlImage'],
				useImage: [true],
			},
		},
		required: false,
	},
	{
		displayName: 'Output Format',
		name: 'output',
		type: 'options',
		options: [
			{ name: 'PNG', value: 'png' },
			{ name: 'JPEG', value: 'jpeg' },
			{ name: 'WebP', value: 'webp' },
		],
		default: 'png',
		description: 'Output image format',
		displayOptions: {
			show: {
				operation: ['compositeHtmlImage'],
			},
		},
	},
	{
		displayName: 'Width',
		name: 'width',
		type: 'number',
		default: '',
		description: 'Output image width in pixels',
		displayOptions: {
			show: {
				operation: ['compositeHtmlImage'],
			},
		},
	},
	{
		displayName: 'Height',
		name: 'height',
		type: 'number',
		default: '',
		description: 'Output image height in pixels',
		displayOptions: {
			show: {
				operation: ['compositeHtmlImage'],
			},
		},
	},
	{
		displayName: 'Device Scale Factor',
		name: 'device_scale_factor',
		type: 'number',
		typeOptions: {
			minValue: 0.1,
			maxValue: 5,
			numberStepSize: 0.1,
		},
		default: 1,
		description: 'Device pixel ratio (1 = normal, 2 = retina, etc.)',
		displayOptions: {
			show: {
				operation: ['compositeHtmlImage'],
			},
		},
	},
	{
		displayName: 'Fonts',
		name: 'fonts',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Font',
		default: {},
		description: 'Fonts to use for HTML rendering. Loads dynamically from the API.',
		displayOptions: {
			show: {
				operation: ['compositeHtmlImage'],
			},
		},
		options: [
			{
				displayName: 'Font',
				name: 'font',
				values: [
					{
						displayName: 'Font',
						name: 'font',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getFonts',
						},
						default: '',
						description: 'Select a font from available fonts',
					},
				],
			},
		],
	},
];

