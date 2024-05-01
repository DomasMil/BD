<script lang="ts">
    import type { PageData } from './$types';
    import type { MyUserType } from '$lib/server/db/tables/user/UserType';
	  import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let data: PageData;

    let user: MyUserType;

    $: if (user == null) {
      //console.log(data);
      user = data.user;
    }

    let showSuccess = false;
    let showFail = false;

    onMount(() => {
      const params = new URLSearchParams(window.location.search);
      showSuccess = params.has('success');
      showFail = params.has('failed');
    });

    // function updateUser() {
    //   fetch(`/api/user/${user.id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(user)
    //   })
    //     .then(res => res.json())
    //     .then(res => {
    //       goto('/');
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // }
    
</script>

{#if showSuccess}
  <div class="notification is-success">
    Slaptažodis sėkmingai pakeistas!
  </div>
{/if}

{#if showFail}
  <div class="notification is-danger">
    Slaptažodžio keitimas nepavyko!
  </div>
{/if}

<div class="px-4 mt-5">
    <div class="card">
      <header class="card-header">
        <p class="title py-4 px-4">Slaptažodžio keitimas</p>
      </header>
      <div class="card-content">
        <form method="post" action="?/changepassword">
          <input type="hidden" name="username" value={data.username} />
          <input
            class="input my-2"
            type="password"
            placeholder="Senas slaptažodis"
            name="oldpassword"
            required
          />
          <input
          class="input my-2"
          type="password"
          placeholder="Naujas slaptažodis"
          name="newpassword"
          required
        />
        <button class="button is-primary mt-4 is-fullwidth" type="submit" formaction="?/changepassword"
        >Keisti slaptažodį</button
      >
        </form>
        <!-- <form>
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
        </form> -->
      </div>
    </div>
</div>
