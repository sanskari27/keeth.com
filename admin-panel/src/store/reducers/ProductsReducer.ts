import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { Product, ProductsState } from '../types/ProductsState';

const initialState: ProductsState = {
	list: [] as Product[],
	selected: [],
	editSelected: {
		id: '',
		productCode: '',
		name: '',
		description: '',
		details: '',
		pricing_bifurcation: '',
		images: [],
		videos: [],
		tags: [],
		size: '',
		metal_color: '',
		metal_type: '',
		metal_quality: '',
		diamond_type: '',
		price: 0,
		discount: 0,
		listed: false,
		discontinued: false,
		listedOn: '',
	},
	uiDetails: {
		isSaving: false,
		isFetching: false,
		isDeleting: false,
		isCreating: false,
		isUpdating: false,
		error: '',
	},
};

const Slice = createSlice({
	name: StoreNames.COLLECTIONS,
	initialState,
	reducers: {
		reset: (state) => {
			state.list = initialState.list;
			state.selected = initialState.selected;
			state.editSelected = initialState.editSelected;
			state.uiDetails = initialState.uiDetails;
		},
		setCollections: (state, action: PayloadAction<typeof initialState.list>) => {
			state.list = action.payload;
		},
		editSelected: (state, action: PayloadAction<string>) => {
			const index = state.list.findIndex((c) => c.id === action.payload);
			if (index === -1) {
				return;
			}
			state.editSelected = state.list[index];
			state.uiDetails.isUpdating = true;
		},
		addSelectedCollection: (state, action: PayloadAction<string>) => {
			state.selected.push(action.payload);
		},
		removeSelectedCollection: (state, action: PayloadAction<string>) => {
			state.selected = state.selected.filter((el) => el !== action.payload);
		},
		setSaving: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isSaving = action.payload;
		},
		setFetching: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isFetching = action.payload;
		},
		setDeleting: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isDeleting = action.payload;
		},
		setCreating: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isCreating = action.payload;
		},
		setUpdating: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isUpdating = action.payload;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.uiDetails.error = action.payload;
		},
	},
});

export const {
	reset,
	addSelectedCollection,
	editSelected,
	removeSelectedCollection,
	setCollections,
	setCreating,
	setDeleting,
	setError,
	setFetching,
	setSaving,
	setUpdating,
} = Slice.actions;

export default Slice.reducer;
