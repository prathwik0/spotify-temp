<script>
	import { profile, playlists } from '$lib/spotifyAPI.js';
	import { onMount } from 'svelte';

	import PlaylistCard from './PlaylistCard.svelte';

	let promiseResolve, promiseReject;
	let promise = new Promise(function (resolve, reject) {
		promiseResolve = resolve;
		promiseReject = reject;
	});

	// Refer before using async inside onMount
	// https://stackoverflow.com/questions/62087073/svelte-3-async-onmount-or-a-valid-alternative
	onMount(async () => {
		try {
			// update this to use promise.all instead
			const response = await Promise.all([profile(), playlists()]);
			if (!(response[0].ok && response[1].ok)) {
				throw new Error(
					'Fetching data from spotify API failed: profile status - ' +
						response[0].status +
						', playlists status ' +
						response[1].status
				);
			}
			const data = await Promise.all([response[0].json(), response[1].json()]);
			promiseResolve({ profile: data[0], playlists: data[1] });
		} catch (error) {
			promiseReject(error);
		}
	});
</script>

{#await promise}
	<h1>Fetching your playlists...</h1>
	<progress />
{:then value}
	<h1>{value.profile.display_name}, here are your playlists</h1>
	<div class="grid-container">
		{#each value.playlists.items as item}
			<!-- TODO - Before passing the props, validate the json -->
			<PlaylistCard
				image={item.images[0].url}
				name={item.name}
				id={item.id}
				spotify={item.external_urls.spotify}
			/>
		{/each}
	</div>
	<p style="font-size:5px;">{JSON.stringify(value)}</p>
{:catch error}
	<h1>Error - Playlists!</h1>
	<p style="color: red">{error}</p>
	<p>Try logging in again</p>
{/await}

<style>
	.grid-container {
		display: grid;
		grid-template-columns: auto auto auto auto;
		gap: 8px;
	}
	@media only screen and (max-width: 1263px) {
		.grid-container {
			grid-template-columns: auto auto auto;
		}
	}
	@media only screen and (max-width: 400px) {
		.grid-container {
			grid-template-columns: auto auto;
		}
	}
</style>
