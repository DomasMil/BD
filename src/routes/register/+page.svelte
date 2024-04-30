<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="container" style="max-width: 55ch;">
	<h1 class="is-size-3 has-text-weight-semibold my-4">Registruotis</h1>
	<form method="post" action="?/register">
		<input
			class="input my-2"
			type="text"
			placeholder="Vardas Pavardė"
			name="name"
			required
		/>		
		<input
			class="input my-2"
			type="text"
			placeholder="Vartotojo vardas"
			name="username"
			required
		/>
		<input
			class="input my-2"
			type="password"
			placeholder="Slaptažodis"
			name="password"
			required
		/>
		<input
			class="input my-2"
			type="email"
			placeholder="El. paštas"
			name="email"
			required
		/>
		{#if form?.errorMessage}
			<div class="has-text-danger my-2">{form.errorMessage}</div>
		{/if}
		<button class="button is-primary mt-4 is-fullwidth" type="submit" formaction="?/register"
			>Registruotis</button
		>
		<hr />
		<a class="button mt-4 mr-3 is-fullwidth" href="/login"
			>Prisijungti</a
		>
	</form>
</div>
