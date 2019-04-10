/**
 * Convert decimal value to hexa
 */
function componentToHex(c)
{
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

/**
 * Convert rgb dict to hexa
 */
function rgbToHex(color)
{
  return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

/**
 * Convert hexa to rgb dict.
 */
function hexToRgb(color)
{
  let newR = color.substring(0, 2);
  let newG = color.substring(2, 4);
  let newB = color.substring(4, 6);

  return {r: parseInt(newR, 16), g: parseInt(newG, 16), b: parseInt(newB, 16)};
}
