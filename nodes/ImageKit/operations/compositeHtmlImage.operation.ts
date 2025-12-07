import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type {
	ImageCompositeRequest,
	ImageResponse,
	FontMetadata,
	LocalFont,
} from '../types';

export async function executeCompositeHtmlImage(
	this: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
): Promise<INodeExecutionData> {
	const htmlInner = this.getNodeParameter('html_inner', itemIndex) as string;
	const requestBody: ImageCompositeRequest = {
		html_inner: htmlInner,
	};
	const useImage = this.getNodeParameter('useImage', itemIndex) as boolean;

	if (useImage) {
		const imageBinaryField = this.getNodeParameter('imageBinaryField', itemIndex) as string;
		const items = this.getInputData();

		if (!items[itemIndex].binary?.[imageBinaryField]) {
			throw new NodeOperationError(
				this.getNode(),
				`No binary data found in field "${imageBinaryField}"`,
				{ itemIndex },
			);
		}

		const imageBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, imageBinaryField);
		const imageBase64 = imageBuffer.toString('base64');
		requestBody.image = imageBase64;
	}

	const output = this.getNodeParameter('output', itemIndex) as string;
	if (output) {
		requestBody.output = output as 'png' | 'jpeg' | 'webp';
	}

	const width = this.getNodeParameter('width', itemIndex);
	if (width) {
		requestBody.width = width as number;
	}

	const height = this.getNodeParameter('height', itemIndex);
	if (height) {
		requestBody.height = height as number;
	}

	const deviceScaleFactor = this.getNodeParameter('device_scale_factor', itemIndex);
	if (deviceScaleFactor !== undefined && deviceScaleFactor !== null) {
		requestBody.device_scale_factor = deviceScaleFactor as number;
	}

	const fonts = this.getNodeParameter('fonts', itemIndex) as IDataObject;
	const localFonts: LocalFont[] = [];

	if (fonts.font && Array.isArray(fonts.font)) {
		for (const fontEntry of fonts.font as IDataObject[]) {
			if (fontEntry.fontId) {
				try {
					const fontData = JSON.parse(fontEntry.fontId as string) as FontMetadata;
					localFonts.push({
						family: fontData.family,
						style: fontData.style,
						subfamily: fontData.subfamily,
						weight: fontData.weight,
						is_variable: fontData.is_variable,
						path: fontData.path,
					});
				} catch (error) {
					this.logger.error(`Invalid font JSON: ${error}`);
				}
			}
		}
	}

	if (localFonts.length > 0) {
		requestBody.local_fonts = localFonts;
	}

	const response = (await this.helpers.httpRequest({
		method: 'POST',
		url: `${baseUrl}/api/v1/image/composite`,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: requestBody,
		json: true,
	})) as ImageResponse;

	const outputImageBuffer = Buffer.from(response.image, 'base64');
	const outputFormat = response.format || 'png';
	const mimeType =
		outputFormat === 'png'
			? 'image/png'
			: outputFormat === 'jpeg'
				? 'image/jpeg'
				: 'image/webp';

	return {
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
		pairedItem: { item: itemIndex },
	};
}

