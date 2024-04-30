<script lang="ts">
    import type { PageData } from './$types';
    import type { UserType } from '$lib/server/db/tables/user/UserType';
	  import { goto } from '$app/navigation';

    export let data: PageData;

    let user: UserType;

    $: if (user == null) {
      console.log(data);
      user = data.user;
    }

    function updateUser() {
      fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(res => {
          goto('/');
        })
        .catch(err => {
          console.log(err);
        });
    }
</script>

<div class="px-4 mt-5">
    <div class="card">
      <header class="card-header">
        <p class="title py-4 px-4">Profilio redagavimas</p>
      </header>
      <div class="card-content">
        <form>
          <div class="field">
            <label class="label" for="name">Vardas Pavardė</label>
            <div class="control">
              <input class="input" type="text" id="name" bind:value={user.name}>
            </div>
          </div>
          <div class="field">
            <label class="label" for="email">El. paštas</label>
            <div class="control">
              <input class="input" type="email" id="email" bind:value={user.email}>
            </div>
          </div>
          <div class="control">
            <button class="button is-primary" on:click={updateUser}>Redaguoti</button>
          </div>
        </form>
      </div>
    </div>
</div>
