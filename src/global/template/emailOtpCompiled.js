import path from "path";
import pug from "pug";
import { fileURLToPath } from "url";
// Get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const emailOtpCompiledFunction = pug.compileFile(
  path.join(__dirname, "./emailOtp.pug"),
);
export { emailOtpCompiledFunction };
