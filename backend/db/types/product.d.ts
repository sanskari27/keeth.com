import { Document, Types } from 'mongoose';

type Customization = {
	kind: string;
	type: string;
	value: string;
};

export default interface IProduct extends Document {
	_id: Types.ObjectId;
	name: string;
	description: string;
	images: string[];
	videos: string[];
	tags: string[];
	price: number;
	discount: number;

	metal_color: string[];
	metal_type: string[];
	metal_quality: string[];
	diamond_type: string[];

	listed: boolean;

	createdAt: Date;
}

export interface IProductOption extends Document {
	_id: Types.ObjectId;
	product: Types.ObjectId;
	productCode: string;
	price: number;
	discount: number;
	description: string;
	images: string[];
	videos: string[];
	metal_color: string;
	metal_type: string;
	metal_quality: string;
	diamond_type: string;
}
