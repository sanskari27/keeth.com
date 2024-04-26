import { useBoolean } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { DATA_LOADED_DELAY } from '../config/const';
import CollectionService from '../services/collection.service';
import CouponService from '../services/coupon.service';
import ProductService from '../services/product.service';
import { store } from '../store';
import { setCollections } from '../store/reducers/CollectionsReducer';
import { setCoupons } from '../store/reducers/CouponReducer';
import { setProductGroups, setProducts } from '../store/reducers/ProductsReducer';
import { Collection } from '../store/types/CollectionsState';
import { Coupon } from '../store/types/CouponState';
import { Product, ProductGroup } from '../store/types/ProductsState';
import { useAuth } from './useAuth';

export default function useUserData() {
	const [hasError, setError] = useState(false);
	const [dataLoaded, setDataLoaded] = useBoolean(false);
	const { isAuthenticated } = useAuth();

	const fetchUserDetails = useCallback(async () => {
		try {
			const promises = [
				CollectionService.getCollection(),
				ProductService.listDistinctProducts(),
				ProductService.listProductGroups(),
				CouponService.listCoupons(),
				addDelay(DATA_LOADED_DELAY),
			];

			const results = await Promise.all(promises);

			store.dispatch(setCollections(results[0] as Collection[]));
			store.dispatch(setProducts(results[1] as Product[]));
			store.dispatch(setProductGroups(results[2] as ProductGroup[]));
			store.dispatch(setCoupons(results[3] as Coupon[]));
			setDataLoaded.on();
		} catch (e) {
			setError(true);
			setDataLoaded.on();
			return;
		}
	}, [setDataLoaded]);

	useEffect(() => {
		if (isAuthenticated) {
			setDataLoaded.off();
			fetchUserDetails();
		}
	}, [fetchUserDetails, setDataLoaded, isAuthenticated]);

	return {
		loading: !dataLoaded,
		error: hasError,
	};
}

function addDelay(delay: number) {
	return new Promise((resolve: (value?: null) => void) => {
		setTimeout(() => {
			resolve();
		}, delay);
	});
}
