<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;

	if (typeof window !== 'undefined') {
		if(!data.loggedIn){
			goto('/login');
		}else if(data.loggedIn && data.role == 'teacher'){
			goto('/teacher');
		}
	}

</script>

<div class="container">
	<form method="POST" class="quiz-start">
		<label for="test-code-input">Testo kodas</label>
			<div class="input-container">
				<div class="input-wrapper">
					<input
					class="input my-2"
					type="text"
					placeholder="Testo kodas (0000000000)"
					name="joinCodeInput"
					required
				/>
				</div>
			<!-- <div class="test-available" class:visible={isTestAvailable}>
			{#if isTestAvailable}
				Test is available!
			{:else}
				<span class="unavailable-text">Test is unavailable!</span>
			{/if}
			</div> -->
		</div>

		<button class="btn btn-start-test" type="submit" formaction="?/joinTest">Pradėti testą</button>
		<hr />
		<!-- <label for="qr-label">QR code</label> -->
	</form>
</div>

  <style>
	.container {
	  width: 900px;
	  margin: 32px auto;
	}
  
	.quiz-start {
	  margin: 50px 0;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
  
		.input-container {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	}
	.input-wrapper {
	display: flex;
	align-items: center;
	}
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
  
	label {
	  font-size: 18px;
	  margin-bottom: 8px;
	}
  
	input {
	  width: 300px;
	  height: 32px;
	  margin-bottom: 16px;
	  font-size: 16px;
	  border-radius: 4px;
	}
  
	.btn-start-test {
	  background-color: #00e2c0;
	  color: #fff;
	  border: none;
	  font-weight: bolder;
	  width: 200px;
	  height: 40px;
	  border-radius: 8px;
	  font-size: 18px;
	}
  
	.btn-start-test:hover {
	  cursor: pointer;
	}
  
	.btn-start-test:active {
	  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.3);
	  transform: scale(0.99);
	}
	/* .unavailable-text {
    color: red;
  	} */
  </style>