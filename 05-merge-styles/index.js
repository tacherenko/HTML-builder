const fsPromises = require('fs').promises;
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const distFolderPath = path.join(__dirname, 'project-dist');
const outputFilePath = path.join(distFolderPath, 'bundle.css');

const compileStyles = async () => {
    try {
        const files = await fsPromises.readdir(stylesFolderPath);
        const cssFiles = files.filter(file => path.extname(file) === '.css');

        const cssContents = await Promise.all(
            cssFiles.map(file => fsPromises.readFile(path.join(stylesFolderPath, file), 'utf-8'))
        );

        const bundleContent = cssContents.join('\n');

        await fsPromises.mkdir(distFolderPath, { recursive: true });
        await fsPromises.writeFile(outputFilePath, bundleContent, 'utf-8');

        console.log(`Styles compiled successfully into ${outputFilePath}`);
    } catch (error) {
        console.error(`Error compiling styles: ${error.message}`);
    }
};

compileStyles();
