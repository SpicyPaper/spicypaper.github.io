class CustomAnt extends Ant
{
  setCustomAntArray(customAntArray)
  {
    this.customAntArray = customAntArray;
  }

  /**
   * Test if the color, on which the ant is, is in the array.
   * If yes the next color in the array will replace the current color.
   * The ant is rotate of 90° in the indicated direction
   * in the next case of the array. Finally the ant move forward.
   * If no, the first color and direction are taken.
   */
  move(rect)
  {
    super.move(rect);

    // Pixel data of current pos
    let pixelDataMap = this.map.getPixel(this.x, this.y).getRGB();

    let nextIndex = 2;

    let i;
    for(i = 1; i <= Object.keys(this.customAntArray).length; i++)
    {
      let testedColor = hexToRgb(this.customAntArray[i]["color"]);
      if(pixelDataMap.r == testedColor.r && pixelDataMap.g == testedColor.g && pixelDataMap.b == testedColor.b)
      {
        nextIndex = i + 1;
        if(nextIndex > Object.keys(this.customAntArray).length)
        {
          nextIndex = 1;
        }

        break;
      }
    }

    // Direction = 0 --> right, 1 --> left
    if(this.customAntArray[nextIndex]["direction"] == 0)
    {
      this.turnRight();
    }
    else
    {
      this.turnLeft();
    }

    Simulation.paintDirectlyOnCanvasAndMap(
      this.ctx,
      this.map,
      {x: this.x, y: this.y},
      this.simulation.getSizeRect(),
      hexToRgb(this.customAntArray[nextIndex]["color"]),
      this.simulation.getShift()
    );

    this.addX(Ant.directions[this.currentDirection][0]);
    this.addY(Ant.directions[this.currentDirection][1]);
    this.checkPos(rect);
  }
}
