'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductPage() {
	const queryParams = useSearchParams();
	const [params, setParams] = useState<{
		price_max: string;
		price_min: string;
		collections: string[];
		tag: string[];
		metal: string[];
		gold_purity: string;
		sorting: 'new' | 'low-high' | 'high-low' | 'discount' | undefined;
	}>({
		price_max: '',
		price_min: '',
		collections: [],
		tag: [],
		metal: [],
		gold_purity: '',
		sorting: undefined,
	});

	useEffect(() => {
		const allParams = Object.fromEntries(queryParams.entries());
		for (const [key, value] of Object.entries(allParams)) {
			if (key === 'collections' || key === 'tag' || key === 'metal') {
				setParams((prev) => ({
					...prev,
					[key]: value.split('+'),
				}));
			} else {
				setParams((prev) => ({
					...prev,
					[key]: value,
				}));
			}
		}
	}, [queryParams, setParams]);

	return (
		<div>
			<div>
				{params.collections.map((collection, index) => {
					return <div key={index}>{collection}</div>;
				})}
			</div>
			<div>{params.gold_purity}</div>
			<div>
				{params.metal.map((el, index) => {
					return <div key={index}>{el}</div>;
				})}
			</div>
			<div>{params.price_max}</div>
			<div>{params.price_min}</div>
			<div>
				{params.tag.map((el, index) => {
					return <div key={index}>{el}</div>;
				})}
			</div>
			<div>{params.sorting}</div>
		</div>
	);
}
