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
      
    </div>
    
</div>
