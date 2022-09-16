(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const sliderInteger = require("../src");

const options = {
  min: 0,
  max: 100,
  label: "Enter a range",
};

const component = sliderInteger(options);

document.body.append(component);

},{"../src":2}],2:[function(require,module,exports){
const slider = require("input-slider");
const integer = require("wizard-input-integer");
const sliderTheme = require("input-slider/src/theme").light();
const integerTheme = require("wizard-input-integer/src/theme").light();

function sliderInteger(opts) {
  // unique state
  const state = {};

  // use Deps
  const elements = [
    slider({ theme: sliderTheme, ...opts }, protocol), // slider 1
    integer({ theme: integerTheme, ...opts }, protocol), // integer 1
    slider({ theme: sliderTheme, ...opts }, protocol), // slider 2
    integer({ theme: integerTheme, ...opts }, protocol), // integer 2
  ];

  const el = document.createElement("div");
  const shadow = el.attachShadow({ mode: "closed" });

  shadow.append(...elements);

  // component communication
  function protocol({ from }, notify) {
    state[from] = { value: 0, notify };

    return function (msg) {
      const { from, type, data } = msg;

      // update component value on state obj
      state[from].value = data;

      if (type === "update") {
        Object.keys(state).forEach((item) => {
          if (item !== from) {
            state[item].notify({ type, data });
            state[item].value = state[from].value;
          }
        });
        console.log(state);
      }
    };
  }

  return el;
}

module.exports = sliderInteger;

},{"input-slider":3,"input-slider/src/theme":5,"wizard-input-integer":7,"wizard-input-integer/src/theme":9}],3:[function(require,module,exports){
let id = 0;

function rangeSlider(opts, protocol, on = {}) {
  // event name
  const componentName = `slider-${id++}`;
  const { theme, min = 0, max = 100 } = opts;

  // creating dom elements
  const el = document.createElement("div");
  const shadow = el.attachShadow({ mode: "closed" });

  shadow.innerHTML = `
  <input/>
  <div class="bar">
  <div class="ruler"></div>
  <div class="fill"></div>
  </div>
`;
  const [input, bar] = shadow.children;
  const [, fill] = bar.children;

  // Component communication
  const notify = protocol({ from: componentName }, listen);
  function listen(message) {
    const { type, data } = message;
    if (type === "update") {
      input.value = data;
      modifyElement(fill, data, max, shadow);
    }
  }

  // set input attributes
  input.type = "range";
  input.min = min;
  input.max = max;
  input.value = min;

  // handling events
  input.oninput = (e) => {
    const sliderValue = Number(e.target.value);
    modifyElement(fill, sliderValue, max, shadow);
    notify({ from: componentName, type: "update", data: sliderValue });
  };
  Object.keys(on).map((K) => {
    return (input[`on${K}`] = on[K]);
  });

  // component styling
  styleComponent(theme, shadow);

  return el;
}

const styleComponent = (theme, shadow) => {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(theme);
  shadow.adoptedStyleSheets = [styleSheet];
};

const modifyElement = (el, sliderValue, max = 100, shadow) => {
  const elementWidth = (sliderValue / max) * 100;
  el.style.width = elementWidth + "%";
  shadow.host.style.setProperty("--range-color", "hsl(271, 80%, 65%)");
  shadow.host.style.setProperty("--thumb-color", "hsl(271, 80%, 65%)");
  if (elementWidth > 50) {
    shadow.host.style.setProperty(
      "--range-color",
      "linear-gradient(90deg, rgba(167,92,237,1) 50%, rgba(65,237,183,1) 80%)"
    );
    shadow.host.style.setProperty("--thumb-color", "hsl(161, 83%, 59%)");
  }
  if (elementWidth > 80) {
    shadow.host.style.setProperty(
      "--range-color",
      "linear-gradient(90deg, rgba(167,92,237,1) 31%, rgba(65,237,183,1) 52%, rgba(65,236,237,1) 80%)"
    );
    shadow.host.style.setProperty("--thumb-color", "hsl(180, 83%, 59%)");
  }
};

module.exports = rangeSlider;

},{}],4:[function(require,module,exports){
function theme() {
  return `
 
  `;
}

module.exports = theme;

},{}],5:[function(require,module,exports){
const light = require("./light.js");
const dark = require("./dark.js");

module.exports = {
  light,
  dark,
};

},{"./dark.js":4,"./light.js":6}],6:[function(require,module,exports){
function theme() {
  return `
  :host {
    width: 100%;
    height: 1rem;
    position: relative;
    --transparent: hsla(0, 0%, 0%, 0);
    --range-color: hsl(271, 80%, 65%);
    --thumb-color: hsl(271, 80%, 65%);
  }


input {
  position: absolute;
  top: -0.3rem;
  left: 0;
  z-index: 2;
  width: 100%;
  z-index: 2;
  -webkit-appearance: none;
  background-color: var(--transparent);
}

.fill {
  position: absolute;
  height: 12px;
  background-color: grey;
}

  .bar {
  width: 100%;
  height: 12px;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  border-radius: .5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

input:focus + .bar .fill,
input:focus-within + .bar .fill,
input:active + .bar .fill
 {
  background: var(--range-color);
}

input::-webkit-slider-thumb{
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 50%;
  border: 1px solid rgba(128, 128, 128, 0.137);
  cursor: pointer;
  -webkit-box-shadow: -2px 3px 12px 0px rgba(145,145,145,0.82);
  -moz-box-shadow: -2px 3px 12px 0px rgba(145,145,145,0.82);
  box-shadow: -2px 3px 12px 0px rgba(145,145,145,0.82);
  transition: background-color .3s, box-shadow .15s linear;
  z-index: 3;
  
}
input::-webkit-slider-thumb:hover{
 -webkit-box-shadow: 0px 0px 0px 7px var(--thumb-color);
-moz-box-shadow: 0px 0px 0px 7px var(--thumb-color);
box-shadow: 0px 0px 0px 7px var(--thumb-color);
}
input::-moz-range-thumb{
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid rgba(128, 128, 128, 0.137);
  cursor: pointer;
  -webkit-box-shadow: -2px 3px 12px 0px rgba(145,145,145,0.82);
  -moz-box-shadow: -2px 3px 12px 0px rgba(145,145,145,0.82);
  box-shadow: -2px 3px 12px 0px rgba(145,145,145,0.82);
  transition: background-color .3s, box-shadow .15s linear;
  
}
input::-moz-range-thumb:hover{
-webkit-box-shadow: 0px 0px 0px 7px var(--thumb-color);
-moz-box-shadow: 0px 0px 0px 7px var(--thumb-color);
box-shadow: 0px 0px 0px 7px var(--thumb-color);
}
  `;
}

module.exports = theme;

},{}],7:[function(require,module,exports){
let id = 0;

function inputInteger(options, protocol, on = {}) {
  // component name
  const componentName = `integer-${id++}`;

  const {
    min = 0,
    max = 1000,
    theme,
    labelValue = "Input Integer",
    inputId = "Input-Integer",
    step = "0",
  } = options;

  const el = document.createElement("div");
  const shadow = el.attachShadow({ mode: "closed" });

  shadow.innerHTML = `
  <div>
    <label for="${inputId}">${labelValue}</label>
    <input min="${min}" max="${max}" step="${step}" type="number">
  </div>
`;
  const [, input] = shadow.firstElementChild.children;

  // event handling
  input.onkeyup = (e) => handle_onkeyup(e, input);
  input.onmouseleave = (e) => clearInput(e, input);
  input.onblur = (e) => clearInput(e, input);

  // capturing events
  Object.keys(on).map((K) => {
    return (input[`on${K}`] = on[K]);
  });

  // Component communication
  const notify = protocol({ from: componentName }, listen);
  function listen(message) {
    const { type, data } = message;
    if (type === "update") {
      input.value = data;
    }
  }

  function clearInput(e, input) {
    let value = Number(e.target.value);
    if (value < input.min) input.value = "";
  }
  function handle_onkeyup(e, input) {
    let value = Number(e.target.value);
    if (value > input.max) input.value = input.max;
    if (value < input.min) input.value = 0;
    if (value < input.max)
      notify({ from: componentName, type: "update", data: value });
  }

  // component styling
  styleComponent(theme, shadow);

  return el;
}
const styleComponent = (theme, shadow) => {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(theme);
  shadow.adoptedStyleSheets = [styleSheet];
};
module.exports = inputInteger;

},{}],8:[function(require,module,exports){
function theme() {
  return `
:host input {
  padding: 1rem;
  background-color: hsla(0, 0%, 4%, 0.205);
  border: none;
  width: 15rem;
}

:host div {
  position: relative;
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

:host div::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-bottom: hsl(207, 94%, 53%) 2px solid;
  top: 0;
  left: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 200ms ease-in;
  z-index: -1;
}
:host input:focus {
  outline: none;

}

:host div:focus-within::after {
  transform: scaleX(1);
  transform-origin: left;
}
:host input::-webkit-outer-spin-button,
:host input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
:host input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}

`;
}

module.exports = theme;

},{}],9:[function(require,module,exports){
const light = require("./light");
const dark = require("./dark");

module.exports = {
  light,
  dark,
};

},{"./dark":8,"./light":10}],10:[function(require,module,exports){
function theme(containerClass) {
  return `
:host input {
  padding: 1rem;
  background-color: hsla(35, 88%, 94%, 0.397);
  border: none;
  width: 15rem;
}

:host div {
  position: relative;
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

:host div::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-bottom: hsl(35, 36%, 49%) 2px solid;
  top: 0;
  left: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 200ms ease-in;
  z-index: -1;
}
:host input:focus {
  outline: none;
  box-shadow: -4px 7px 20px -5px rgba(0,0,0,0.29);
-webkit-box-shadow: -4px 7px 20px -5px rgba(0,0,0,0.29);
-moz-box-shadow: -4px 7px 20px -5px rgba(0,0,0,0.29);
}

:host div:focus-within::after {
  transform: scaleX(1);
  transform-origin: left;
}
:host input::-webkit-outer-spin-button,
:host input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

:host input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}

`;
}

module.exports = theme;

},{}]},{},[1]);
