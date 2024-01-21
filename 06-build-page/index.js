const fsPromises = require('fs').promises;
const path = require('path');

const sourceDir = __dirname;
const distDir = path.join(sourceDir, 'project-dist');
const templateFile = path.join(sourceDir, 'template.html');
const stylesDir = path.join(sourceDir, 'styles');
const componentsDir = path.join(sourceDir, 'components');
const assetsDir = path.join(sourceDir, 'assets');

const readComponentFile = async (componentName) => {
    const componentPath = path.join(componentsDir, `${componentName}.html`);
    return fsPromises.readFile(componentPath, 'utf-8');
};

const replaceTemplateTags = async (templateContent) => {
    const tagRegex = /\{\{([^}]+)\}\}/g;
    let replacedContent = templateContent;

    const matches = templateContent.match(tagRegex);

    if (matches) {
        for (const match of matches) {
            const componentName = match.slice(2, -2).trim();
            const componentContent = await readComponentFile(componentName);
            replacedContent = replacedContent.replace(match, componentContent);
        }
    }

    return replacedContent;
};

const compileStyles = async () => {
    try {
        const files = await fsPromises.readdir(stylesDir);
        const cssFiles = files.filter((file) => path.extname(file) === '.css');

        const stylesContent = await Promise.all(
            cssFiles.map(file => fsPromises.readFile(path.join(stylesDir, file), 'utf-8'))
        );

        const bundleContent = stylesContent.join('\n');

        await fsPromises.mkdir(distDir, { recursive: true });

        await fsPromises.writeFile(path.join(distDir, 'style.css'), bundleContent, 'utf-8');
        console.log('Styles compiled successfully into project-dist/style.css');
    } catch (error) {
        console.error(`Error compiling styles: ${error.message}`);
    }
};

// Вспомогательная функция для рекурсивного копирования директории
const copyDirRecursive = async (src, dest) => {
    const entries = await fsPromises.readdir(src, { withFileTypes: true });

    await Promise.all(
        entries.map(async (entry) => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                await fsPromises.mkdir(destPath, { recursive: true });
                await copyDirRecursive(srcPath, destPath);
            } else {
                await fsPromises.copyFile(srcPath, destPath);
            }
        })
    );
};

const copyAssets = async () => {
    try {
        // Используем свойства recursive и force, чтобы скопировать директорию целиком
        await fsPromises.rm(path.join(distDir, 'assets'), { recursive: true, force: true });
        await fsPromises.mkdir(path.join(distDir, 'assets'), { recursive: true });

        // Копируем содержимое директории assets
        await copyDirRecursive(assetsDir, path.join(distDir, 'assets'));

        console.log('Directory assets successfully copied to project-dist');
    } catch (error) {
        console.error(`Error copying directory assets: ${error.message}`);
    }
};

const main = async () => {
    try {
        // Очищаем папку project-dist
        await fsPromises.rm(distDir, { recursive: true, force: true });

        // Создаем папку project-dist
        await fsPromises.mkdir(distDir, { recursive: true });
        console.log('Folder project-dist successfully created');

        // Читаем содержимое файла template.html
        const templateContent = await fsPromises.readFile(templateFile, 'utf-8');

        // Заменяем теги-шаблоны содержимым соответствующих компонентов
        const replacedContent = await replaceTemplateTags(templateContent);

        // Записываем результат в 'project-dist/index.html'
        await fsPromises.writeFile(path.join(distDir, 'index.html'), replacedContent, 'utf-8');
        console.log('File index.html successfully created in project-dist');

        // Компилируем стили
        await compileStyles();

        // Копируем директорию assets
        await copyAssets();
        console.log('Script has been executed successfully!');
    } catch (error) {
        console.error(`Script execution error: ${error.message}`);
    }
};

main();
