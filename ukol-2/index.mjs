import { readFile, writeFile, mkdir } from 'fs/promises';

const numberOfFiles = await readInstructions('instrukce.txt');

let promises = [];

await mkdir('./generated', { recursive: true });

for (let i = 0; i < numberOfFiles; i++) {
    const filePath = `./generated/${i}.txt`;
    const fileContent = `Soubor ${i}`;

    promises.push(
        writeFile(filePath, fileContent).then(it =>
            console.log(`Soubor ${i} vytvořen!`)
        )
    );
}

try {
    await Promise.all(promises);
}
catch (error) {
    console.error('Došlo k chybě při vytváření souborů.', error.message);
    process.exit(1);
}

console.log('Soubory byly úspěšně vytvořeny.')



async function readInstructions(fileName) {
    try {
        const content = (await readFile(fileName, 'utf8')).trim();

        const numberOfFiles = parseInt(content);

        if (Number.isNaN(numberOfFiles)) {
            throw new Error('Soubor s instrukcemi neobsahuje číselný vstup.');
        }

        return numberOfFiles;
    } catch (error) {
        console.error('Došlo k chybě při čtení instrukcí:', error.message);
        process.exit(1);
    }
}
