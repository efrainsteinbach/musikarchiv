import glob from 'glob';
import { parseFile } from 'music-metadata';
import express from 'express';
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import { writeFile as fsWriteFile } from 'fs';

const musicFolder = "C:/code/acz/mp3"; // absolute or relative path, without trailing slash
const hostname = "http://localhost:3000"; // 'music' in PROD
const startServer = true;
const writeFile = true;
const resultFile = "index.json";
const authEnabled = true;

async function extractMetadata(pathToFile) {
    console.log(pathToFile);
    const metadata = await parseFile(pathToFile);
    const filename = pathToFile.split('/').pop();
    const pathWithinMusicFolder = pathToFile.substring(musicFolder.length + 1);
    console.log(pathWithinMusicFolder);
    return {
        title: metadata.common.title ? metadata.common.title : filename,
        artist: metadata.common.artist,
        album: metadata.common.album,
        year: metadata.common.year,
        url: pathWithinMusicFolder,
    };
}

function findCover(folder) {
    const covers = glob.sync(folder + "/cover.+(png|jpg|gif)");
    if (covers && covers.length) {
        return "/cover." + covers[0].split('.').pop();
    }
    else
        throw new Error("No album artwork (cover.png/jpg/gif) found in folder " + folder);
}

async function extractAlbums(tracks) {
    const albumFolders = [... new Set(tracks.map(t => t.url.split("/").at(-2) ?? "Unknown Album"))];
    const albums = albumFolders.filter(a => a !== "Unknown Album").map(albumFolder => {
        const albumTracks = tracks.filter(t => t.url.startsWith(albumFolder));
        const representative = albumTracks[0];
        const albumCoverPath = findCover(musicFolder + '/' + albumFolder);
        return {
            title: representative?.album ? representative?.album : albumFolder,
            artist: representative?.artist,
            year: representative?.year,
            artwork: hostname + "/" + albumFolder + albumCoverPath,
            tracks: albumTracks.map(t => ({
                title: t.title,
                artist: t.artist,
                artwork: hostname + "/" + albumFolder + albumCoverPath,
                url: hostname + "/" + t.url,
            })),
        };
    });
    return albums;
}

function crawlMusicFolder() {
    console.log("Scanning music folder...");

    glob(musicFolder + "/**/*.+(mp3|aac)", (er, files) => {
        if (er) {
            console.error("Failed to list audio files in specified music directory, or no files found.");
            return;
        }
        Promise.all(files.map(async file => await extractMetadata(file)))
            .then(result => extractAlbums(result))
            .then(result => whenFinished(result))
    });
}

function whenFinished(trackListing) {
    if (writeFile) {
        fsWriteFile(
            resultFile,
            JSON.stringify(trackListing, null, "  "),
            err => {
                if (err) { console.error(err); }
            });
    }
    if (startServer) {
        startExpress(trackListing);
    }
}

function startExpress(trackListing) {
    const app = express();
    const port = 3000;
    const tracks = trackListing;

    app.use(cors());

    app.use('/', express.static(musicFolder));

    if (authEnabled) {
        const authConfig = basicAuth({
            challenge: true,
            users: {
                'a': 'a',
                'admin': 'supersecret'
            }
        });
        app.get('/' + resultFile, authConfig, (req, res) => {
            res.json(tracks)
        })
    } else {
        app.get('/' + resultFile, (req, res) => {
            res.json(tracks)
        })
    }

    app.listen(port, () => {
        console.log(`Serving album-json on port ${port}`);
    })
}

crawlMusicFolder();