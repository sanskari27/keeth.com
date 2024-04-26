export type CollectionsState = {
	list: Collection[];
	selected: string[];
	editSelected: Collection;
	uiDetails: {
		isSaving: boolean;
		isFetching: boolean;
		isDeleting: boolean;
		isCreating: boolean;
		isUpdating: boolean;
		error: string;
	};
	fileDetails: {
		file: File | null;
		size: string;
		url: string;
		type: string;
	};
	tagsString: string;
};

type Collection = {
	id: string;
	name: string;
	image: string;
	tags: string[];
	visibleAtHome: boolean;
	productCodes: string[];
};
