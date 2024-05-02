<script lang="ts">
	import type { PageData } from './$types';
    import type { MyUserType } from '$lib/server/db/tables/user/UserType';
	import type { ActionData } from './$types';

    // Variable to store selected date and time
    let selectedDateTime = '';

    let users: MyUserType[];
    export let data: PageData;
	export let form: ActionData;
  
    $: if (users == null) {
        users = data.users;
        //console.log(users);
    }

        // Define a variable to hold the count of iterations
        let numberOfSamples = 1; // Default value

    // Function to update the count of iterations based on the input value
    function updateNumberOfSamples(event: { target: { value: string; }; }) {
    numberOfSamples = parseInt(event.target.value) || 1; // Default to 1 if parsing fails
}

</script>


<div class="px-4 mt-5">
    <div class="card">
        <header class="card-header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <p class="title py-4 px-4">
                    Kubelinio stiprio bandymo forma
                </p>
            </div>
        </header>
        <div class="card-content">
            <div class="content">
                <form method="post" action="?/register">
                    <div class="container" style="max-width: 50%;">
                        <div class="input-container">
                            <label for="name">Užsakovas:</label>
                            <input
                                id="name"
                                class="input my-2"
                                type="text"
                                name="name"
                                required
                            />
                        </div>
                        <div class="select">
                            <label for="name">Užsakovo statybos objektas:</label>
                            <select bind:value={users}>
                                {#each users as user}
                                    <option value={user.id}>{user.username}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="select">
                            <form action="/action_page.php">
                                <label for="birthdaytime">Bandinių gavimo/pristatymo data:</label>
                                <input type="datetime-local" id="birthdaytime" name="birthdaytime">
                                <!-- <input type="submit"> -->
                            </form>
                        </div>
                        <div class="select">
                            <label for="name">Bandinius pristatė:</label>
                            <select bind:value={users}>
                                {#each users as user}
                                    <option value={user.id}>{user.username}</option>
                                {/each}
                            </select>
                        </div>
                        <div>
                            <label for="name">Bandinių pristatymo komentaras:</label>
                            <textarea class="textarea" placeholder=""></textarea>
                        </div>
                        <div class="input-container">
                            <label for="sampleCount">Pristatytų bandinių kiekis:</label>
                            <input
                                id="sampleCount"
                                class="input my-2"
                                type="number"
                                min="1"
                                name="sampleCount"
                                required
                                on:input={updateNumberOfSamples}
                            />
                        </div>
                        <div class="select">
                            <label for="name">Bandymo tipas:</label>
                            <select bind:value={users}>
                                {#each users as user}
                                    <option value={user.id}>{user.username}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="input-container">
                            <label for="name">Išbandytos imties dydis:</label>
                            <input
                                id="name"
                                class="input my-2"
                                type="text"
                                name="name"
                                required
                            />
                        </div>
                        <div class="input-container">
                            <label for="name">išbrokuotų kubelių kiekis:</label>
                            <input
                                id="name"
                                class="input my-2"
                                type="text"
                                name="name"
                                required
                            />
                        </div>
                        <div class="select">
                            <label for="name">Betono tipas:</label>
                            <select bind:value={users}>
                                {#each users as user}
                                    <option value={user.id}>{user.username}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="select">
                            <form action="/action_page.php">
                                <label for="birthdaytime">Bandymo data:</label>
                                <input type="datetime-local" id="birthdaytime" name="birthdaytime">
                                <!-- <input type="submit"> -->
                            </form>
                        </div>
                        <div class="input-container">
                            <label for="name">Bandytojas:</label>
                            <input
                                id="name"
                                class="input my-2"
                                type="text"
                                name="name"
                                required
                            />
                        </div>
                    </div>
                    <div class="container" style="max-width: 80%;">
                        <table class="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Bandino NR.</th>
                                    <th class="center-text">Skerspjūvio matmenys</th>
                                    <th>Ardančioji jėga F, kN</th>
                                    <th>Stipris gniuždant fc, MPa</th>
                                    <th>Pastabos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each [...Array(numberOfSamples).keys()] as index}
                                    <tr>
                                        <td>
                                            <input type="text" name={`bandino-${index}`} class="input" />
                                        </td>
                                        <td>
                                            <div class="field is-flex">
                                                <div>
                                                    <label class="label">a</label>
                                                    {#each [1, 2, 3, 4] as subIndex}
                                                        <input type="text" name={`skerspjūvio-a-${index}-${subIndex}`} class="input skerspjūvio-input" />
                                                    {/each}
                                                </div>
                                                <div>
                                                    <label class="label">b</label>
                                                    {#each [1, 2, 3, 4] as subIndex}
                                                        <input type="text" name={`skerspjūvio-b-${index}-${subIndex}`} class="input skerspjūvio-input" />
                                                    {/each}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <input type="text" name={`ardancioji-${index}`} class="input" />
                                        </td>
                                        <td>
                                            <input type="text" name={`stipris-${index}`} class="input" />
                                        </td>
                                        <td>
                                            <textarea name={`pastabos-${index}`} class="textarea"></textarea>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>

                    

                    <hr />
                    <a class="button mt-4 mr-3 is-fullwidth" href="/login">Prisijungti(Sukurti)</a>
                </form>
            </div>
        </div>
    </div>
</div>


<style>
.input-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px; /* Add margin bottom to create space between input fields */
}

.skerspjūvio-input {
    display: inline-block;
    width: calc(50% - 5px); /* Adjust as needed */
    margin-right: 10px;
    max-width: 50%;
    min-width: 100px;
}

.input-container label {
    width: 200px; /* Adjust width as needed */
    margin-right: 10px;
    white-space: nowrap; /* Prevent label text from wrapping */
}

.select {
    display: flex;
    align-items: center;
    margin-bottom: 10px; /* Add margin bottom to create space between input fields */
}

.select label {
    width: 200px; /* Adjust width as needed */
    margin-right: 10px;
    white-space: nowrap; /* Prevent label text from wrapping */
}

.select select {
    width: calc(100% - 10px); /* Adjust width to fit within the container */
    padding: 8px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}


.is-flex > div:not(:last-child) {
    margin-right: auto; /* Adjust this value as needed */
    
}

.field.is-flex {
        justify-content: space-between;
    }

.center-text {
    text-align: center;
}

</style>