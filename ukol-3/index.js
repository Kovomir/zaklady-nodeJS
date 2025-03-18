import { readFile, constants, access, writeFile } from "fs/promises";
import http from "http";

const port = 3000;
const counterFilePath = "counter.txt";

const server = http.createServer(async (req, res) => {
  const url = req.url;
  let currentNumber = await readCounterFile();

  switch (url) {
    case "/increase": {
      currentNumber++;
      await createCounterFile(currentNumber);
      await createResponse(res, currentNumber);
      break;
    }
    case "/decrease": {
      currentNumber--;
      await createCounterFile(currentNumber);
      await createResponse(res, currentNumber);
      break;
    }
    default: {
      await createResponse(res, currentNumber);
      break;
    }
  }
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

async function readCounterFile() {
  const fileExists = await checkFileExists(counterFilePath);

  if (!fileExists) {
    await createCounterFile(0);
  }

  const data = await readFile("counter.txt");
  return parseInt(data);
}

async function checkFileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function createCounterFile(number) {
  try {
    await writeFile(counterFilePath, number.toString());
  } catch (error) {
    console.error("Došlo k chybě při vytváření souboru.", error.message);
  }
}

async function createResponse(res, number) {
  try {
    const htmlContent = await readFile("cislo.html", "utf8");
    const modifiedHtml = htmlContent.replace(
      '<h1 id="cislo"></h1>',
      `<h1 id="cislo">${number}</h1>`
    );

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write(modifiedHtml);
    res.end();
  } catch (error) {
    console.error("Chyba při načítání HTML souboru:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
