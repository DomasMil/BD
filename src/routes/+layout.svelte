<script lang="ts">
	import './../global.css'
	import { page } from '$app/stores';
	import type { LayoutServerData } from './$types';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!(document as any).startViewTransition) return;

		return new Promise((resolve) => {
			(document as any).startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let isDarkTheme: boolean = false;

	function toggleTheme() {
		isDarkTheme = !isDarkTheme;
		if (isDarkTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

	export let data: LayoutServerData;
</script>

<header>
	<nav class="navbar is-primary px-4" style={isDarkTheme ? "background-color: var(--bg-color-dark1);" : ""} aria-label="main navigation">
		<div class="navbar-brand pr-4">
			<span class="is-size-3 has-text-weight-semibold">Quizeris</span>
		</div>
		<div class="navbar-menu">
			<div class="navbar-start">
				<button class="btn-toggle-dark" on:click={toggleTheme}>
					{#if isDarkTheme}
						<span style="color: white;">🌙 Dark</span>
					{:else}
						<span style="color: white;">☀️ Light</span>
					{/if}
				</button>
				{#if data?.username && data?.role === 'student'}
					<a
						aria-current={$page.url.pathname === '/' ? 'page' : undefined}
						href="/"
						class="navbar-item">Pagrindinis</a
					>

					<a
						aria-current={$page.url.pathname === '/user/results' ? 'page' : undefined}
						href="/user/results"
						class="navbar-item">Rezultatai</a
					>					

					<a
						aria-current={$page.url.pathname === '/user/trophy' ? 'page' : undefined}
						href="/user/trophy"
						class="navbar-item">Trofėjai</a
					>
				{/if}
				{#if data?.username && data?.role === 'teacher'}
					<a
						aria-current={$page.url.pathname === '/teacher' ? 'page' : undefined}
						href="/teacher"
						class="navbar-item">Testai</a
					>

					<a
						aria-current={$page.url.pathname === '/teacher/results' ? 'page' : undefined}
						href="/teacher/results"
						class="navbar-item">Rezultatai</a
					>	

					<a
						aria-current={$page.url.pathname === '/teacher/users' ? 'page' : undefined}
						href="/teacher/users"
						class="navbar-item">Atlikinėtojų sąrašas</a
					>
					
					<a
					aria-current={$page.url.pathname === '/teacher/complains' ? 'page' : undefined}
					href="/teacher/complains"
					class="navbar-item">Skundžiami klausimai</a
					>	
				{/if}
			</div>
		</div>

		<div class="navbar-end">
			<div class="navbar-item">
				<div class="buttons has-icons-left" style="margin-bottom: -0.5rem; margin-right: 1%;">
					<div class="button-container" style="display: flex; align-items: center;">
						<a href="/profile" class="button is-primary" style="display: flex; align-items: center; justify-content: center; gap: 8px;" data-sveltekit-preload-data="off" data-sveltekit-reload>
							<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="height: 20px;">
								<path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
							Profilis
						</a>
					</div>
				</div>	
				<div class="buttons">
					{#if data?.username}
						<a
							href="/logout"
							class="button is-primary"
							data-sveltekit-preload-data="off"
							data-sveltekit-reload>Labas&nbsp;<b>{data.username.toUpperCase()}</b>! Atsijungti čia</a
						>
					{:else}
						<a href="/login" class="button is-primary">Prisijungti</a>
					{/if}
				</div>
			</div>
		</div>
	</nav>
</header>
<slot />

<style>
	.navbar-item, .btn-toggle-dark {
		display: flex;
		align-items: center;
	}

	.btn-toggle-dark {
		background: none;
		border: none;
		cursor: pointer;
	}

	.navbar-item[aria-current='page']::before {
		content: '●';
		font-size: 0.7rem;
		color: #46fde1;
		padding-right: 2px;
		view-transition-name: active-page;
	}


	::-webkit-scrollbar-track {
		background: #f1f1f1; 
	}

	::-webkit-scrollbar-thumb {
		background: #00ff00;
		border-radius: 10px;
	}

	::-webkit-scrollbar {
		width: 5px;
		height: 5px; 
	}

	::-webkit-scrollbar-thumb:hover {
		background: #009900; 
	}
	
</style>
