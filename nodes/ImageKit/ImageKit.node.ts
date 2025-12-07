import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

interface FontMetadata {
	family: string;
	style: string;
	subfamily: string;
	weight: number;
	is_variable: boolean;
	path: string;
}

interface FontListResponse {
	fonts: FontMetadata[];
}

interface ImageCompositeRequest {
	html_inner: string;
	output?: 'png' | 'jpeg' | 'webp';
	local_fonts?: Array<{
		family: string;
		style?: string;
		subfamily?: string;
		weight?: number;
		is_variable?: boolean;
		path: string;
	}>;
	device_scale_factor?: number;
	image?: string; // base64 encoded image - optional
	width?: number;
	height?: number;
}

interface ImageResponse {
	image: string; // base64 encoded image
	format: string;
	width: number;
	height: number;
}

export class ImageKit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Image Kit',
		name: 'imageKit',
		icon: { dark: 'file:apple.svg', light: 'file:apple.svg' },
		group: ['transform'],
		version: [1, 1],
		description: 'HTML to Image conversion service with font support',
		defaults: {
			name: 'Image Kit',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'imageKitApi',
				required: true,
			},
		],
		properties: [
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
	};

	methods = {
		loadOptions: {
			async getFonts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('imageKitApi') as {
					baseUrl: string;
				};
				
				if (!credentials?.baseUrl) {
					return [];
				}

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${credentials.baseUrl}/api/v1/fonts/`,
						headers: {
							Accept: 'application/json',
						},
					}) as FontListResponse;

					if (!response.fonts || !Array.isArray(response.fonts)) {
						return [];
					}

					// Create unique font options by combining family, style, and weight
					const fontOptions: INodePropertyOptions[] = [];
					const seen = new Set<string>();

					for (const font of response.fonts) {
						const key = `${font.family}-${font.style}-${font.weight}`;
						if (!seen.has(key)) {
							seen.add(key);
							fontOptions.push({
								name: `${font.family}${font.style ? ` (${font.style})` : ''}${font.weight ? ` - Weight ${font.weight}` : ''}`,
								value: JSON.stringify({
									family: font.family,
									style: font.style,
									subfamily: font.subfamily,
									weight: font.weight,
									is_variable: font.is_variable,
									path: font.path,
								}),
							});
						}
					}

					return fontOptions;
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to load fonts: ${(error as Error).message}`,
					);
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials once before the loop
		const credentials = await this.getCredentials('imageKitApi') as {
			baseUrl: string;
		};
		const baseUrl = credentials.baseUrl;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				if (operation === 'compositeHtmlImage') {
					// Get HTML content
					const htmlInner = this.getNodeParameter('html_inner', i) as string;
					
					// Build request body
					const requestBody: ImageCompositeRequest = {
						html_inner: htmlInner,
					};

					// Get image binary data if useImage is enabled
					const useImage = this.getNodeParameter('useImage', i) as boolean;
					
					if (useImage) {
						const imageBinaryField = this.getNodeParameter('imageBinaryField', i) as string;
						
						// Check if binary data exists
						if (!items[i].binary?.[imageBinaryField]) {
							throw new NodeOperationError(
								this.getNode(),
								`No binary data found in field "${imageBinaryField}"`,
								{ itemIndex: i },
							);
						}
						
						// Convert binary to base64
						const imageBuffer = await this.helpers.getBinaryDataBuffer(i, imageBinaryField);
						const imageBase64 = imageBuffer.toString('base64');
						requestBody.image = imageBase64;
					}

					// Add optional parameters
					const output = this.getNodeParameter('output', i) as string;
					if (output) {
						requestBody.output = output as 'png' | 'jpeg' | 'webp';
					}

					const width = this.getNodeParameter('width', i);
					if (width) {
						requestBody.width = width as number;
					}

					const height = this.getNodeParameter('height', i);
					if (height) {
						requestBody.height = height as number;
					}

					const deviceScaleFactor = this.getNodeParameter('device_scale_factor', i);
					if (deviceScaleFactor !== undefined && deviceScaleFactor !== null) {
						requestBody.device_scale_factor = deviceScaleFactor as number;
					}

					// Handle fonts
					const fonts = this.getNodeParameter('fonts', i) as IDataObject;
					const localFonts: Array<{
						family: string;
						style?: string;
						subfamily?: string;
						weight?: number;
						is_variable?: boolean;
						path: string;
					}> = [];

					// Process fonts from fixedCollection
					if (fonts.font && Array.isArray(fonts.font)) {
						for (const fontEntry of fonts.font as IDataObject[]) {
							if (fontEntry.font) {
								try {
									const fontData = JSON.parse(fontEntry.font as string) as FontMetadata;
									localFonts.push({
										family: fontData.family,
										style: fontData.style,
										subfamily: fontData.subfamily,
										weight: fontData.weight,
										is_variable: fontData.is_variable,
										path: fontData.path,
									});
								} catch (error) {
									// Invalid font JSON, skip
								}
							}
						}
					}

					if (localFonts.length > 0) {
						requestBody.local_fonts = localFonts;
					}

					// Make API request
					const response = await this.helpers.httpRequest({
						method: 'POST',
						url: `${baseUrl}/api/v1/image/composite`,
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json',
						},
						body: requestBody,
						json: true,
					}) as ImageResponse;

					// Convert base64 response to binary
					const outputImageBuffer = Buffer.from(response.image, 'base64');
					const outputFormat = response.format || 'png';
					const mimeType = outputFormat === 'png' ? 'image/png' : outputFormat === 'jpeg' ? 'image/jpeg' : 'image/webp';

					returnData.push({
						json: {
							format: response.format,
							width: response.width,
							height: response.height,
						},
						binary: {
							data: await this.helpers.prepareBinaryData(
								outputImageBuffer,
								`composite.${outputFormat}`,
								mimeType,
							),
						},
						pairedItem: { item: i },
					});
				} else if (operation === 'listFonts') {
					// List fonts operation
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/v1/fonts/`,
						headers: {
							Accept: 'application/json',
						},
					}) as FontListResponse;

					returnData.push({
						json: { fonts: response.fonts } as IDataObject,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return this.prepareOutputData(returnData);
	}
}
