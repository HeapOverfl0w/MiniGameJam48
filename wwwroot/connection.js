var MAZE = [];
var PLAYERS = [];
var PLAYERNUM = 0;
var BRO_MESSAGE = "";
var BRO_CHAT_MESSAGES = [];
var broMessageTimeout = undefined;
var broChatMessageTimeout = undefined;

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
    if (result == "Skeleton got a bro.")
        AUDIO.PlayBones();
    if (result.startsWith("Bro Said:"))
        SetBroChatMessage(result);
    else
        SetBroMessage(result);
});

function SetBroChatMessage(message) {
    BRO_CHAT_MESSAGES.push(message);
    if (broChatMessageTimeout != undefined)
        clearTimeout(broChatMessageTimeout)
    broChatMessageTimeout = setTimeout(function () {
        BRO_CHAT_MESSAGES = [];
    }, 6000);
}

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