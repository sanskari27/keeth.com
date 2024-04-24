import { useBoolean } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { DATA_LOADED_DELAY } from '../config/const';
import CollectionService from '../services/collection.service';
import { store } from '../store';
import { setCollections } from '../store/reducers/CollectionsReducer';
import { Collection } from '../store/types/CollectionsState';
import { useAuth } from './useAuth';

export default function useUserData() {
	const [hasError, setError] = useState(false);
	const [dataLoaded, setDataLoaded] = useBoolean(false);
	const { isAuthenticated } = useAuth();

	const fetchUserDetails = useCallback(async () => {
		try {
			const promises = [CollectionService.getCollection(), addDelay(DATA_LOADED_DELAY)];

			const results = await Promise.all(promises);

			store.dispatch(setCollections(results[0] as Collection[]));
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
