<script>
	export let name;
	export let id;
	export let image;
	export let spotify;
</script>

<article class="grid">
	<img src={image} alt={name} height="200px" />
	<div class="grid-container">
		<div class="grid-item">
			<a href={spotify} style="color:red;">{name}</a>
		</div>
		<div>
			<a href="/profile/playlists/songs?name={name}&id={id}"> List Songs </a>
		</div>
	</div>
</article>

<style>
	article {
		padding: 0%;
	}
	img {
		padding: 10px;
	}
	.grid-container {
		display: grid;
		grid-template-columns: auto;
		padding: 10px;
	}
	.grid-item {
		hyphens: auto;
		display: flex;
		align-items: center;
		padding-bottom: 10px;
		/* justify-content: left; */
	}
</style>
