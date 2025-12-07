import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { FontListResponse } from '../types';

export async function executeListFonts(
	this: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
): Promise<INodeExecutionData> {
	const response = (await this.helpers.httpRequest({
		method: 'GET',
		url: `${baseUrl}/api/v1/fonts/`,
		headers: {
			Accept: 'application/json',
		},
	})) as FontListResponse;

	return {
		json: { fonts: response.fonts } as IDataObject,
		pairedItem: { item: itemIndex },
	};
}

