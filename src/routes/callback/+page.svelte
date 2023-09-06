<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	import { getAccessToken } from '$lib/getAccessToken.js';
	import { codeVerifier, state, token } from '../../stores.js';

	let handleCallback = async () => {
		try {
			// Maybe turning this into nested if conditions might be better?? for security??

			let params = $page.url.searchParams;
			let authCode = '';

			if (!params.has('code')) {
				throw new Error('authCode absent in callback');
			} else {
				authCode = params.get('code');
			}

			if (!params.has('state')) {
				throw new Error('State absent in callback');
			} else if (params.get('state') !== get(state)) {
				throw new Error(
					'State mismatch',
					'\nApp state: ',
					get(state),
					'\nReceieved state: ',
					params.get('state')
				);
			}

			let response = await getAccessToken(authCode, get(codeVerifier));

			token.new(response);
			console.log('new token: ', get(token));
		} catch (error) {
			throw new Error(error);
		}
	};
</script>

<h1>Callback from Spotify</h1>

{#await handleCallback()}
	<h1>Fetching access token....</h1>
{:then value}
	<h1>Access Token Successfully Stored</h1>
	<button
		on:click|preventDefault={() => {
			goto('/profile');
		}}
	>
		Go to Profile!
	</button>
{:catch error}
	<h1>Access Token Error</h1>
	<p style="color: red">{error.message}</p>
{/await}
