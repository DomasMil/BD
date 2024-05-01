<script lang="ts">
	import type { PageData } from './$types';
    import type { MyUserType } from '$lib/server/db/tables/user/UserType';

    export let data: PageData;

    let users: MyUserType[];
	let currentPageUsers : MyUserType[];

    let currentPage = 1;
    const itemsPerPage = 5;
 

    let isModalOpen = false;
    let selectedUser: MyUserType | null = null;

    $: if (users == null) {
        users = data.users;
        //console.log(users);
    }

	$: {
		const startIndex = (currentPage - 1) * itemsPerPage;
    	const endIndex = startIndex + itemsPerPage;
    	currentPageUsers = users.slice(startIndex, endIndex);
    }

    function nextPage() {
        if (currentPage < Math.ceil(users.length / itemsPerPage)) {
            currentPage += 1;
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage -= 1;
        }
    }

    function closeModal() {
        isModalOpen = false;
    }

</script>


<div class="px-4 mt-5">
    <div class="card">
        <header class="card-header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <p class="title py-4 px-4">
                    Įmonės
                </p>
            </div>
        </header>
        <div class="card-content">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <!-- Button to add -->
                <button class="button is-primary mr-4" style="margin-top: 20px;">Pridėti</button>
            </div>
        </div>
        <div class="card-content">
            
            <div class="content">
                {#each currentPageUsers as user}
                    {#if user.id != null && user.role != 'admin'}
                        <div class="card">
                            <div class="card-content">
                                <div class="content">
                                    <p><b>Pavadinimas:</b> {user.id}</p>
                                    <p><b>Adresas:</b> {user.username}</p>
                                    <p><b>Įmonės kodas:</b> {user.role}</p>
                                    <p><b>Statybų objektai:</b> {user.email}</p>
                                    <button type="button" class="button is-small is-info" on:click={() =>{
                                        selectedUser = user;
                                        isModalOpen = true;
                                    }}>Redaguoti</button>
                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
</div>

<div class="pagination" role="navigation" aria-label="pagination">
    <button class="pagination-previous" disabled={currentPage === 1} on:click={prevPage}>Previous</button>
    <button class="pagination-next" disabled={currentPage === Math.ceil(users.length / itemsPerPage)} on:click={nextPage}>Next page</button>
    <ul class="pagination-list">
        {#each Array.from({ length: Math.ceil(users.length / itemsPerPage) }) as _, i}
            <li>
<button class="pagination-link" aria-label="Goto page {i + 1}" aria-current={currentPage === (i + 1)} disabled={currentPage === (i + 1)} on:click={() => { currentPage = i + 1; }}>{i + 1}</button>
            </li>
        {/each}
    </ul>
</div>