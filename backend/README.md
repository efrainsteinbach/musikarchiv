# Catalogist: Audio Library Metadata Indexer Script

This node.js script crawls a specified folder for mp3 audio files, and extracts their path and meta information to a JSON file. This JSON file is used by the frontend to list and play the albums and songs. 

## Running the script

1. Make sure node.js is installed
2. Review the first few lines in main script file `catalogist.js`. Adjust as required. Per default, the local development setup will use start the webserver and serve the JSON file on localhost:3000.

```javascript
    const musicFolder = "music"; // absolute or relative path, without trailing slash
    const hostname = 'https://your-server.com/a-subpath'; // relative works, too!
    const startServer = false; // start a server serving the JSON file
    const writeFile = true; // write the file to the local script folder
    const resultFile = "index.json"; // the file to write or serve
```

3. Run the script 

```javascript
npm start
```
