import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { FontListResponse, ImageKitCredentials } from '../types';

export async function getFonts(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const credentials = (await this.getCredentials('imageKitApi')) as ImageKitCredentials;
	if (!credentials?.baseUrl) {
		return [];
	}

	try {
		const response = (await this.helpers.httpRequest({
			method: 'GET',
			url: `${credentials.baseUrl}/api/v1/fonts/`,
			headers: {
				Accept: 'application/json',
			},
		})) as FontListResponse;

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
					name: `${font.family}${font.style ? ` (${font.style})` : ''}${
						font.weight ? ` - Weight ${font.weight}` : ''
					}`,
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
}

