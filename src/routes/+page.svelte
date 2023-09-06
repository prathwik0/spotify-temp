<script>
	import {
		clientId,
		scope,
		redirectURI,
		codeVerifier,
		state,
		codeChallenge,
		token
	} from '../stores.js';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	$: console.log('State: ', $state);

	function handleLogin() {
		state.reset();
		let params = new URLSearchParams({
			response_type: 'code',
			client_id: clientId,
			scope: scope,
			redirect_uri: redirectURI,
			state: get(state),
			code_challenge_method: 'S256',
			code_challenge: get(codeChallenge)
		}).toString();

		let url = 'https://accounts.spotify.com/authorize?' + params;
		goto(url);
	}
</script>

<h1>Welcome to our App!</h1>

<button on:click|preventDefault={handleLogin}>Login to Spotify!</button>
<button class="secondary" on:click|preventDefault={token.refresh}>Refresh Token</button>
<button class="secondary" on:click|preventDefault={codeVerifier.reset}>Reset codeVerifier</button>

<div>
	<p>Code Verifier : {$codeVerifier}</p>
	<p>Code Challenge : {$codeChallenge}</p>
</div>
