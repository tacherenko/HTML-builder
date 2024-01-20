const fsPromises = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const folderPathCopy = path.join(__dirname, 'files-copy');

const copyDir = async () => {
    try {
        // Удаляем папку files-copy и создаем ее заново
        await fsPromises.rm(folderPathCopy, { recursive: true, force: true });
        await fsPromises.mkdir(folderPathCopy, { recursive: true });

        // Получаем список файлов в папке files
        const files = await fsPromises.readdir(folderPath, { withFileTypes: true });

        // Копируем каждый файл в папку files-copy
        await Promise.all(files.map(async (file) => {
            const filePath = path.join(folderPath, file.name);
            const filePathCopy = path.join(folderPathCopy, file.name);

            await fsPromises.copyFile(filePath, filePathCopy);
        }));

        console.log(`Directory "${folderPath}" successfully copied to "${folderPathCopy}"`);
    } catch (error) {
        console.error(`Error copying directory: ${error.message}`);
    }
};

copyDir();
