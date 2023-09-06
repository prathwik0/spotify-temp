<script>
	import { page } from '$app/stores';
	import { playlistTracks } from '$lib/spotifyAPI.js';

	let playlistName = '';
	let playlistID = '';

	let fetchSongs = async () => {
		try {
			let params = $page.url.searchParams;

			if (!params.has('id')) {
				throw new Error('Playlist ID not present');
			}
			if (!params.has('name')) {
				throw new Error('Playlist name not present');
			}

			playlistID = params.get('id');
			playlistName = params.get('name');

			let response = await playlistTracks(playlistID);
			let items = await response.json();

			return items;
		} catch (error) {
			throw new Error(error);
		}
	};

	let promise = fetchSongs();
</script>

{#await promise}
	<h1>Fetching songs...</h1>
	<progress />
{:then value}
	<h1>Songs from <a href="/profile/playlists">{playlistName}</a></h1>
	<ul>
		{#each value.items as item}
			<li>
				<a href={item.track.external_urls.spotify}>{item.track.name}</a> from album
				<span style="font-color:red">{item.track.album.name}</span>
			</li>
		{/each}
	</ul>
	<p style="font-size:5px;">{JSON.stringify(value)}</p>
{:catch error}
	<h1>Error in fetching songs from your playlist!</h1>
	<p style="color: red">{error.message}</p>
{/await}
