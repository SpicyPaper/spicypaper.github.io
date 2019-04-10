class Simulation
{
  constructor(rectNbX, rectNbY, mapSizeX, mapSizeY, antsLifeTime)
  {
    this.map = new Map(mapSizeX, mapSizeY);
    this.canvas = document.getElementById('myCanvas');
    this.ants = [];
    this.antsStep = 0;
    this.setAntsLifeTime(antsLifeTime);
    this.infiniteLifeTimeEnabled = true;
    this.shiftX = 0;
    this.shiftY = 0;
    this.antStartingDirection = -1;
    this.customAntArray = {};

    if(this.canvas.getContext)
    {
      this.changeZoom(rectNbX, rectNbY);

      this.clearCanvas();
    }
  }

  getCustomAntArray()
  {
    return this.customAntArray;
  }

  setCustomAntArray(newCustomAntArray)
  {
    this.customAntArray = newCustomAntArray;
  }

  getCanvas()
  {
    return this.canvas;
  }

  getCtx()
  {
    return this.ctx;
  }

  getShift()
  {
    return {
      x: this.shiftX,
      y: this.shiftY
    };
  }

  getMap()
  {
    return this.map;
  }

  getNbRect()
  {
    return {
      x: this.nbRectX,
      y: this.nbRectY
    };
  }

  setNbRect(x, y)
  {
    this.nbRectX = x;
    this.nbRectY = y;
  }

  getAntsLenght()
  {
    return this.ants.length;
  }

  getSizeRect()
  {
    return {
      width: this.sizeRectX,
      height: this.sizeRectY
    };
  }

  setAntsLifeTime(newAntsLifeTime)
  {
    this.antsLifeTime = newAntsLifeTime;
  }

  setAntStartingDirection(direction)
  {
    this.antStartingDirection = direction;
  }

  static paintDirectlyOnCanvasAndMapWithMouse(ctx, map, pos, rect, color, shift)
  {
    map.getPixel(pos.x + shift.x, pos.y + shift.y).setRGB(color.r, color.g, color.b);

    ctx.fillStyle = rgbToHex(color);
    ctx.fillRect((pos.x) * rect.width, (pos.y) * rect.height, rect.width, rect.height);
  }

  static paintDirectlyOnCanvasAndMap(ctx, map, pos, rect, color, shift)
  {
    map.getPixel(pos.x, pos.y).setRGB(color.r, color.g, color.b);

    ctx.translate(-shift.x * rect.width, -shift.y * rect.height);

    ctx.fillStyle = rgbToHex(color);
    ctx.fillRect((pos.x) * rect.width, (pos.y) * rect.height, rect.width, rect.height);

    ctx.translate(shift.x * rect.width, shift.y * rect.height);
  }

  static paintOnCanvas(ctx, pos, rect, color)
  {
    ctx.fillStyle = rgbToHex(color);
    ctx.fillRect((pos.x) * rect.width, (pos.y) * rect.height, rect.width, rect.height);
  }

  /**
   * Move the simulation in the given direction.
   * All the pixels are redraw on the canvas, to show the correct part of the map.
   */
  moveSimulation(amountX, amountY, moveSimulationStep)
  {
    let newShiftX = amountX * moveSimulationStep;
    let newShiftY = amountY * moveSimulationStep;

    if(this.shiftX + newShiftX >= 0 &&
        this.shiftX + newShiftX + parseInt(this.nbRectX) <= this.map.getWidth() &&
        this.shiftY + newShiftY >= 0 &&
        this.shiftY + newShiftY + parseInt(this.nbRectY) <= this.map.getHeight())
    {
      this.clearCanvas();

      this.shiftX += newShiftX;
      this.shiftY += newShiftY;

      let i;
      let j;
      // For each pixel
      for(i = 0; i < this.nbRectX; i++)
      {
        for(j = 0; j < this.nbRectY; j++)
        {
          Simulation.paintOnCanvas(
            this.ctx,
            {x: i, y: j},
            {
              width: this.sizeRectX,
              height: this.sizeRectY
            },
            this.map.getPixel(i + this.shiftX, j + this.shiftY).getRGB()
          );
        }
      }
    }
  }

  changeSimulationPos(amountX, amountY)
  {
    let x = amountX - this.shiftX;
    let y = amountY - this.shiftY;

    this.moveSimulation(x, y, 1);
  }

  /**
   * Change the zoom of the canvas.
   * The canvas can't show pixel that aren't in the map.
   */
  changeZoom(rectNbX, rectNbY)
  {
    if(this.canvas.getContext)
    {
      this.ctx = this.canvas.getContext('2d');
      this.nbRectX = rectNbX;
      this.nbRectY = rectNbY;

      this.sizeRectX = Math.floor(this.canvas.width / this.nbRectX);
      this.sizeRectY = Math.floor(this.canvas.height / this.nbRectY);

      let isOutOfMap = false;

      if(this.shiftX + parseInt(this.nbRectX) > this.map.getWidth())
      {
        this.moveSimulation(1, 0, this.map.getWidth() - (this.shiftX + parseInt(this.nbRectX)));
        isOutOfMap = true;
      }

      if(this.shiftY + parseInt(this.nbRectY) > this.map.getHeight())
      {
        this.moveSimulation(0, 1, this.map.getHeight() - (this.shiftY + parseInt(this.nbRectY)));
        isOutOfMap = true;
      }

      if(isOutOfMap == false)
      {
        this.moveSimulation(0, 0, 0);
      }
    }
  }

  enableInfiniteLifeTime(enabled)
  {
    this.infiniteLifeTimeEnabled = enabled;
  }

  /**
   * Add a new ant on the map at the specific position.
   * The new ant type is passed in argument.
   */
  addNewAnt(type, pos)
  {
    if(this.map.isPosInMap(pos) == true)
    {
      let startingDirection = this.antStartingDirection;

      if(startingDirection == -1)
      {
        startingDirection = Math.floor((Math.random() * 3.99));
      }

      let color;
      let secondColor = {
        r: 255,
        g: 255,
        b: 255
      }

      let newAnt;

      switch (type)
      {
        case 1:
          color = {
            r: 0,
            g: 0,
            b: 0
          };

          newAnt = new ClassicAnt(pos.x, pos.y, startingDirection, this.ctx, color, secondColor, this.antsLifeTime, this.map, this);
          break;
        case 2:
          color = {
            r: Math.floor(Math.random() * 255.99),
            g: Math.floor(Math.random() * 255.99),
            b: Math.floor(Math.random() * 255.99)
          };

          newAnt = new WarriorAnt(pos.x, pos.y, startingDirection, this.ctx, color, secondColor, this.antsLifeTime, this.map, this);
          break;
        case 3:
          color = {
            r: Math.floor(Math.random() * 255.99),
            g: Math.floor(Math.random() * 255.99),
            b: Math.floor(Math.random() * 255.99)
          };

          newAnt = new RandomAnt(pos.x, pos.y, startingDirection, this.ctx, color, secondColor, this.antsLifeTime, this.map, this);
          break;
        case 4:
          newAnt = new CustomAnt(pos.x, pos.y, startingDirection, this.ctx, hexToRgb(this.customAntArray[1]["color"]), null, this.antsLifeTime, this.map, this);

          newAnt.setCustomAntArray(this.customAntArray);
          break;

        default:
          break;
      }

      let posNewAntInArray = this.ants.length;
      this.ants[posNewAntInArray] = newAnt;

      document.getElementById("antsNb").innerHTML = this.ants.length;

      return newAnt;
    }
  }

  /**
   * To draw correctly in the canvas and respect the grid, the position where the
   * user clicked is corrected and placed on the top-left corner of the square in
   * which the clic was done.
   */
  correctMousePos(pos)
  {
    let realPos = {
      x:0,
      y:0
    };

    let i;
    for(i = 0; i < this.nbRectX; i++)
    {
      if(pos.x < i * this.sizeRectX)
      {
        break;
      }

      realPos.x = i * this.sizeRectX;
    }

    for(i = 0; i < this.nbRectY; i++)
    {
      if(pos.y < i * this.sizeRectY)
      {
        break;
      }

      realPos.y = i * this.sizeRectY;
    }

    return realPos;
  }

  clearCanvas()
  {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resetAnts()
  {
    this.ants = [];
    this.antsStep = 0;

    this.map.resetMap();

    this.clearCanvas();

    document.getElementById("antsStep").innerHTML = this.antsStep;
    document.getElementById("antsNb").innerHTML = this.ants.length;
  }

  restartAnts()
  {
    this.map.resetMap();

    this.clearCanvas();

    let i;
    for(i = 0; i < this.ants.length; i++)
    {
      this.ants[i].restart(
        {width: this.sizeRectX, height: this.sizeRectY, nbRectX: this.nbRectX, nbRectY: this.nbRectY}
      );
    }

    this.antsStep = 0;

    document.getElementById("antsStep").innerHTML = this.antsStep;
    document.getElementById("antsNb").innerHTML = this.ants.length;
  }

  /**
   * Move the ants on the map.
   * Make the tests of each ant.
   * Perform these operations as many times as indicated by "step".
   */
  moveAnts(step)
  {
    let j;
    for(j = 0; j < step; j++)
    {
      let i;
      // For each ant
      for(i = this.ants.length - 1; i >= 0; i--)
      {
        if(this.ants[i].isAlive() || this.infiniteLifeTimeEnabled)
        {
          this.ants[i].move({
            shiftX: this.shiftX,
            shiftY: this.shiftY,
            width: this.sizeRectX,
            height: this.sizeRectY,
            nbRectX: this.map.width,
            nbRectY: this.map.height
          });
        }
        else
        {
          this.ants.splice(i, 1);
        }
      }

      this.antsStep += 1;

      document.getElementById("antsStep").innerHTML = this.antsStep;
      document.getElementById("antsNb").innerHTML = this.ants.length;
    }
  }
}
