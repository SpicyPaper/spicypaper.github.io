class WarriorAnt extends Ant
{
  move(rect)
  {
    super.move(rect);

    // Pixel data of current pos
    let pixelDataMap = this.map.getPixel(this.x, this.y).getRGB();

    if(pixelDataMap.r == this.color.r && pixelDataMap.g == this.color.g && pixelDataMap.b == this.color.b)
    {
      Simulation.paintDirectlyOnCanvasAndMap(
        this.ctx,
        this.map,
        {x: this.x, y: this.y},
        this.simulation.getSizeRect(),
        this.secondColor,
        this.simulation.getShift()
      );

      this.turnLeft();
    }
    else
    {
      Simulation.paintDirectlyOnCanvasAndMap(
        this.ctx,
        this.map,
        {x: this.x, y: this.y},
        this.simulation.getSizeRect(),
        this.color,
        this.simulation.getShift()
      );

      this.turnRight();
    }

    this.addX(Ant.directions[this.currentDirection][0]);
    this.addY(Ant.directions[this.currentDirection][1]);
    this.checkPos(rect);
  }
}
