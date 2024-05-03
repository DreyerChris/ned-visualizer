<script>
	import { Toaster } from 'svelte-sonner';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher defaultMode={'dark'} track={false} />
<Toaster richColors expand={true} />
<div class="h-screen w-screen">
	<slot />
</div>
