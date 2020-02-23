class Actor
{
    constructor(location)
    {
        this.vectorContainer = new VectorContainer();
        this.location = location; //Vector2D
        this.startLocation = location.Clone();
    }

    Update(maze)
    {
        let vecX = this.vectorContainer.CalculateOverallVector().GetNormalizedSpeedX();
        let vecY = this.vectorContainer.CalculateOverallVector().GetNormalizedSpeedY();
        let x = this.location.x + vecX;
        let y = this.location.y + vecY;
        let roundX = Math.round(x / TILEWIDTH);
        let roundY = Math.round(y / TILEHEIGHT);

        if (maze.mazeData[roundX][roundY] == WALL ||
            maze.mazeData[roundX][roundY] - 100 > 0) //Gate
            return;

        for (let p = 0; p < maze.players.length; p++) {
            if (maze.players[p].num == -1 && Math.round(maze.players[p].x / TILEWIDTH) == roundX && Math.round(maze.players[p].y / TILEHEIGHT) == roundY) {
                SendBroMessage("Skeleton got a bro.");
                this.location.x = this.startLocation.x;
                this.location.y = this.startLocation.y;
                return;
            }
        }

        this.location.x = x;
        this.location.y = y;

        this.vectorContainer.RemoveLostVeloctiyVectors();
    }

    Draw(ctx, x, y)
    {
        ctx.drawImage(SPRITES, 0, TILEHEIGHT * 2, TILEWIDTH, TILEHEIGHT, x, y, TILEWIDTH, TILEHEIGHT);
    }
}

class Maze
{
    constructor(mazeData)
    {
        this.mazeData = mazeData;

        this.visitedLocations = [];

        this.doorTriggers = [];
        for (let x = 0; x < this.mazeData.length; x++) {
            this.visitedLocations[x] = [];
            for (let y = 0; y < this.mazeData[x].length; y++) {
                this.visitedLocations[x][y] = false;
                if (this.mazeData[x][y] - 100 > 0) //found door
                {
                    //find the triggers
                    let trigger1 = undefined;
                    let trigger2 = undefined;
                    for (let tx = 0; tx < this.mazeData.length; tx++) {
                        for (let ty = 0; ty < this.mazeData[tx].length; ty++) {
                            if (this.mazeData[tx][ty] == this.mazeData[x][y] - 100) {
                                if (trigger1 == undefined)
                                    trigger1 = new Vector2D(tx, ty);
                                else {
                                    trigger2 = new Vector2D(tx, ty);
                                    break;
                                }
                            }
                        }
                        if (trigger2 != undefined)
                            break;
                    }

                    this.doorTriggers.push({
                        door: new Vector2D(x, y),
                        trigger1: trigger1,
                        trigger2: trigger2
                    });
                }
            }
        }
        this.players = [];
    }

    Update(players)
    {
        this.players = players;

        //reset doors
        for (let t = 0; t < this.doorTriggers.length; t++) {
            this.mazeData[this.doorTriggers[t].door.x][this.doorTriggers[t].door.y] = this.mazeData[this.doorTriggers[t].trigger1.x][this.doorTriggers[t].trigger1.y] + 100;
        }
        //update doors/gates based on player placement
        for (let p = 0; p < this.players.length; p++) {
            if (this.players[p].num != -1) {
                //set visited locations
                let tilex = Math.round(this.players[p].x / TILEWIDTH);
                let tiley = Math.round(this.players[p].y / TILEHEIGHT);
                this.visitedLocations[tilex][tiley] = true;
                for (let t = 0; t < this.doorTriggers.length; t++) {
                    if (tilex == this.doorTriggers[t].trigger1.x && tiley == this.doorTriggers[t].trigger1.y) {
                        SetBroMessage("Bro is opening a gate.");
                        this.mazeData[this.doorTriggers[t].door.x][this.doorTriggers[t].door.y] = PATH;
                    }
                    else if (this.doorTriggers[t].trigger2 != undefined && tilex == this.doorTriggers[t].trigger2.x && tiley == this.doorTriggers[t].trigger2.y) {
                        SetBroMessage("Bro is opening a gate.");
                        this.mazeData[this.doorTriggers[t].door.x][this.doorTriggers[t].door.y] = PATH;
                    }
                }
            }
        }
    }

    Draw(ctx, camera, me)
    {
        //camera is player's location based in pixels
        let cameraTileX = Math.floor(camera.x / TILEWIDTH);
        let cameraTileY = Math.floor(camera.y / TILEHEIGHT);
        let meTileX = Math.ceil(me.location.x / TILEWIDTH);
        let meTileY = Math.ceil(me.location.y / TILEHEIGHT);
        let topTileX = cameraTileX - Math.floor(TILESX / 2) + 1;
        let topTileY = cameraTileY - Math.floor(TILESY / 2) + 1;
        let cameraOffsetX = Math.floor(camera.x % TILEWIDTH);
        let cameraOffsetY = Math.floor(camera.y % TILEHEIGHT);

        for(let x = topTileX; x < topTileX + TILESX + 1; x++)
        {
            for (let y = topTileY; y < topTileY + TILESY + 1; y++)
            {
                if (x >= 0 && y >= 0 && x < this.mazeData.length && y < this.mazeData[x].length)
                {
                    if (this.mazeData[x][y] == WALL)
                        ctx.drawImage(SPRITES, TILEWIDTH, 0, TILEWIDTH, 20, (x - topTileX) * TILEWIDTH - cameraOffsetX, (y - topTileY) * TILEHEIGHT - cameraOffsetY - 4, TILEWIDTH, 20);
                    else if (this.mazeData[x][y] == PATH) {
                        if (this.visitedLocations[x][y])
                            ctx.drawImage(SPRITES, 0, TILEHEIGHT, TILEWIDTH, TILEHEIGHT, (x - topTileX) * TILEWIDTH - cameraOffsetX, (y - topTileY) * TILEHEIGHT - cameraOffsetY, TILEWIDTH, TILEHEIGHT);
                        else
                            ctx.drawImage(SPRITES, 0, 0, TILEWIDTH, TILEHEIGHT, (x - topTileX) * TILEWIDTH - cameraOffsetX, (y - topTileY) * TILEHEIGHT - cameraOffsetY, TILEWIDTH, TILEHEIGHT);
                    }
                    else if (this.mazeData[x][y] == START)
                        ctx.drawImage(SPRITES, TILEWIDTH * 2, 0, TILEWIDTH, TILEHEIGHT, (x - topTileX) * TILEWIDTH - cameraOffsetX, (y - topTileY) * TILEHEIGHT - cameraOffsetY, TILEWIDTH, TILEHEIGHT);
                    else if (this.mazeData[x][y] == END)
                        ctx.drawImage(SPRITES, TILEWIDTH * 3, 0, TILEWIDTH, TILEHEIGHT, (x - topTileX) * TILEWIDTH - cameraOffsetX, (y - topTileY) * TILEHEIGHT - cameraOffsetY, TILEWIDTH, TILEHEIGHT);
                    else {
                        if (this.mazeData[x][y] - 100 > 0) //door
                            ctx.drawImage(SPRITES, TILEWIDTH * 4, 0, TILEWIDTH, 20, (x - topTileX) * TILEWIDTH - cameraOffsetX, (y - topTileY) * TILEHEIGHT - cameraOffsetY - 4, TILEWIDTH, 20);
                        else //switch
                            ctx.drawImage(SPRITES, TILEWIDTH * 5, 0, TILEWIDTH, TILEHEIGHT, (x - topTileX) * TILEWIDTH - cameraOffsetX, (y - topTileY) * TILEHEIGHT - cameraOffsetY, TILEWIDTH, TILEHEIGHT);
                    }

                    //draw player
                    if (x == meTileX && y == meTileY)
                    {
                        let topX = topTileX * TILEWIDTH;
                        let topY = topTileY * TILEHEIGHT;
                        me.Draw(ctx, Math.round(me.location.x - topX) - cameraOffsetX, Math.round(me.location.y - topY) - cameraOffsetY);
                    }
                }
            }
        }


        for (let p = 0; p < this.players.length; p++)
        {
            let x = this.players[p].x;
            let y = this.players[p].y;
            let topX = topTileX * TILEWIDTH;
            let topY = topTileY * TILEHEIGHT;
            let bottomX = topX - (TILEWIDTH * TILESX);
            let bottomY = topY - (TILEHEIGHT * TILESY);

            if (topX <= x && topY <= y && x >= bottomX && y >= bottomY && this.players[p].num != PLAYERNUM) {
                if (this.players[p].num == -1) {
                    let enemyTileX = Math.round(x / TILEWIDTH);
                    let enemyTileY = Math.round(y / TILEHEIGHT);
                    if (enemyTileX >= 0 && enemyTileX < this.mazeData.length &&
                        enemyTileY >= 0 && enemyTileY < this.mazeData[0].length) {

                        if (this.mazeData[enemyTileX][enemyTileY] == WALL)
                            ctx.drawImage(SPRITES, TILEWIDTH * 2, TILEHEIGHT * 2, TILEWIDTH, TILEHEIGHT, x - topX - cameraOffsetX, y - topY - cameraOffsetY, TILEWIDTH, TILEHEIGHT);
                        else
                            ctx.drawImage(SPRITES, TILEWIDTH, TILEHEIGHT * 2, TILEWIDTH, TILEHEIGHT, x - topX - cameraOffsetX, y - topY - cameraOffsetY, TILEWIDTH, TILEHEIGHT);

                    }
                    
                }
                else
                    ctx.drawImage(SPRITES, 0, TILEHEIGHT * 2, TILEWIDTH, TILEHEIGHT, x - topX - cameraOffsetX, y - topY - cameraOffsetY, TILEWIDTH, TILEHEIGHT);
            }
        }
    }
}