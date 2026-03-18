import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { ImageScaleRequest, ImageResponse } from '../types';

export async function executeScale(
    this: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
): Promise<INodeExecutionData> {
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

    const mode = this.getNodeParameter('mode', itemIndex) as 'fit' | 'fill' | 'stretch';
    const output = this.getNodeParameter('outputFormat', itemIndex) as 'png' | 'jpeg' | 'webp';

    const width = this.getNodeParameter('width', itemIndex, 0) as number;
    const height = this.getNodeParameter('height', itemIndex, 0) as number;

    if (!width && !height) {
        throw new NodeOperationError(
            this.getNode(),
            'At least one of "width" or "height" must be provided greater than 0.',
            { itemIndex },
        );
    }

    const requestBody: ImageScaleRequest = {
        image: imageBase64,
        mode,
        output,
    };
    if (width > 0) requestBody.width = width;
    if (height > 0) requestBody.height = height;

    const response = (await this.helpers.httpRequest({
        method: 'POST',
        url: `${baseUrl}/api/v1/image/scale`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: requestBody,
        json: true,
    })) as ImageResponse;

    const outputImageBuffer = Buffer.from(response.image, 'base64');
    const outputFormat = response.format || output;
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
                `scaled-image.${outputFormat}`,
                mimeType,
            ),
        },
        pairedItem: { item: itemIndex },
    };
}
