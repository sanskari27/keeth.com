export type ProductsState = {
	list: Product[];
	selected: string[];
	editSelected: Product;
	uiDetails: {
		isSaving: boolean;
		isFetching: boolean;
		isDeleting: boolean;
		isCreating: boolean;
		isUpdating: boolean;
		error: string;
	};
};

type Product = {
	id: string;
	productCode: string;
	name: string;
	description: string;
	details: string;
	pricing_bifurcation: string;
	images: string[];
	videos: string[];
	tags: string[];
	size: string;
	metal_color: string;
	metal_type: string;
	metal_quality: string;
	diamond_type: string;
	price: number;
	discount: number;
	listed: boolean;
	discontinued: boolean;
	listedOn: string;
};
