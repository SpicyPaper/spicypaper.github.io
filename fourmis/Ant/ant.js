class Ant
{
  constructor(x, y, initDirection, ctx, color, secondColor, maxTTL, map, simulation)
  {
    this.startingX = x;
    this.startingY = y;
    this.x = x;
    this.y = y;
    this.startingDirection = initDirection
    this.currentDirection = initDirection;
    this.color = color;
    this.secondColor = secondColor;
    this.maxTTL = maxTTL;
    this.currentTTL = 0;
    this.map = map;
    this.simulation = simulation;

    this.ctx = ctx;

    Ant.directions = {
      0: [0, -1], //top
      1: [1, 0], //right
      2: [0, 1], //down
      3: [-1, 0], //left
    };
  }

  getX()
  {
    return this.x;
  }

  getY()
  {
    return this.y;
  }

  getColor()
  {
    return this.color;
  }

  getStartingX()
  {
    return this.startingX;
  }

  getStartingY()
  {
    return this.startingY;
  }

  addX(addedX)
  {
    this.x += addedX;
  }

  addY(addedY)
  {
    this.y += addedY;
  }

  restart(rect)
  {
    this.x = this.startingX;
    this.y = this.startingY;
    this.currentDirection = this.startingDirection;

    this.currentTTL = 0;
    this.paintOnCurrentPos(rect, this.color);
  }

  paintOnCurrentPos(rect, color)
  {
    this.map.getPixel(this.x, this.y).setRGB(color.r, color.g, color.b);

    this.ctx.fillStyle = rgbToHex(color);
    this.ctx.fillRect(this.x + rect.shiftX * rect.width, this.y + rect.shiftY * rect.height, rect.width, rect.height);
  }

  /**
   * Check if the ant position is in the map, if not replace the ant on a valid position.
   * The map is circular.
   */
  checkPos(rect)
  {
    if(this.x < 0)
    {
      this.x = rect.nbRectX - 1;
    }

    if(this.x > rect.nbRectX - 1)
    {
      this.x = 0;
    }

    if(this.y < 0)
    {
      this.y = rect.nbRectY - 1;
    }

    if(this.y > rect.nbRectY - 1)
    {
      this.y = 0;
    }
  }

  turnRight()
  {
    this.currentDirection += 1;
    this.checkTurn();
  }

  turnLeft()
  {
    this.currentDirection -= 1;
    this.checkTurn();
  }

  checkTurn()
  {
    if(this.currentDirection > 3)
    {
      this.currentDirection = 0;
    }
    else if(this.currentDirection < 0)
    {
      this.currentDirection = 3;
    }
  }

  isAlive()
  {
    if(this.currentTTL > this.maxTTL)
    {
      return false;
    }

    return true;
  }

  move(rect)
  {
    this.currentTTL += 1;
  }
}
