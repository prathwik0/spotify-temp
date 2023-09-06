import { clientId, redirectURI, token } from '../stores.js';
import { get } from 'svelte/store';

const getAccessToken = async (code, codeVerifier) => {
	try {
		let authOptions = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: redirectURI,
			client_id: clientId,
			code_verifier: codeVerifier
		});
		console.log(authOptions);

		const response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			body: authOptions,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		if (!response.ok) {
			throw new Error('HTTP status ' + response.status);
		}

		return response.json();
	} catch (error) {
		throw 'Error at getAccessToken():\n' + error;
	}
};

const refreshToken = async () => {
	try {
		let authOptions = new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: get(token).refresh_token,
			client_id: clientId
		});
		console.log(authOptions);

		const response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			body: authOptions,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		if (!response.ok) {
			throw new Error('HTTP status ' + response.status);
		}

		return response.json();
	} catch (error) {
		throw 'Failed to refresh access token: ' + error;
	}
};

export { getAccessToken, refreshToken };
