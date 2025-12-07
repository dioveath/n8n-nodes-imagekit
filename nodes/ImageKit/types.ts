export interface FontMetadata {
	family: string;
	style: string;
	subfamily: string;
	weight: number;
	is_variable: boolean;
	path: string;
}

export interface FontListResponse {
	fonts: FontMetadata[];
}

export interface LocalFont {
	family: string;
	style?: string;
	subfamily?: string;
	weight?: number;
	is_variable?: boolean;
	path: string;
}

export interface ImageCompositeRequest {
	html_inner: string;
	output?: 'png' | 'jpeg' | 'webp';
	local_fonts?: LocalFont[];
	device_scale_factor?: number;
	image?: string; // base64 encoded image - optional
	width?: number;
	height?: number;
}

export interface ImageResponse {
	image: string; // base64 encoded image
	format: string;
	width: number;
	height: number;
}

export interface ImageKitCredentials {
	baseUrl: string;
}

