<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	} from 'chart.js';
	import { format } from 'date-fns';
	import Button from '../button/button.svelte';
	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	);
	import { Icon, ArrowPath } from 'svelte-hero-icons';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Granularity } from '../../../../dto/enums/granularity';
	import { EnergyType } from '../../../../dto/enums/energyType';

	export let activity: number;
	export let classification: number;
	export let granularity: number;
	export let region: number;
	export let energyType: number;
	export let fromDate: string;
	export let toDate: string;

	let data = {
		solar: {
			capacity: [],
			volume: [],
			percentage: []
		},
		wind: {
			capacity: [],
			volume: [],
			percentage: []
		}
	};

	let options = {
		plugins: {
			legend: {
				labels: {
					color: 'white'
				}
			},
			filler: {
				propagate: true
			}
		},
		scales: {
			x: {
				grid: {
					display: true,
					color: 'rgb(255, 255, 255, 0.2)'
				},
				ticks: {
					color: 'white'
				}
			},
			y: {
				grid: {
					display: true,
					color: 'rgb(255, 255, 255, 0.2)'
				},
				ticks: {
					color: 'white'
				}
			}
		},
		maintainAspectRatio: false,
		responsive: true
	};

	const getFormatString = () => {
		switch (granularity) {
			case Granularity.TenMinutes:
			case Granularity.FifteenMinutes:
			case Granularity.Hour:
				return 'yyyy-MM-dd HH:mm';
			case Granularity.Day:
				return 'yyyy-MM-dd';
			case Granularity.Month:
				return 'yyyy-MM';
			default:
				return 'yyyy';
		}
	};

	const update = async () => {
		await fetchUtilizationData(
			region,
			EnergyType.Solar,
			granularity,
			classification,
			activity,
			fromDate,
			toDate
		);
		await fetchUtilizationData(
			region,
			EnergyType.Wind,
			granularity,
			classification,
			activity,
			fromDate,
			toDate
		);
	};

	async function fetchUtilizationData(
		region: number,
		energyType: number,
		granularity: number,
		classification: number,
		activity: number,
		fromDate: string,
		toDate: string
	) {
		try {
			const response = await fetch(
				`/api/ned/utilizations?page=1&itemsPerPage=144&point=${region}&type=${energyType}&granularity=${granularity}&granularitytimezone=1&classification=${classification}&activity=${activity}&validfrom%5Bbefore%5D=${toDate}&validfrom%5Bafter%5D=${fromDate}`
			);

			if (response.ok) {
				const responseJson = await response.json();

				if (energyType === EnergyType.Solar) {
					data.solar = {
						capacity: [],
						volume: [],
						percentage: []
					};
				} else {
					data.wind = {
						capacity: [],
						volume: [],
						percentage: []
					};
				}

				if (responseJson['@type'] === 'hydra:Error') {
					throw responseJson['hydra:description'] || 'An error occurred';
				}

				if (responseJson['hydra:totalItems'] === 0 || !responseJson['hydra:member']) {
					toast.error('No data found for the given paramaters');
				}

				for (var dataMember of responseJson['hydra:member']) {
					if (energyType === EnergyType.Solar) {
						data.solar.capacity.push({
							value: dataMember.capacity,
							validFrom: dataMember.validfrom,
							validTo: dataMember.validto
						});
						data.solar.volume.push({
							value: dataMember.volume,
							validFrom: dataMember.validfrom,
							validTo: dataMember.validto
						});
						data.solar.percentage.push({
							value: dataMember.percentage,
							validFrom: dataMember.validfrom,
							validTo: dataMember.validto
						});
					} else {
						data.wind.capacity.push({
							value: dataMember.capacity,
							validFrom: dataMember.validfrom,
							validTo: dataMember.validto
						});
						data.wind.volume.push({
							value: dataMember.volume,
							validFrom: dataMember.validfrom,
							validTo: dataMember.validto
						});
						data.wind.percentage.push({
							value: dataMember.percentage,
							validFrom: dataMember.validfrom,
							validTo: dataMember.validto
						});
					}
				}
			} else {
				const text = await response.text();
				throw new Error(text);
			}
		} catch (error: any) {
			toast.error(error);
		}
	}

	onMount(() => {
		fetchUtilizationData(
			region,
			EnergyType.Solar,
			granularity,
			classification,
			activity,
			fromDate,
			toDate
		);
		fetchUtilizationData(
			region,
			EnergyType.Wind,
			granularity,
			classification,
			activity,
			fromDate,
			toDate
		);
	});

	export { className as class };
</script>

<div class="mb-8 flex w-full justify-center">
	<Button class="bg-teal-400 text-white hover:text-gray-800" on:click={async () => await update()}
		>Refresh <Icon class="ml-2" src={ArrowPath} /></Button
	>
</div>
<div class="grid h-auto w-full grid-cols-1">
	<div class="mb-4 flex h-[400px] flex-col items-center">
		<Line
			data={{
				labels: data.solar.capacity.map((capacity) =>
					format(capacity.validFrom, getFormatString())
				),
				datasets: [
					{
						label: 'Capacity Solar',
						data: data.solar.capacity.map((capacity) => capacity.value),
						fill: true,
						backgroundColor: 'rgb(75, 192, 192, 0.2)',
						borderColor: 'rgb(75, 192, 192)',
						tension: 0
					},
					{
						label: 'Capacity Wind',
						data: data.wind.capacity.map((capacity) => capacity.value),
						fill: true,
						backgroundColor: 'rgb(33, 52, 255, 0.2)',
						borderColor: 'rgb(33, 52, 255)',
						tension: 0
					}
				]
			}}
			options={{
				...options,
				scales: {
					...options.scales,
					y: { ...options.scales.y, title: { text: 'kW', display: true, color: 'white' } }
				}
			}}
		/>
	</div>

	<div class="mb-4 flex h-[400px] flex-col items-center">
		<Line
			data={{
				labels: data.solar.volume.map((volume) => format(volume.validFrom, getFormatString())),
				datasets: [
					{
						label: 'Volume Solar',
						data: data.solar.volume.map((volume) => volume.value),
						fill: true,
						backgroundColor: 'rgb(229, 143, 255, 0.2)',
						borderColor: 'rgb(229, 143, 255)',
						tension: 0
					},
					{
						label: 'Volume Wind',
						data: data.wind.volume.map((volume) => volume.value),
						fill: true,
						backgroundColor: 'rgb(255, 28, 96, 0.2)',
						borderColor: 'rgb(255, 28, 96)',
						tension: 0
					}
				]
			}}
			options={{
				...options,
				scales: {
					...options.scales,
					y: { ...options.scales.y, title: { text: 'kWh', display: true, color: 'white' } }
				}
			}}
		/>
	</div>

	<div class="mb-4 flex h-[400px] flex-col items-center">
		<Line
			data={{
				labels: data.solar.percentage.map((percentage) =>
					format(percentage.validFrom, getFormatString())
				),
				datasets: [
					{
						label: 'Percentage Solar',
						data: data.solar.percentage.map((percentage) => percentage.value),
						fill: true,
						backgroundColor: 'rgb(255, 212, 143, 0.2)',
						borderColor: 'rgb(255, 212, 143)',
						tension: 0
					},
					{
						label: 'Percentage Wind',
						data: data.wind.percentage.map((percentage) => percentage.value),
						fill: true,
						backgroundColor: 'rgb(147, 255, 89, 0.2)',
						borderColor: 'rgb(147, 255, 89)',
						tension: 0
					}
				]
			}}
			{options}
		/>
	</div>
</div>
