import type { INodeProperties } from 'n8n-workflow';
import { compositeHtmlImageProperties } from './compositeHtmlImage.properties';
import { detectFacesProperties } from './detectFaces.properties';
import { cropFaceProperties } from './cropFace.properties';
import { listBackgroundModelsProperties } from './listBackgroundModels.properties';
import { removeBackgroundProperties } from './removeBackground.properties';

export const operationFields: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		options: [
			{ name: 'Image', value: 'image' },
			{ name: 'Face', value: 'face' },
		],
		default: 'image',
	},
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
				displayOptions: { show: { resource: ['image'] } },
			},
			{
				name: 'List Fonts',
				value: 'listFonts',
				action: 'List available fonts',
				displayOptions: { show: { resource: ['image'] } },
			},
			{
				name: 'Detect Faces',
				value: 'detectFaces',
				action: 'Detect faces in image',
				displayOptions: { show: { resource: ['face'] } },
			},
			{
				name: 'Crop Face',
				value: 'cropFace',
				action: 'Crop face from image',
				displayOptions: { show: { resource: ['face'] } },
			},
			{
				name: 'List Background Models',
				value: 'listBackgroundModels',
				action: 'List background models',
				displayOptions: { show: { resource: ['image'] } },
			},
			{
				name: 'Remove Background',
				value: 'removeBackground',
				action: 'Remove image background',
				displayOptions: { show: { resource: ['image'] } },
			},
		],
		default: 'compositeHtmlImage',
	},
	...compositeHtmlImageProperties,
	...detectFacesProperties,
	...cropFaceProperties,
	...listBackgroundModelsProperties,
	...removeBackgroundProperties,
];

