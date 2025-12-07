import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { getFonts } from './listSearch/getFonts';
import { executeCompositeHtmlImage } from './operations/compositeHtmlImage.operation';
import { executeListFonts } from './operations/listFonts.operation';
import { operationFields } from './properties';
import type { ImageKitCredentials } from './types';

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
		properties: operationFields,
	};

	methods = {
		loadOptions: {
			getFonts,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials once before the loop
		const credentials = (await this.getCredentials('imageKitApi')) as ImageKitCredentials;
		const baseUrl = credentials.baseUrl;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				if (operation === 'compositeHtmlImage') {
					const result = await executeCompositeHtmlImage.call(this, i, baseUrl);
					returnData.push(result);
				} else if (operation === 'listFonts') {
					const result = await executeListFonts.call(this, i, baseUrl);
					returnData.push(result);
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
