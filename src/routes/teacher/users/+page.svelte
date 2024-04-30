<script lang="ts">
	import type { PageData } from './$types';
    import type { UserType } from '$lib/server/db/tables/user/UserType';

    export let data: PageData;

    let users: UserType[];
    let isModalOpen = false;
    let selectedUser: UserType | null = null;

    $: if (users == null) {
        users = data.users;
        //console.log(users);
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
                    Testų atlikinėtojai
                </p>
            </div>
        </header>
        <div class="card-content">
            <div class="content">
                <table class="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th class="for-dark-mode">#</th>
                            <th class="for-dark-mode">Atlikinėtojas</th>
                            <th class="for-dark-mode">Taškai</th>
                            <th class="for-dark-mode">Atlikti testai</th>
                            <th class="for-dark-mode">Registracijos Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each users as user}
                            {#if user.id != null && user.role != 'teacher'}
                                <tr>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.points}</td>
                                    <td><button type="button" class="button is-small is-info" on:click={() =>{
                                        selectedUser = user;
                                        isModalOpen = true;
                                    }}>{user.attempts.length}</button></td>
                                    <td>{user.register_date.getFullYear() + "-" + (user.register_date.getMonth() + 1) + "-" + user.register_date.getDate()}</td>
                                </tr>
                            {/if}
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>


{#if isModalOpen && selectedUser != null}
    <div class="modal is-active">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal-background" on:click={closeModal}></div>
        <div class="modal-content" style="background-color: white; font-size:large; padding:3%;">
            <h2><b>Visi atlikti testai</b></h2>
            <hr>
            <div style="margin-top:2%;">
                <table class="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Testo pavadinimas</th>
                            <th>Atlikimo data</th>
                            <th>Rezultatas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each selectedUser.attempts as attempt}
                            {#if attempt.id != null}
                                <tr>
                                    <td>{attempt.id}</td>
                                    <td>{attempt.quiz.title}</td>
                                    <td>{attempt.date.getFullYear() + "-" + (attempt.date.getMonth() + 1) + "-" + attempt.date.getDate()}</td>
                                    <td>{attempt.result}/{attempt.quiz.questions?.length ?? "NaN"}</td>
                                </tr>
                            {/if}
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" on:click={closeModal}></button>
    </div>
{/if}