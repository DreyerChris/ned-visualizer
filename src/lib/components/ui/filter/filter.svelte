<script lang="ts">
	import { Label } from '../label';
	import * as Select from '$lib/components/ui/select';
	import type { EnumLike } from 'zod';

	export let onChange: (e: any) => void;
	export let label: string;
	export let filterEnum: EnumLike;
	export let value: number;

	export { className as class };
</script>

<div class="flex flex-col space-y-3">
	<Label>{label}</Label>
	<Select.Root onSelectedChange={(e) => onChange(e)}>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder={filterEnum[value]} />
		</Select.Trigger>
		<Select.Content>
			{#each Object.keys(filterEnum) as key (key)}
				{#if isNaN(Number(key))}
					<Select.Item value={filterEnum[key]}>{key}</Select.Item>
				{/if}
			{/each}
		</Select.Content>
		<Select.Input name={label.toLocaleLowerCase()} />
	</Select.Root>
</div>
