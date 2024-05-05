import {
	Box,
	Heading,
	Stat,
	StatArrow,
	StatHelpText,
	StatLabel,
	StatNumber,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import CartService from '../../../services/cart.service';
import Loading from '../../components/loading';

type StatData = {
	overall: {
		totalOrders: number;
		totalGrossSales: number;
		totalDiscounts: number;
		totalCouponDiscounts: number;
		totalAmountCollected: number;
		uniqueCustomersCount: number;
	};
	monthly: {
		totalOrders: number;
		totalGrossSales: number;
		totalDiscounts: number;
		totalCouponDiscounts: number;
		totalAmountCollected: number;
		year: number;
		month: number;
		uniqueCustomersCount: number;
	}[];
};

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [state, setState] = useState<StatData>({
		overall: {
			totalOrders: 0,
			totalGrossSales: 0,
			totalDiscounts: 0,
			totalCouponDiscounts: 0,
			totalAmountCollected: 0,
			uniqueCustomersCount: 0,
		},
		monthly: [],
	} as StatData);

	useEffect(() => {
		setLoading(true);
		CartService.statistics()
			.then(setState)
			.finally(() => setLoading(false));
	}, []);

	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;
	const currentYear = currentDate.getFullYear();
	const lastMonth = currentDate.getMonth() === 0 ? 12 : currentDate.getMonth();
	const lastMonthYear =
		lastMonth === 12 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

	const currMonth = state.monthly?.filter(
		(item) => item.year === currentYear && item.month === currentMonth
	)?.[0];

	const prevMonth = state.monthly?.filter(
		(item) => item.year === lastMonthYear && item.month === lastMonth
	)?.[0];

	const graphData = [
		['Year', 'Sales'],
		...(state.monthly && state.monthly.length > 0
			? state.monthly
					.reverse()
					.map((item) =>
						item.month > 10
							? [`${item.month}/${item.year}`, item.totalAmountCollected]
							: [`0${item.month}/${item.year}`, item.totalAmountCollected]
					)
			: [['No Data', 0]]),
	];
	console.log(graphData);

	if (loading) {
		return <Loading isLoaded={false} />;
	}

	return (
		<>
			<Box px={'2%'}>
				<Box>
					<Heading>Overall Statistics</Heading>
					<Box padding={'1rem'}>
						<Wrap spacing={'2rem'}>
							<WrapItem>
								<StatValueWithoutCompare
									title='Amount Collected'
									value={`₹ ${state.overall?.totalAmountCollected.toLocaleString()}`}
									helper='Jan 24 - Till Date'
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithoutCompare
									title='No of Orders'
									value={state.overall?.totalOrders.toLocaleString()}
									helper='Jan 24 - Till Date'
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithoutCompare
									title='Gross Sales'
									value={`₹ ${state.overall?.totalGrossSales.toLocaleString()}`}
									helper='Jan 24 - Till Date'
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithoutCompare
									title='Unique Customers'
									value={state.overall?.uniqueCustomersCount.toLocaleString()}
									helper='Jan 24 - Till Date'
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithoutCompare
									title='Discounts'
									value={`₹ ${state.overall?.totalDiscounts.toLocaleString()}`}
									helper='Jan 24 - Till Date'
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithoutCompare
									title='Coupon Discounts'
									value={`₹ ${state.overall?.totalCouponDiscounts.toLocaleString()}`}
									helper='Jan 24 - Till Date'
								/>
							</WrapItem>
						</Wrap>
					</Box>
				</Box>

				<Box mt={'2rem'}>
					<Heading>Monthly Analytics</Heading>
					<Box padding={'1rem'}>
						<Wrap spacing={'2rem'}>
							<WrapItem>
								<StatValueWithCompare
									title='Amount Collected'
									value={`₹ ${(currMonth?.totalAmountCollected ?? 0).toLocaleString()}`}
									currValue={currMonth?.totalAmountCollected ?? 0}
									prevValue={prevMonth?.totalAmountCollected ?? 0}
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithCompare
									title='No of Orders'
									value={(currMonth?.totalOrders ?? 0).toLocaleString()}
									currValue={currMonth?.totalOrders ?? 0}
									prevValue={prevMonth?.totalOrders ?? 0}
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithCompare
									title='Gross Sales'
									value={`₹ ${(currMonth?.totalGrossSales ?? 0).toLocaleString()}`}
									currValue={currMonth?.totalGrossSales ?? 0}
									prevValue={prevMonth?.totalGrossSales ?? 0}
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithCompare
									title='Unique Customers'
									value={(currMonth?.uniqueCustomersCount ?? 0).toLocaleString()}
									currValue={currMonth?.uniqueCustomersCount ?? 0}
									prevValue={prevMonth?.uniqueCustomersCount ?? 0}
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithCompare
									title='Discounts'
									value={`₹ ${(currMonth?.totalDiscounts ?? 0).toLocaleString()}`}
									currValue={currMonth?.totalDiscounts ?? 0}
									prevValue={prevMonth?.totalDiscounts ?? 0}
								/>
							</WrapItem>
							<WrapItem>
								<StatValueWithCompare
									title='Coupon Discounts'
									value={`₹ ${(currMonth?.totalCouponDiscounts ?? 0).toLocaleString()}`}
									currValue={currMonth?.totalCouponDiscounts ?? 0}
									prevValue={prevMonth?.totalCouponDiscounts ?? 0}
								/>
							</WrapItem>
						</Wrap>
					</Box>
				</Box>

				<Box mt={'2rem'}>
					<Heading>Monthly Visualisation</Heading>
					<Box padding={'1rem'}>
						<Chart
							chartType='LineChart'
							width='100%'
							height='400px'
							data={graphData}
							options={{
								title: 'Sales Performance',
								curveType: 'function',
								legend: { position: 'bottom' },
							}}
						/>
					</Box>
				</Box>
			</Box>
		</>
	);
}

function StatValueWithoutCompare({
	title,
	helper,
	value,
}: {
	title: string;
	value: string | number;
	helper?: string;
}) {
	return (
		<Stat
			rounded={'xl'}
			bgColor={'white'}
			dropShadow={'md'}
			shadow={'md'}
			paddingY={'1rem'}
			paddingX={'2rem'}
		>
			<StatLabel>{title}</StatLabel>
			<StatNumber>{value}</StatNumber>
			{helper && <StatHelpText>{helper}</StatHelpText>}
		</Stat>
	);
}

function StatValueWithCompare({
	title,
	value,
	currValue,
	prevValue,
}: {
	title: string;
	value: string | number;
	currValue: number;
	prevValue: number;
}) {
	const isProfit = currValue >= prevValue;
	const perc = prevValue === 0 ? 100 : Math.abs(((currValue - prevValue) / prevValue) * 100);
	return (
		<Stat
			rounded={'xl'}
			bgColor={'white'}
			dropShadow={'md'}
			shadow={'md'}
			paddingY={'1rem'}
			paddingX={'2rem'}
		>
			<StatLabel>{title}</StatLabel>
			<StatNumber>{value}</StatNumber>

			<StatHelpText>
				<StatArrow type={isProfit ? 'increase' : 'decrease'} />
				{perc.toFixed(2)} %
			</StatHelpText>
		</Stat>
	);
}
