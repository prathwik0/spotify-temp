<script>
	import { profile } from '$lib/spotifyAPI.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let promiseResolve, promiseReject;
	let promise = new Promise(function (resolve, reject) {
		promiseResolve = resolve;
		promiseReject = reject;
	});

	// Refer before using async inside onMount
	// https://stackoverflow.com/questions/62087073/svelte-3-async-onmount-or-a-valid-alternative
	onMount(async () => {
		try {
			const response = await profile();
			if (!response.ok) {
				throw new Error(
					'Fetching data from spotify API failed: profile statuscode - ' + response.status
				);
			}
			const data = await response.json();
			promiseResolve(data);
		} catch (error) {
			promiseReject(error);
		}
	});
</script>

{#await promise}
	<h1>Fetching profile details!</h1>
	<progress />
{:then value}
	<h1>Hello {value.display_name}!</h1>

	<h2>Account Details</h2>
	{#if value.images[0]}
		<img src={value.image[0].href} height="100" alt="profile" />
	{/if}

	<ul>
		<li>Name: {value.display_name}</li>
		<li>Country: {value.country}</li>
		<li>Email: {value.email}</li>
		<li>Link: <a href={value.external_urls.spotify}>{value.display_name}</a></li>
	</ul>

	<p>{JSON.stringify(value)}</p>
	<button
		on:click|preventDefault={() => {
			goto('/profile/playlists');
		}}
	>
		Your Playlists!
	</button>
{:catch error}
	<h1>Error - Profile!</h1>
	<p style="color: red">{error}</p>
	<p>Try logging in again</p>
{/await}
