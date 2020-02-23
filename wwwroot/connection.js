var MAZE = [];
var PLAYERS = [];
var PLAYERNUM = 0;
var BRO_MESSAGE = "";
var broMessageTimeout = undefined;

const gameConnect = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("/hedgemaze/")
    .build();

gameConnect.on("UpdateBros", function(result){
    PLAYERS = result;
});

gameConnect.on("PlayerNumber", function (result) {
    PLAYERNUM = result;
});

gameConnect.on("BroConnect", function(result){
    SetBroMessage(result);
});

gameConnect.on("ResetGame", (result) => {
    gameConnect.stop().then(() => {
        location.reload();
    });    
});

gameConnect.on("BroMessage", (result) => {
    SetBroMessage(result);
});

function SetBroMessage(message) {
    BRO_MESSAGE = message;
    if (broMessageTimeout != undefined)
        clearTimeout(broMessageTimeout)
    broMessageTimeout = setTimeout(function () {
        BRO_MESSAGE = "";
    }, 3000);
}

function Connect()
{
    return new Promise((resolve, reject) => {
        fetch("/hedge").then((result) => {
            result.json().then((data) => {
                MAZE = data;
                gameConnect.start().then(() => {
                    gameConnect.invoke("Connect");
                    resolve();
                });
            });
        });
    });
}

function SendLocation(x, y)
{
    gameConnect.invoke("SendLocation", Math.round(x), Math.round(y));
}

function SendBroMessage(message) {
    gameConnect.invoke("SendBroMessage", message);
}