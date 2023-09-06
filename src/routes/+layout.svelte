<script>
	import { page } from '$app/stores';

	import ThemeButton from './ThemeButton.svelte';
</script>

<header class="container">
	<nav>
		<ul>
			<li><a href="/" aria-current={$page.url.pathname === '/'}> Home </a></li>
			<li><a href="/profile" aria-current={$page.url.pathname === '/profile'}> Profile </a></li>
			<li>
				<a href="/profile/playlists" aria-current={$page.url.pathname === '/profile/playlists'}>
					Playlists
				</a>
			</li>
		</ul>

		<ul>
			<li><ThemeButton /></li>
			<li><a href="/about" aria-current={$page.url.pathname === '/about'}> About </a></li>
		</ul>
	</nav>
</header>

<main class="container">
	<slot />
</main>
