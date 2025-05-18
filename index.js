const axios = require('axios')
const { format } = require('date-fns');
const fs = require('fs');
const path = require('path');
require('dotenv').config()

const name = process.env.AE_NAME;
const server = process.env.AE_SERVER;
const port = process.env.AE_PORT;
const client = process.env.AE_CLIENT;
const user = process.env.AE_USER;
const pass = process.env.AE_PASSWORD;
const protocol = process.env.PROTOCOL;
const timer = parseInt(process.env.PERIOD, 10) || 0;
// Whitelist of components to display, e.g. "wp,pwp,rest"
const whitelist = process.env.AE_WHITELIST
  ? process.env.AE_WHITELIST.split(',').map(w => w.trim().toLowerCase())
  : [];
// Output file configuration
const outputPath = process.env.AE_OUTPUT_PATH || __dirname;
const outputFile = process.env.AE_OUTPUT_FILE || 'health_check.log';
const fullOutputFile = path.isAbsolute(outputFile)
  ? outputFile
  : path.join(outputPath, outputFile);

// Ensure directory exists
fs.mkdirSync(path.dirname(fullOutputFile), { recursive: true });

const URL = `${protocol}://${server}:${port}/ae/api/v1/${client}/system/health?details=true`;

function shouldLogComponent(key) {
  if (whitelist.length === 0) return true;
  return whitelist.includes(key.toLowerCase());
}

function writeOutput(text) {
  fs.appendFileSync(
    fullOutputFile,
    text + '\n',
    { encoding: 'utf8' }
  );
}

function status() {
  axios
    .get(URL, {
      auth: { username: user, password: pass },
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
      const dateTime = format(new Date(), 'dd.MM.yyyy HH:mm:ss');
      const lines = [];
      lines.push(response.status.toString());
      lines.push(`[${dateTime}] -- Status check: System Name ${name}`);
      const data = response.data;
      lines.push(`[${dateTime}] -- ${name} status ${data.status}`);
      const components = ['pwp', 'wp', 'jwp', 'jcp', 'rest', 'cp'];
      components.forEach(comp => {
        if (data[comp] && shouldLogComponent(comp)) {
          const info = data[comp];
          let line = `[${dateTime}] -- ${name}${comp.toUpperCase()} status ${info.status}`;
          if (info.instancesRunning !== undefined) {
            line += ` with ${info.instancesRunning} instances running`;
          }
          lines.push(line);
        }
      });
      // Correct newline join
      writeOutput(lines.join('\n'));
    })
    .catch(error => {
      const dateTime = format(new Date(), 'dd.MM.yyyy HH:mm:ss');
      // Fix template variable
      writeOutput(`[${dateTime}] -- ERROR: ${error.message}`);
      if (timer === 0) {
        process.exit(100);
      }
    });
}

// Initial run
status();
writeOutput(`timer set to ${timer} minutes at ${format(new Date(), 'dd.MM.yyyy HH:mm:ss')}`);

if (timer > 0) {
  setInterval(status, 1000 * 60 * timer);
}
