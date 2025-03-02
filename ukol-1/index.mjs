import { readFileSync, writeFileSync, existsSync } from 'fs';

try {
    if (!existsSync('instrukce.txt')) {
        console.log('Soubor instrukce.txt neexistuje');
        process.exit(1);
    }

    const instructions = readFileSync('instrukce.txt', 'utf8').trim().split(' ');
    const [sourceFile, targetFile] = instructions;

    if (!existsSync(sourceFile)) {
        console.log(`Zdrojový soubor ${sourceFile} neexistuje`);
        process.exit(1);
    }

    const content = readFileSync(sourceFile, 'utf8');

    writeFileSync(targetFile, content);

} catch (error) {
    console.error('Došlo k chybě:', error.message);
    process.exit(1);
}
