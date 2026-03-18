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

export interface FaceDetectionRequest {
	image: string; // base64 encoded image
	confidence_threshold?: number;
}

export interface Face {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	confidence: number;
}

export interface FaceDetectionResponse {
	faces: Face[];
	count: number;
}

export interface FaceCropRequest {
	image: string; // base64 encoded image
	confidence_threshold?: number;
	width?: number;
	height?: number;
	respect_aspect_ratio?: boolean;
}

export interface FaceCropResponse {
	image: string; // base64 encoded image
	width: number;
	height: number;
	face_confidence: number;
}

export interface BackgroundModel {
	id: string;
	description: string;
	pros: string;
}

export type BackgroundModelsResponse = BackgroundModel[];

export interface RemoveBackgroundRequest {
	image: string; // base64 encoded image
	model?: string;
}

export interface RemoveBackgroundResponse {
	image: string; // base64 encoded image
	format: string; // e.g. "png"
	width: number;
	height: number;
}

export interface ImageScaleRequest {
	image: string; // base64 encoded image
	width?: number; // target width
	height?: number; // target height
	mode?: 'fit' | 'fill' | 'stretch';
	output?: 'png' | 'jpeg' | 'webp';
	webhook_url?: string;
}

