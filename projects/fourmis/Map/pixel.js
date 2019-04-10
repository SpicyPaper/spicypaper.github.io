class Pixel
{
  constructor(red, green, blue)
  {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  getRGB()
  {
    return {
      r: this.red,
      g: this.green,
      b: this.blue
    };
  }

  setRGB(red, green, blue)
  {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  setRGB_WithPixel(pixel)
  {
    let pixelRGB = pixel.getRGB();

    this.setRGB(pixelRGB.r, pixelRGB.g, pixelRGB.b);
  }
}
