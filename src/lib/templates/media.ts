/** Public playback sources; audio/video downloads are never bundled with the templates. */
export const filmSources = {
	'tears-of-steel':
		'https://download.blender.org/demo/movies/ToS/tears_of_steel_720p.mov?download=1',
	caminandes:
		'https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7c/Caminandes_-_Gran_Dillama_-_Blender_Foundation%27s_new_Open_Movie.webm/Caminandes_-_Gran_Dillama_-_Blender_Foundation%27s_new_Open_Movie.webm.480p.vp9.webm',
	'big-buck-bunny':
		'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/41/Big_Buck_Bunny_medium.ogv/Big_Buck_Bunny_medium.ogv.480p.vp9.webm',
	sintel: 'https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4?download=1'
} as const;

export const socialFilmSource = `${filmSources['big-buck-bunny']}#t=90,110`;
