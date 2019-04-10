let simulation;
let requestID;
let mouseMode;
let canvasMouseAction;
let antType;
let currentTime;
let currentFPS;
let isOptionsOpen;
let oneOptionOpen;
let customAntNumber;
let stepPerTick;

window.requestAnimFrame =
  window.requestAnimationFrame || // La fonction d'origine que tous les navigateurs finiront par utiliser.
  window.webkitRequestAnimationFrame || // Pour Chrome et Safari.
  window.mozRequestAnimationFrame || // Pour Firefox.
  window.ORequestAnimationFrame || // Pour Opera.
  window.msRequestAnimationFrame // Pour Internet Explorer.

window.onload = function ()
{
  document.getElementById("zoomSlider").value = 250;
  let rectNb = document.getElementById("zoomSlider").value;
  let antsLifeTime = document.getElementById("lifeTimeSlider").value;
  let mapSizeX = document.getElementById("changeMapSizeX").value;
  let mapSizeY = document.getElementById("changeMapSizeY").value;
  simulation = new Simulation(rectNb, rectNb, mapSizeX, mapSizeY, antsLifeTime);

  document.getElementById("simulationPosX").value = simulation.getShift().x;
  document.getElementById("simulationPosY").value = simulation.getShift().y;
  document.getElementById("mapSizeX").value = simulation.getMap().getWidth();
  document.getElementById("mapSizeY").value = simulation.getMap().getHeight();

  document.getElementById("antsNb").innerHTML = 0;
  document.getElementById("rectNumber").innerHTML = rectNb;
  document.getElementById("lifeTime").innerHTML = antsLifeTime;
  document.getElementById("fps").innerHTML = 0;

  currentTime = 0;

  currentFPS = 0;

  stepPerTick = document.getElementById("stepPerTick").value;

  customAntNumber = 2;

  isOptionsOpen = true;
  oneOptionOpen = {
    1: {"visible": false, "elementId": {"content": "content_mouseOnCanvas", "arrow": "arrow_mouseOnCanvas"}},
    2: {"visible": true, "elementId": {"content": "content_ant", "arrow": "arrow_ant"}},
    3: {"visible": false, "elementId": {"content": "content_map", "arrow": "arrow_map"}},
    4: {"visible": false, "elementId": {"content": "content_simulationOptions", "arrow": "arrow_simulationOptions"}}
  };

  for (var i = 1; i <= Object.keys(oneOptionOpen).length; i++)
  {
    if(oneOptionOpen[i]["visible"] == true)
    {
      document.getElementById(oneOptionOpen[i]["elementId"]["content"]).style.display = "inline-block";
      document.getElementById(oneOptionOpen[i]["elementId"]["arrow"]).innerHTML = "&#8896;";
    }
    else
    {
      document.getElementById(oneOptionOpen[i]["elementId"]["content"]).style.display = "none";
      document.getElementById(oneOptionOpen[i]["elementId"]["arrow"]).innerHTML = "&#8897;";
    }
  }

  document.getElementById("clicking").checked = true;
  mouseMode = 2;

  document.getElementById("antsSpawning").checked = true;
  canvasMouseAction = 2;

  document.getElementById("infiniteLifeTime").checked = true;
  simulation.enableInfiniteLifeTime(document.getElementById("infiniteLifeTime").checked);

  document.getElementById("classicAnt").checked = true;
  antType = 1;

  simulation.canvas.addEventListener("mousedown", onMouseDown, false);
  simulation.canvas.addEventListener("mouseup", onMouseUp, false);
  simulation.canvas.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("keydown", onKeyDown, false);
}

/**
 * Detect if a key is pressed to move the simulation.
 */
function onKeyDown(event)
{
  let keyCode = event.key;

  switch (keyCode)
  {
    case 'w':
    case 'W':
      moveSimulation('u');
      break;

    case 's':
    case 'S':
      moveSimulation('d');
      break;

    case 'a':
    case 'A':
      moveSimulation('l');
      break;

    case 'd':
    case 'D':
      moveSimulation('r');
      break;

    default:
      break;
  }
}

function onMouseDown(event)
{
  simulation.isUserClicking = true;

  if(mouseMode == 2)
  {
    mouseAction(event);
  }
}

function onMouseUp(event)
{
  simulation.isUserClicking = false;
}

function onMouseMove(event)
{
  if (simulation.isUserClicking)
  {
    if(mouseMode == 1)
    {
      mouseAction(event);
    }
  }
}

/**
 * Depends on the selected action by the user.
 * Draw on the canvas, or make ants spawn.
 */
function mouseAction(event)
{
  let rect = simulation.canvas.getBoundingClientRect();

  let pos = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  pos = simulation.correctMousePos(pos);

  // Draw on canvas
  if(canvasMouseAction == 1)
  {
    Simulation.paintDirectlyOnCanvasAndMapWithMouse(
      simulation.getCtx(),
      simulation.getMap(),
      {x: Math.floor(pos.x * (simulation.getNbRect().x / simulation.getCanvas().width)),
        y: Math.floor(pos.y * (simulation.getNbRect().y / simulation.getCanvas().height))},
      {width: simulation.sizeRectX, height: simulation.sizeRectY},
      {r: 0, g: 0, b: 0},
      simulation.getShift()
    );
  }

  // Make ants spawn on canvas
  if(canvasMouseAction == 2)
  {
    // If the custom ant is choose, the customAntArray is refreshed.
    if(antType == 4)
    {
      let newCustomAntArray = {};

      let i;
      for(i = 1; i <= customAntNumber; i++)
      {
        // direction = 0 --> right, 1 --> left
        let direction = 0;
        if(document.getElementById("customAntTurnLeft" + i).checked)
        {
          direction = 1;
        }

        let color = document.getElementById("customAntColor" + i).value;
        color = color.substring(1, color.length);

        newCustomAntArray[i] = {
          "direction": direction,
          "color": color
        }
      }

      simulation.setCustomAntArray(newCustomAntArray);
    }

    let antPos = {
      x: pos.x / simulation.getSizeRect().width + simulation.getShift().x,
      y: pos.y / simulation.getSizeRect().height + simulation.getShift().y
    };

    let ant = simulation.addNewAnt(antType, antPos);
    let antColor = ant.getColor();

    Simulation.paintDirectlyOnCanvasAndMapWithMouse(
      simulation.getCtx(),
      simulation.getMap(),
      {x: Math.floor(pos.x * (simulation.getNbRect().x / simulation.getCanvas().width)),
        y: Math.floor(pos.y * (simulation.getNbRect().y / simulation.getCanvas().height))},
      {width: simulation.sizeRectX, height: simulation.sizeRectY},
      {r: antColor.r, g: antColor.g, b: antColor.b},
      simulation.getShift()
    );
  }
}

function startAnts()
{
	cancelAnimationFrame(requestID);
  requestID = requestAnimFrame(moveAnts);

  currentTime = Date.now();

  if(simulation.getAntsLenght() > 0)
  {
    document.getElementById("antState").innerHTML = "RUNNING";
  }
}

function pauseAnts()
{
	cancelAnimationFrame(requestID);
  document.getElementById("antState").innerHTML = "PAUSE";
}

function resetAnts()
{
	cancelAnimationFrame(requestID);
  document.getElementById("antState").innerHTML = "RESET";

  simulation.resetAnts();
}

function restartAnts()
{
	cancelAnimationFrame(requestID);
  requestID = requestAnimFrame(moveAnts);

  currentTime = Date.now();

  if(simulation.getAntsLenght() > 0)
  {
    document.getElementById("antState").innerHTML = "RUNNING";
    simulation.restartAnts();
  }
}

function stopAnts()
{
	cancelAnimationFrame(requestID);
  document.getElementById("antState").innerHTML = "STOPPED";
  simulation.restartAnts();
}

function moveAnts()
{
  currentFPS += 1;

  if(Date.now() - currentTime >= 1000)
  {
    document.getElementById("fps").innerHTML = currentFPS;
    currentTime = Date.now();
    currentFPS = 0;
  }

  if(simulation.getAntsLenght() > 0)
  {
    simulation.moveAnts(stepPerTick);
    requestID = requestAnimFrame(moveAnts);
  }
  else
  {
    document.getElementById("antState").innerHTML = "NOT ENOUGH ANTS";
  }
}

function addAntRandomPos()
{
  // If the custom ant is choose, the customAntArray is refreshed.
  if(antType == 4)
  {
    let newCustomAntArray = {};

    let i;
    for(i = 1; i <= customAntNumber; i++)
    {
      // direction = 0 --> right, 1 --> left
      let direction = 0;
      if(document.getElementById("customAntTurnLeft" + i).checked)
      {
        direction = 1;
      }

      let color = document.getElementById("customAntColor" + i).value;
      color = color.substring(1, color.length);

      newCustomAntArray[i] = {
        "direction": direction,
        "color": color
      }
    }

    simulation.setCustomAntArray(newCustomAntArray);
  }

  let addedAnt = document.getElementById("addAnt").value;

  let i;
  for(i = 0; i < addedAnt; i++)
  {
    let antPos = {
      x: Math.floor(Math.random() * (Number(simulation.getNbRect().x - 1) + 0.99)) + simulation.getShift().x,
      y: Math.floor(Math.random() * (Number(simulation.getNbRect().y - 1) + 0.99)) + simulation.getShift().y
    };

    let ant = simulation.addNewAnt(antType, antPos);

    let pos = {
      x: antPos.x * simulation.getSizeRect().width,
      y: antPos.y * simulation.getSizeRect().height
    };

    simulation.ctx.fillStyle = rgbToHex(ant.getColor());
    simulation.ctx.fillRect(pos.x, pos.y, simulation.getSizeRect().width, simulation.getSizeRect().height);
  }
}

function changeAntType(type)
{
  antType = type;

  if(antType == 4)
  {
    document.getElementById("content_customAnt_second").style.display = "block";
  }
  else
  {
    document.getElementById("content_customAnt_second").style.display = "none";
  }
}

function changeMouseMode(mode)
{
  mouseMode = mode;
}

function changeStep()
{
  let addedStep = document.getElementById("step").value;

  simulation.moveAnts(addedStep);
}

function changeStepPerTick()
{
  stepPerTick = document.getElementById("stepPerTick").value;
}

function changeCanvasMouseAction(mode)
{
  canvasMouseAction = mode;
}

/**
 * Move the simulation in the chosen direction.
 */
function moveSimulation(direction)
{
  let moveSimulationStep = document.getElementById("moveSimulationStep").value;
  let x = 0;
  let y = 0;

  switch (direction)
  {
    case 'u':
      x = 0;
      y = -1;
      break;

    case 'd':
      x = 0;
      y = 1;
      break;

    case 'l':
      x = -1;
      y = 0;
      break;

    case 'r':
      x = 1;
      y = 0;
      break;

    default:
      break;
  }

  simulation.moveSimulation(x, y, moveSimulationStep);

  document.getElementById("simulationPosX").value = simulation.getShift().x;
  document.getElementById("simulationPosY").value = simulation.getShift().y;
}

function changeSimulationPos()
{
  let x = document.getElementById("simulationPosX").value;
  let y = document.getElementById("simulationPosY").value;

  simulation.changeSimulationPos(x, y);
}

function changeZoom()
{
  if (simulation != null)
  {
    let rectNb = parseInt(document.getElementById("zoomSlider").value);
    let rectSizeX = Math.floor(simulation.getCanvas().width / rectNb);
    let rectSizeY = Math.floor(simulation.getCanvas().height / rectNb);

    let canvasRectNbX = simulation.getCanvas().width / rectSizeX;
    let canvasRectNbY = simulation.getCanvas().height / rectSizeY;

    document.getElementById("rectNumber").innerHTML = canvasRectNbX;

    simulation.changeZoom(canvasRectNbX, canvasRectNbY);
  }
}

function changeAntOrientation(type)
{
  simulation.setAntStartingDirection(type - 1);
}

function changeLifeTime()
{
  if (simulation != null)
  {
    let antsLifeTime = document.getElementById("lifeTimeSlider").value;
    document.getElementById("lifeTime").innerHTML = antsLifeTime;

    simulation.setAntsLifeTime(antsLifeTime);
  }
}

function changeMapSize()
{
  let mapSizeX = document.getElementById("changeMapSizeX").value;
  let mapSizeY = document.getElementById("changeMapSizeY").value;

  resetAnts();

  simulation.getMap().setWidth(mapSizeX);
  simulation.getMap().setHeight(mapSizeY);
  document.getElementById("mapSizeX").value = simulation.getMap().getWidth();
  document.getElementById("mapSizeY").value = simulation.getMap().getHeight();

  simulation.getMap().initMap();
}

/**
 * Display or not the options, the user can choose this
 */
function changeOpenCloseOptions()
{
  isOptionsOpen = !isOptionsOpen;

  if(isOptionsOpen == true)
  {
    document.getElementById("openOptions").style.display = "none";
    document.getElementById("closeOptions").style.display = "inline-block";

    document.getElementById("options").style.display = "inline-block";
  }
  else
  {
    document.getElementById("openOptions").style.display = "inline-block";
    document.getElementById("closeOptions").style.display = "none";

    document.getElementById("options").style.display = "none";
  }
}

/**
 * Display or not the selected option, the user can choose this
 */
function changeOpenCloseOneOption(optionNum)
{
  oneOptionOpen[optionNum]["visible"] = !oneOptionOpen[optionNum]["visible"];

  if(oneOptionOpen[optionNum]["visible"] == true)
  {
    document.getElementById(oneOptionOpen[optionNum]["elementId"]["content"]).style.display = "inline-block";
    document.getElementById(oneOptionOpen[optionNum]["elementId"]["arrow"]).innerHTML = "&#8896;";
  }
  else
  {
    document.getElementById(oneOptionOpen[optionNum]["elementId"]["content"]).style.display = "none";
    document.getElementById(oneOptionOpen[optionNum]["elementId"]["arrow"]).innerHTML = "&#8897;";
  }
}

/**
 * Add one step to the custom ant.
 * This method directly adds HTML.
 */
function addOneCustomAntStep()
{
  customAntNumber++;

  let parent = document.getElementById("customAntSteps");

  let newElement = document.createElement('div');
  newElement.setAttribute('id', "customAntTurnBox" + customAntNumber);

  let randColor = Math.floor((Math.random() * 16777215) + 1).toString(16);

  newElement.innerHTML =
    "<label>" + customAntNumber + ".</label>\
    <label for='customAntTurnLeft" + customAntNumber + "' class='borderCustomAnt'>\
      <input id='customAntTurnLeft" + customAntNumber + "' type='radio' name='customAntTurn" + customAntNumber +
        "' value='customAntTurnLeft" + customAntNumber + "' checked> &larr;\
    </label>\
    <label for='customAntTurnRight" + customAntNumber + "' class='borderCustomAnt'>\
      <input id='customAntTurnRight" + customAntNumber + "' type='radio' name='customAntTurn" + customAntNumber +
        "' value='customAntTurnRight" + customAntNumber + "'> &rarr;\
    </label>\
    <input id='customAntColor" + customAntNumber + "' type='color' name='color' value='#" + randColor + "'>\
    ";

  parent.appendChild(newElement);
}

function deleteCustomAntStep()
{
  if(customAntNumber > 2)
  {
    document.getElementById("customAntTurnBox" + customAntNumber).remove();

    customAntNumber--;
  }
}

function enableInfiniteLifeTime()
{
  simulation.enableInfiniteLifeTime(document.getElementById("infiniteLifeTime").checked);
}
