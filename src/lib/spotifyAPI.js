import { token } from '../stores.js';
import { get } from 'svelte/store';

const access_token = get(token).access_token;

export const profile = () => {
	return fetch('https://api.spotify.com/v1/me', {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + access_token
		}
	});
};

export const playlists = () => {
	return fetch('https://api.spotify.com/v1/me/playlists', {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + access_token
		}
	});
};

export const playlistTracks = (playlist_id) => {
	return fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + access_token
		}
	});
};
