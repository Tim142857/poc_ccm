function getRandomText() {
    return Math.random().toString(36).slice(2);
};
function getFormattedDate() {
    let date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
function getNewData() {
    let result = {
        data: {
            value: getRandomText(),
            time: getFormattedDate()
        }
    }
    return JSON.stringify(result)
}

function sendServerEvents(res) {
    let count = 0;

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
    });

    setInterval(function () {
          res.write(`id: ${count}\n`);
          res.write(`event: news\n`);
          res.write(`data: ${getNewData()}\n\n`);
          count++;
    }, 5000)
}

module.exports = sendServerEvents;