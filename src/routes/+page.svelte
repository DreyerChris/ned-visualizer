<script lang="ts">
	import Ned from '$lib/components/icons/ned.svelte';
	import EnergyGraph from '$lib/components/ui/energy-graph/energy-graph.svelte';
	import Filter from '$lib/components/ui/filter/filter.svelte';
	import { Activity } from '../dto/enums/activity';
	import { Classification } from '../dto/enums/classification';
	import { EnergyType } from '../dto/enums/energyType';
	import { Granularity } from '../dto/enums/granularity';
	import { Region } from '../dto/enums/region';
	import { getLocalTimeZone, CalendarDate } from '@internationalized/date';
	import { format } from 'date-fns';
	import DateRangePicker from '$lib/components/ui/date-range/date-range.svelte';
	import type { DateRange } from 'bits-ui';
	import SolarAndWindGraph from '$lib/components/ui/energy-graph/solar-and-wind-graph.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	let activity = Activity.Production;
	let granularity = Granularity.Hour;
	let region = Region.Nederland;
	let energyType = EnergyType.Solar;
	let classification = Classification.Forecast;
	let date: DateRange | undefined = {
		start: new CalendarDate(
			new Date().getFullYear(),
			new Date().getMonth() + 1,
			new Date().getDate()
		),
		end: new CalendarDate(
			new Date().getFullYear(),
			new Date().getMonth() + 1,
			new Date().getDate() + 1
		)
	};
</script>

<div class="flex h-full w-full justify-center bg-black text-white">
	<div class="m-8 flex w-full flex-col items-center space-y-5">
		<div class="">
			<Ned />
		</div>
		<h1 class="text-4xl font-extrabold tracking-tight">NED Visualizer</h1>
		<div class="!mt-10 flex items-center justify-between space-x-5">
			<Filter
				label="Activity"
				filterEnum={Activity}
				value={activity}
				onChange={(e) => (activity = e?.value)}
			/>
			<Filter
				label="Granularity"
				filterEnum={Granularity}
				value={granularity}
				onChange={(e) => (granularity = e?.value)}
			/>
			<Filter
				label="Region"
				filterEnum={Region}
				value={region}
				onChange={(e) => (region = e?.value)}
			/>
			<Filter
				label="Energy type"
				filterEnum={EnergyType}
				value={energyType}
				onChange={(e) => (energyType = e?.value)}
			/>
			<Filter
				label="Classification"
				filterEnum={Classification}
				value={classification}
				onChange={(e) => (classification = e?.value)}
			/>
			<DateRangePicker bind:value={date} />
		</div>
		<div class="!mt-14 flex w-full justify-center">
			<Tabs.Root value="solarVsWind" class="flex w-full flex-col">
				<Tabs.List class="mx-auto">
					<Tabs.Trigger value="solarVsWind">Solar vs Wind</Tabs.Trigger>
					<Tabs.Trigger value="standard">Standard Utilization</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="solarVsWind">
					<div class="mt-8">
						<SolarAndWindGraph
							{activity}
							{granularity}
							{region}
							{energyType}
							{classification}
							fromDate={format(
								date?.start?.toDate(getLocalTimeZone()) ?? '2000-01-01',
								'yyyy-MM-dd'
							)}
							toDate={format(date?.end?.toDate(getLocalTimeZone()) ?? '2000-01-02', 'yyyy-MM-dd')}
						/>
					</div>
				</Tabs.Content>
				<Tabs.Content value="standard">
					<div class="mt-8">
						<EnergyGraph
							{activity}
							{granularity}
							{region}
							{energyType}
							{classification}
							fromDate={format(
								date?.start?.toDate(getLocalTimeZone()) ?? '2000-01-01',
								'yyyy-MM-dd'
							)}
							toDate={format(date?.end?.toDate(getLocalTimeZone()) ?? '2000-01-02', 'yyyy-MM-dd')}
						/>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>
