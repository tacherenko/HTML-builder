const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

function formatFileSize(bytes) {
    return (bytes / 1024).toFixed(3) + 'kb';
}

function displayFileInfo(fileName, fileExtension, fileSize) {
    console.log(`${fileName}-${fileExtension}-${fileSize}`);
}

function processFilesInFolder(folderPath) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Error getting file stats for ${file}: ${err}`);
                    return;
                }

                if (stats.isFile()) {
                    const fileName = path.parse(file).name;
                    const fileExtension = path.parse(file).ext.slice(1);
                    const fileSize = formatFileSize(stats.size);

                    displayFileInfo(fileName, fileExtension, fileSize);
                }
            });
        });
    });
}

processFilesInFolder(folderPath);