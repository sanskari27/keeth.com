import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { Collection, CollectionsState } from '../types/CollectionsState';

const initialState: CollectionsState = {
	list: [] as Collection[],
	selected: [],
	editSelected: {
		id: '',
		name: '',
		image: '',
		tags: [],
		visibleAtHome: false,
	},
	uiDetails: {
		isSaving: false,
		isFetching: false,
		isDeleting: false,
		isCreating: false,
		isUpdating: false,
		error: '',
	},
	fileDetails: {
		file: null,
		size: '',
		type: '',
		url: '',
	},
	tagsString: '',
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
			state.fileDetails = initialState.fileDetails;
			state.tagsString = initialState.tagsString;
		},
		setCollections: (state, action: PayloadAction<typeof initialState.list>) => {
			state.list = action.payload;
		},
		addCollection: (state, action: PayloadAction<(typeof initialState.list)[0]>) => {
			state.list.push(action.payload);
		},
		editSelected: (state, action: PayloadAction<string>) => {
			state.fileDetails = initialState.fileDetails;
			state.tagsString = initialState.tagsString;
			if (action.payload === 'new') {
				state.editSelected = initialState.editSelected;
			}
			const index = state.list.findIndex((c) => c.id === action.payload);
			if (index === -1) {
				return;
			}
			state.editSelected = state.list[index];
			state.uiDetails.isUpdating = true;
			state.tagsString = state.editSelected.tags.join(', ');
		},
		setName: (state, action: PayloadAction<string>) => {
			state.editSelected.name = action.payload;
			state.uiDetails.error = '';
		},
		addSelectedCollection: (state, action: PayloadAction<string>) => {
			state.selected.push(action.payload);
		},
		removeSelectedCollection: (state, action: PayloadAction<string>) => {
			state.selected = state.selected.filter((el) => el !== action.payload);
		},
		updateVisibility: (state, action: PayloadAction<{ id: string; visible: boolean }>) => {
			state.list = state.list.map((e) => {
				if (e.id === action.payload.id) {
					return {
						...e,
						visibleAtHome: action.payload.visible,
					};
				}
				return e;
			});
		},

		setFile: (
			state,
			action: PayloadAction<{
				file: typeof initialState.fileDetails.file;
				type: string;
				size: string;
				url: string;
			}>
		) => {
			state.fileDetails.file = action.payload.file;
			state.fileDetails.type = action.payload.type;
			state.fileDetails.url = action.payload.url;
			state.fileDetails.size = action.payload.size;
			state.uiDetails.error = '';
		},
		removeFile: (state) => {
			state.fileDetails.file = null;
			state.fileDetails.type = '';
			state.fileDetails.url = '';
			state.fileDetails.size = '';
		},
		setTagString: (state, action: PayloadAction<string>) => {
			state.tagsString = action.payload;
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
	updateVisibility,
	setCollections,
	setCreating,
	setDeleting,
	setError,
	setFetching,
	setName,
	setSaving,
	setUpdating,
	removeFile,
	setFile,
	setTagString,
	addCollection,
} = Slice.actions;

export default Slice.reducer;
