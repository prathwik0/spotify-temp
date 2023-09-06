import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { generateRandomString, generateCodeChallenge } from '$lib/util.js';
import { refreshToken } from '$lib/getAccessToken.js';

// Theme -> Light mode & Dark mode (default)
export const theme = writable((browser && localStorage.getItem('theme')) || 'dark');

theme.subscribe((val) => {
	if (browser) return (localStorage.theme = val);
});

// We are storing codeVerifier, state and accessToken in sessionStorage
function createCodeVerifier() {
	const { subscribe, set, update } = writable(
		(browser && sessionStorage.getItem('codeVerifier')) || generateRandomString(128)
	);

	return {
		subscribe,
		reset: () => set(generateRandomString(128))
	};
}

function createState() {
	const { subscribe, set, update } = writable(
		(browser && sessionStorage.getItem('state')) || generateRandomString(16)
	);

	return {
		subscribe,
		reset: () => set(generateRandomString(16))
	};
}

export const codeVerifier = createCodeVerifier();
export const state = createState();

codeVerifier.subscribe((val) => {
	if (browser) return (sessionStorage.codeVerifier = val);
});

state.subscribe((val) => {
	if (browser) return (sessionStorage.state = val);
});

export const codeChallenge = derived(codeVerifier, ($codeVerifier, set) =>
	generateCodeChallenge($codeVerifier).then((value) => {
		set(value);
		console.log('Code Challenge Updated to :', value);
	})
);

// We are storing the token in localStorage
function createToken() {
	const { subscribe, set, update } = writable(
		(browser && JSON.parse(localStorage.getItem('token'))) || {}
	);

	return {
		subscribe,
		new: (token) => {
			// inserting current time in seconds to the token
			token.current_time = Math.round(Date.now() / 1000);
			set(token);
		},
		refresh: async () => {
			try {
				let token = await refreshToken();
				token.current_time = Math.round(Date.now() / 1000);
				set(token);
			} catch (error) {
				throw error;
			}
		}
	};
}

export const token = createToken();

token.subscribe((val) => {
	if (browser) return (localStorage.token = JSON.stringify(val));
});

// Server constants
export const clientId = '90a553431c9d49b6ab7e775d353be1e7';
export const redirectURI = 'https://spotify-temp.vercel.app/callback';
export const scope = 'user-read-private user-read-email playlist-read-private';
