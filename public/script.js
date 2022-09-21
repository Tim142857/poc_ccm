const URL_EVENTS = "http://127.0.0.1:8080/events";
const evtSource = new EventSource(URL_EVENTS)
var updatedCount = 0;
var hoveredTimer;
var hoveredCanvas = false;
var canvasInitialized = false;

const canvasListInfos = [
    {
        id: "my-canvas1",
        width: 300,
        height: 100,
        randomGrey: randomGreyHex(),
        mainFont: "24px serif",
        secondaryFont: "12px serif",
        darkTextColor: "red",
        lightTextColor: "yellow"
    },
    {
        id: "my-canvas2",
        width: 400,
        height: 400,
        randomGrey: randomGreyHex(),
        mainFont: "36px helvetica",
        secondaryFont: "24px helvetica",
        darkTextColor: "blue",
        lightTextColor: "white"
    }
]

function randomGreyHex() {
    var v = (Math.random() * (256) | 0).toString(16);
    return "#" + v + v + v;
}

function initAllCanvas() {
    let promises = [];
    for (let canvasInfo of canvasListInfos) {
        promises.push(initOneCanvas(canvasInfo));
    }
    return Promise.all(promises)
}

function initOneCanvas(canvasInfo) {
    return new Promise(function (resolve, reject) {
        try {
            let newCanvas = $('<canvas/>', {
                id: canvasInfo.id,
                class: "my-canvas"
            }).prop({
                width: canvasInfo.width,
                height: canvasInfo.height
            });
            $('body').append(newCanvas);
            $('body').append("</br></br>");

            canvas = $.find("#" + canvasInfo.id)[0];
            ctx = canvas.getContext("2d");
            ctx.fillStyle = canvasInfo.randomGrey;
            ctx.fillRect(0, 0, canvasInfo.width, canvasInfo.height);
            resolve();
        } catch (e) {
            reject("An error occured during canvas initialisation")
        }
    });
}

function redrawCanvas() {
    for (let canvasInfo of canvasListInfos) {
        canvas = $.find("#" + canvasInfo.id)[0];
        ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
        ctx.fillStyle = canvasInfo.randomGrey;
        ctx.fillRect(0, 0, canvasInfo.width, canvasInfo.height);
    }

}
function updateAllTexts(value, time) {
    redrawCanvas();
    let promises = [];

    for (let canvasInfo of canvasListInfos) {
        promises.push(updateOneText(value, time, canvasInfo));
    }
    return Promise.all(promises);
}
function updateOneText(value, time, canvasInfo) {
    return new Promise(function (resolve, reject) {
        try {
            canvas = $.find("#" + canvasInfo.id)[0];
            ctx = canvas.getContext("2d");

            isDarkGrey = ((0.2126 + 0.7152 + 0.0722) * canvasInfo.randomGrey.split('')[1]) < 127;
            ctx.fillStyle = isDarkGrey ? canvasInfo.lightTextColor : canvasInfo.darkTextColor;


            ctx.font = canvasInfo.mainFont;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(value, (canvasInfo.width / 2), (canvasInfo.height / 2));


            ctx.font = canvasInfo.secondaryFont;
            ctx.textAlign = "end";
            ctx.textBaseline = "bottom";
            ctx.fillText(time, canvasInfo.width, canvasInfo.height);

            hitServer();
            resolve();
        } catch (e) {
            reject("An error occured during canvas update")
        }
    });
}

function hitServer() {
    $.post("/update-count", { updatedCount });
}
function sendToBackHoveredCanvas() {
    $.post("/hovered-canvas", { hoveredCanvas });
}

window.addEventListener('load', function () {

    evtSource.addEventListener('news', async (event) => {
        console.log('event', event)
        updatedCount++;
        let eventParsed = JSON.parse(event.data);
        if (!canvasInitialized) {
            try {
                await initAllCanvas();
                $('body').find("#patientez").css("display", "none");
                canvasInitialized = true;
            } catch (e) {
                throw e;
            }
        }
        return updateAllTexts(eventParsed.data.value, eventParsed.data.time)
    });

    $('body').on("mouseenter", '.my-canvas', function () {
        if (!hoveredCanvas) {
            hoveredTimer = setTimeout(function () {
                hoveredCanvas = true;
                sendToBackHoveredCanvas();
            }, 2000)
        }
    });

    $('body').on("mouseout", '.my-canvas', function () {
        if (!hoveredCanvas) {
            clearTimeout(hoveredTimer)
            hoveredTimer = null;
        }
    })

});

