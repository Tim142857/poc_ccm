const fs = require("fs");
const path = require("path");

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
};

function serveFile(filePath, res) {
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] ?? 'application/octet-stream';

    function readFile(filePath, cb) {
        let data = "";
        const readStream = fs.createReadStream(filePath);
        readStream.on("data", (chunk) => {
            data += chunk;
        });
        readStream.on("end", () => cb(data));
        readStream.on("error", () => {
            cb("Can't serve file");
        });
    }
    readFile(path.join(__dirname, "../public", filePath), (data) => {
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
    });
}

module.exports = serveFile;