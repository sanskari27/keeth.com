// app/providers.tsx
'use client';

import { createSession } from '@/services/session.service';
import { ChakraProvider } from '@chakra-ui/react';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		if (!localStorage) return;
		const currentDate = new Date().toDateString();

		const lastExecutionDate = localStorage.getItem('lastExecutionDate');

		if (lastExecutionDate !== currentDate) {
			createSession();
			localStorage.setItem('lastExecutionDate', currentDate);
		}
	}, []);
	return <ChakraProvider>{children}</ChakraProvider>;
}
