class Vector2D
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    GetNormalizedX()
    {
        let length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length == 0)
            return 0;
        return this.x / length;
    }

    GetNormalizedY()
    {
        let length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length == 0)
            return 0;
        return this.y / length;
    }

    Clone()
    {
        return new Vector2D(this.x, this.y);
    }
}

class VelocityVector extends Vector2D
{
    constructor(x, y, speed)
    {
        super(x, y);
        this.speed = speed;
        this.tick = 1;
    }

    GetNormalizedSpeedX()
    {
        if (this.tick == 11)
            return 0;
        return this.GetNormalizedX() * (this.speed / this.tick);
    }

    GetNormalizedSpeedY()
    {
        if (this.tick == 11)
            return 0;
        return this.GetNormalizedY() * (this.speed / this.tick);
    }

    HasLostVelocity()
    {
        return this.tick > 10;
    }

    Clone()
    {
        return new VelocityVecotr(this.x, this.y, this.speed);
    }
}

class DecelerationVector extends VelocityVector
{
    constructor(x, y, speed, ms)
    {
        super(x, y, speed);
        this.ms = ms;
    }

    StartDeceleration()
    {
        setTimeout(DecelerationHandler(), ms / 10, this)
    }

    DecelerationHandler()
    {
        decelerationVector.tick++;
        if (decelerationVector.tick < 11)
            decelerationVector.StartDeceleration();
    }

    Clone()
    {
        return new DecelerationVector(this.x, this.y, this.speed, this.ms);
    }
}

class VectorContainer
{
    constructor()
    {
        this.vectors = [];
    }

    Add(vector)
    {
        this.vectors.push(vector);
    }

    Remove(vector)
    {
        for(let i = this.vectors.length - 1; i > 0; i--)
        {
            if (this.vectors[i] == vector)
            {
                this.vectors.splice(i, 1);
                break;
            }
        }
    }

    Clear()
    {
        this.vectors = [];
    }

    RemoveLostVeloctiyVectors()
    {
        for(let i = this.vectors.length - 1; i > 0; i--)
        {
            if (this.vectors[i].HasLostVelocity())
                this.vectors.splice(i, 1);
        }
    }

    CalculateOverallVector()
    {
        var returnVector = new Vector2D(0, 0);
        for(let i = this.vectors.length - 1; i > 0; i--)
        {
            returnVector.x += this.vectors[i].GetNormalizedSpeedX();
            returnVector.y += this.vectors[i].GetNormalizedSpeedY();
        }

        return new VelocityVector(returnVector.x, returnVector.y, Math.sqrt(returnVector.x * returnVector.x + returnVector.y * returnVector.y));
    }
}