<script lang="ts">
	import { Label } from '../label';
	import * as Popover from '$lib/components/ui/popover';
	import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { Button } from '../button';
	import { RangeCalendar } from '../range-calendar';
	import type { DateRange } from 'bits-ui';

	let popoverClose: HTMLButtonElement | undefined = undefined;
	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let startValue: DateValue | undefined = undefined;

	export let value: DateRange | undefined;

	export { className as class };
</script>

<div class="flex flex-col space-y-3">
	<Label>Date range</Label>
	<Popover.Root openFocus>
		<Popover.Trigger asChild let:builder>
			<Button
				variant="outline"
				class={'w-[300px] justify-start text-left font-normal' + !value
					? ''
					: 'text-muted-foreground'}
				builders={[builder]}
			>
				{#if value && value.start}
					{#if value.end}
						{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
							value.end.toDate(getLocalTimeZone())
						)}
					{:else}
						{df.format(value.start.toDate(getLocalTimeZone()))}
					{/if}
				{:else if startValue}
					{df.format(startValue.toDate(getLocalTimeZone()))}
				{:else}
					Pick a date
				{/if}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar
				bind:value
				bind:startValue
				placeholder={value?.start}
				initialFocus
				numberOfMonths={2}
				onValueChange={(e) => {
					if (e.start === undefined || e.end === undefined) return;
					console.log(e);
					popoverClose?.click();
				}}
			/>
			<Popover.Close bind:el={popoverClose} />
		</Popover.Content>
	</Popover.Root>
</div>
