<script lang="ts">
    import type { PageData } from './$types';
    import type { UserType } from '$lib/server/db/tables/user/UserType';

    import wood from '$lib/assets/trophiesImages/wood.png';
    import copper from '$lib/assets/trophiesImages/copper.png';
    import silver from '$lib/assets/trophiesImages/silver.png';
    import gold from '$lib/assets/trophiesImages/gold.png';

    export let data: PageData;

    let user: UserType;

    $: if (user == null) {
      console.log(data);
      user = data.user;
    }
</script>

<style>
  .trophy-image {
    width: 60px;
    height: 60px;
  }
  .trophy-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }
  .trophy-text {
    margin-top: 5px;
  }
</style>

<div class="px-4 mt-5">
    <div class="card">
      <header class="card-header">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <p class="title py-4 px-4">
            Trofėjai
          </p>
        </div>
      </header>
      <div class="card-content">
        <div class="content">
            {#if user.points >= 2}
                <div class="trophy-info">
                    <img class="trophy-image" src={wood} alt="Trophy" />
                    <span class="trophy-text">Reikėjo 2 taškų</span>
                </div>
            {/if}
            {#if user.points >= 10}
                <div class="trophy-info">
                    <img class="trophy-image" src={copper} alt="Trophy" />
                    <span class="trophy-text">Reikėjo 10 taškų</span>
                </div>
            {/if}
            {#if user.points >= 20}
                <div class="trophy-info">
                    <img class="trophy-image" src={silver} alt="Trophy" />
                    <span class="trophy-text">Reikėjo 20 taškų</span>
                </div>
            {/if}
            {#if user.points >= 50}
                <div class="trophy-info">
                    <img class="trophy-image" src={gold} alt="Trophy" />
                    <span class="trophy-text">Reikėjo 50 taškų</span>
                </div>
            {/if}
        </div>
      </div>
    </div>
</div>
