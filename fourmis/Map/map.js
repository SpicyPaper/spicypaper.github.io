class Map
{
  constructor(width, height)
  {
    this.boxes = [];
    this.width = width;
    this.height = height;

    this.initMap();
  }

  getWidth()
  {
    return this.width;
  }

  setWidth(newWidth)
  {
    this.width = newWidth;
  }

  getHeight()
  {
    return this.height;
  }

  setHeight(newHeight)
  {
    this.height = newHeight;
  }

  getPixel(x, y)
  {
    return this.boxes[x][y];
  }

  setPixel(x, y, pixel)
  {
    return this.boxes[x][y].setRGB(pixel);
  }

  initMap()
  {
    let i;
    let j;
    for(i = 0; i < this.width; i++)
    {
      this.boxes[i] = [];

      for(j = 0; j < this.height; j++)
      {
        let newPixel = new Pixel(255, 255, 255);
        this.boxes[i][j] = newPixel;
      }
    }
  }

  resetMap()
  {
    let i;
    let j;
    for(i = 0; i < this.width; i++)
    {
      for(j = 0; j < this.height; j++)
      {
        this.boxes[i][j].setRGB(255, 255, 255);
      }
    }
  }

  isPosInMap(pos)
  {
    if(pos.x < 0 ||
      pos.y < 0 ||
      pos.x >= this.width ||
      pos.y >= this.height)
    {
      return false;
    }

    return true;
  }
}
