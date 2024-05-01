<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;

	if (typeof window !== 'undefined') {
		if(!data.loggedIn){
			goto('/login');
		}else if(data.loggedIn ){ //&& data.role == 'admin'
			goto('/concreteusers');
		}
		else{
			goto('/');
		}
	}

</script>


  <style>

	/* .test-available {
	color: green;
	font-size: 16px;
	margin-left: 16px;
	transition: opacity 0.3s ease-in-out;
	position: absolute;
	left: 100%;
	top: 50%;
	transform: translateY(-50%);
	} */
  
	/* .visible {
	  opacity: 1;
	} */
  
  </style>