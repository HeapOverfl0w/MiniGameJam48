const WALL = 0;
const PATH = 1;
const START = 2;
const END = 3;

const TILESX = 16;
const TILESY = 9;
const TILEWIDTH = 16;
const TILEHEIGHT = 16; 

const SPRITES = document.getElementById("sprites");

const MOVESPEED = 2 * TILEWIDTH * (1/30);
const UP_VECTOR = new VelocityVector(0,-1, MOVESPEED);
const DOWN_VECTOR = new VelocityVector(0,1, MOVESPEED);
const LEFT_VECTOR = new VelocityVector(-1,0, MOVESPEED);
const RIGHT_VECTOR = new VelocityVector(1, 0, MOVESPEED);

const TEXT_FONT = "10px MS Gothic";
const TEXT_COLOR = "#FFFFFF";
const TEXT_BACKGROUND_COLOR = "#000000";

class Game
{
    constructor(ctx)
    {
        this.ctx = ctx;
        this.ctx.font = TEXT_FONT;
        this.connected = false;
        Connect().then(() => {
            this.StartGameConnected();
        });
    }

    StartGameConnected() {
        this.connected = true;
        //find start
        let startx = 0;
        let starty = 0;
        for (let x = 0; x < MAZE.length; x++) {
            for (let y = 0; y < MAZE[x].length; y++) {
                if (MAZE[x][y] == START) {
                    startx = x;
                    starty = y;
                    break;
                }
            }
        }
        this.me = new Actor(new Vector2D(startx * TILEWIDTH, starty * TILEHEIGHT));
        this.maze = new Maze(MAZE);
        this.Start();
    }

    Start()
    {
        //30 FPS
        setTimeout(this.UpdateDrawLoop, 1000 / 30, this);
        setTimeout(this.ConnectionUpdate, 200, this);
    }

    ConnectionUpdate(game)
    {
        SendLocation(game.me.location.x, game.me.location.y);
        setTimeout(game.ConnectionUpdate, 200, game);
    }

    UpdateDrawLoop(game)
    {
        game.Update();
        game.Draw();
        setTimeout(game.UpdateDrawLoop, 1000 / 30, game);
    }

    Update()
    {
        if (this.connected)
        {
            this.maze.Update(PLAYERS, this.me.location);
            this.me.Update(this.maze);
        }
    }

    Draw()
    {
        if (this.connected)
        {
            this.ctx.fillStyle = TEXT_BACKGROUND_COLOR;
            this.ctx.fillRect(0, 0, TILESX * TILEWIDTH, TILESY * TILEHEIGHT);
            this.maze.Draw(this.ctx, this.me.location, this.me);
            this.me.Draw(this.ctx);

            if (BRO_MESSAGE != "" && BRO_MESSAGE != undefined) {
                this.ctx.fillStyle = TEXT_BACKGROUND_COLOR;
                this.ctx.fillRect(0, 0, BRO_MESSAGE.length * 5, 12);
                this.ctx.fillStyle = TEXT_COLOR;
                this.ctx.fillText(BRO_MESSAGE, 0, 9);
            }

            for (let m = BRO_CHAT_MESSAGES.length - 1; m > -1; m--) {
                this.ctx.fillStyle = TEXT_BACKGROUND_COLOR;
                this.ctx.fillRect(0, TILESY * TILEHEIGHT - ((BRO_CHAT_MESSAGES.length - m) * 12), BRO_CHAT_MESSAGES[m].length * 5, 12);
                this.ctx.fillStyle = TEXT_COLOR;
                this.ctx.fillText(BRO_CHAT_MESSAGES[m], 0, TILESY * TILEHEIGHT - ((BRO_CHAT_MESSAGES.length - m - 1) * 12) - 3);
            }
        }
    }

    HandleKeyboardDown(key)
    {
        if (this.connected)
        {
            AUDIO.FirstStartMusic();
            //WADS
            if (key == 87) //W - Up
            {
                this.me.vectorContainer.Remove(UP_VECTOR);
                this.me.vectorContainer.Add(UP_VECTOR);
                AUDIO.PlayMud();
            }
            if (key == 83) //S - Down
            {
                this.me.vectorContainer.Remove(DOWN_VECTOR);
                this.me.vectorContainer.Add(DOWN_VECTOR);
                AUDIO.PlayMud();
            }
            if (key == 65) //A - Left
            {
                this.me.vectorContainer.Remove(LEFT_VECTOR);
                this.me.vectorContainer.Add(LEFT_VECTOR);
                AUDIO.PlayMud();
            }
            if (key == 68) //D - Right
            {
                this.me.vectorContainer.Remove(RIGHT_VECTOR);
                this.me.vectorContainer.Add(RIGHT_VECTOR);
                AUDIO.PlayMud();
            }
            if (key == 49) {
                if (AUDIO.audioOn)
                    AUDIO.Mute();
                else
                    AUDIO.UnMute();
            }
            if (key == 50) {
                if (AUDIO.musicOn)
                    AUDIO.MusicOff()
                else
                    AUDIO.MusicOn();
            }
        }
    }

    HandleKeyboardUp(key)
    {
        if (this.connected)
        {
            //WADS
            if (key == 87) //W - Up
            {
                this.me.vectorContainer.Remove(UP_VECTOR);
            }
            if (key == 83) //S - Down
            {
                this.me.vectorContainer.Remove(DOWN_VECTOR);
            }
            if (key == 65) //A - Left
            {
                this.me.vectorContainer.Remove(LEFT_VECTOR);
            }
            if (key == 68) //D - Right
            {
                this.me.vectorContainer.Remove(RIGHT_VECTOR);
            }

            if (key == 13) //enter
            {
                let chatbox = document.getElementById("chatbox");
                if (chatbox.style.visibility == "hidden") {
                    chatbox.style.visibility = "visible";
                    chatbox.focus();
                }
                else {
                    if (chatbox.value != undefined && chatbox.value != "")
                        SendBroMessage("Bro Said: " + chatbox.value);
                    chatbox.style.visibility = "hidden";
                    chatbox.value = "";
                }
            }
        }
    }
}