// Get env var
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const fileDir = path.resolve(fileURLToPath(import.meta.url), "../..");
console.log(fileDir);
const extraScript = process.env.EXTRA_SCRIPT_ADDED;

if (extraScript) {
  // replace <!-- extra-script --> with the extra script in index.html
  const indexPath = path.join(fileDir, "index.html");

  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const updatedIndexHtml = indexHtml.replace("<!-- extra-script -->", extraScript);
  fs.writeFileSync(indexPath, updatedIndexHtml);
}
