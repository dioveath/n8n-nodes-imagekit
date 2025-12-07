import type { INodeProperties } from 'n8n-workflow';
import { compositeHtmlImageProperties } from './compositeHtmlImage';

export const operationFields: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Composite HTML Image',
				value: 'compositeHtmlImage',
				action: 'Composite HTML image',
			},
			{
				name: 'List Fonts',
				value: 'listFonts',
				action: 'List available fonts',
			},
		],
		default: 'compositeHtmlImage',
	},
	...compositeHtmlImageProperties,
];

