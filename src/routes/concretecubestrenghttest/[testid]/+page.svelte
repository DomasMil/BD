<script lang="ts">
	import type { PageData } from './$types';
    import { page } from '$app/stores';
    import type { MyUserType } from '$lib/server/db/tables/user/UserType';
	import type { StrengthTestListType } from '$lib/server/db/tables/strengthtest/StrengthTestType';
    import { goto } from '$app/navigation';
	import type { Page } from '@sveltejs/kit';

    export let data: PageData;


</script>


<main>
    <h1>Welcome to the Concrete Cube Strength Test Page</h1>
    <p>This is a basic page template for the Concrete Cube Strength Test.</p>
</main>
