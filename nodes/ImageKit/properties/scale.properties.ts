import type { INodeProperties } from 'n8n-workflow';

export const scaleProperties: INodeProperties[] = [
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
                operation: ['scale'],
            },
        },
        required: true,
    },
    {
        displayName: 'Width',
        name: 'width',
        type: 'number',
        default: 0,
        description: 'Target width in pixels. Leave empty or 0 to keep original scale (when only height is specified).',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['scale'],
            },
        },
    },
    {
        displayName: 'Height',
        name: 'height',
        type: 'number',
        default: 0,
        description: 'Target height in pixels. Leave empty or 0 to keep original scale (when only width is specified).',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['scale'],
            },
        },
    },
    {
        displayName: 'Scaling Mode',
        name: 'mode',
        type: 'options',
        options: [
            {
                name: 'Fit',
                value: 'fit',
                description: 'Preserve aspect ratio, fit within bounds',
            },
            {
                name: 'Fill',
                value: 'fill',
                description: 'Crop to fill bounds',
            },
            {
                name: 'Stretch',
                value: 'stretch',
                description: 'Ignore aspect ratio',
            },
        ],
        default: 'fit',
        description: 'How the image should be resized to fit the target dimensions',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['scale'],
            },
        },
    },
    {
        displayName: 'Output Format',
        name: 'outputFormat',
        type: 'options',
        options: [
            { name: 'PNG', value: 'png' },
            { name: 'JPEG', value: 'jpeg' },
            { name: 'WebP', value: 'webp' },
        ],
        default: 'png',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['scale'],
            },
        },
    },
];
