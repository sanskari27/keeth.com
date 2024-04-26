import { configureStore } from '@reduxjs/toolkit';

import { StoreNames } from './config';
import { default as CollectionsReducer } from './reducers/CollectionsReducer';
import { default as ProductsReducer } from './reducers/ProductsReducer';
import { default as CouponReducer } from './reducers/CouponReducer';

const store = configureStore({
	reducer: {
		[StoreNames.COLLECTIONS]: CollectionsReducer,
		[StoreNames.PRODUCTS]: ProductsReducer,
		[StoreNames.COUPONS]: CouponReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

export type StoreState = ReturnType<typeof store.getState>;
