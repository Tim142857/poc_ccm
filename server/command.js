const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const suscribers = require("./suscribers");


function displayMessage() {
    
    for (let suscriber of suscribers.get()) {
        suscriber.writeHead(200, {
            "Content-Type": "text/event-stream",
        });

        suscriber.write(`id: ${count}\n`);
        suscriber.write(`event: news\n`);
        suscriber.write(`data: ${argv.msg}\n\n`);
    }
}

displayMessage();