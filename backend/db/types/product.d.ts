import { Document, Types } from 'mongoose';

export default interface IProduct extends Document {
	_id: Types.ObjectId;
	productCode: string;
	name: string;
	description: string;
	details: string;
	pricing_bifurcation: string;
	images: string[];
	videos: string[];
	tags: string[];
	price: number;
	discount: number;
	size: string | null;
	metal_color: string;
	metal_type: string;
	metal_quality: string;
	diamond_type: string | null;

	discontinued: boolean;

	createdAt: Date;
}
