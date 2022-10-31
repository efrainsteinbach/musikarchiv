# Audio Library Indexer Script

This node.js script crawls a specified folder for mp3 audio files, and extracts their path and meta information to a JSON file, which the frontend uses to list and play the albums and songs.

## Usage hints

check the first few lines in the script. these show 

```
    const musicFolder = "music"; // absolute or relative path, without trailing slash
    const hostname = 'https://your-server-name.com/maybe-a-subpath';
    const startServer = false; // start a server serving the JSON file
    const writeFile = true; // write the file to the local script folder
    const resultFile = "index.json"; // the file to write or serve
```