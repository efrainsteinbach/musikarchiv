import glob from 'glob';
import { parseFile } from 'music-metadata';
import express from 'express';

async function extractMetadata(pathToFile) {
    const metadata = await parseFile(pathToFile);
    const filename = pathToFile.split('/').pop();
    return {
        title: metadata.common.title ? metadata.common.title : filename,
        artist: metadata.common.artist,
        album: metadata.common.album,
        year: metadata.common.year,
        url: pathToFile,
    };
}

async function extractAlbums(tracks) {
    const albumFolders = [... new Set(tracks.map(t => t.url.split("/")[1] ?? "Unknown Album"))];
    const albums = albumFolders.filter(a => a !== "Unknown Album").map(albumFolder => {
        const albumTracks = tracks.filter(t => t.url.startsWith("music/" + albumFolder));
        const representative = albumTracks[0];
        return {
            title: representative?.album ? representative?.album : albumFolder,
            artist: representative?.artist,
            year: representative?.year,
            art: "./music/" + albumFolder + "/cover.png",
            tracks: albumTracks.map(t => ({
                title: t.title,
                artist: t.artist,
                url: t.url,
            })),
        };
    });
    return albums;
}


function crawlMusicFolder() {
    console.log("Scanning music folder...");

    glob("music/**/*.+(ogg|mp3|aac|flac)", (er, files) => {
        if (er) {
            console.error("Failed to list /music directory, or no files found.");
            return;
        }
        Promise.all(files.map(async file => await extractMetadata(file)))
            .then(result => extractAlbums(result))
            .then(result => startServer(result));
    });
}

function startServer(trackListing) {
    const app = express();
    const port = 3000;
    const tracks = trackListing;

    app.get('/albums', (req, res) => {
        res.json(tracks)
    })

    app.use('/music', express.static('music'));

    app.listen(port, () => {
        console.log(`Serving album-json on port ${port}`);
    })
}

crawlMusicFolder();