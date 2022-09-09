const slider = require("input-slider");
const integer = require("@emmyb/input-integer");
const sliderTheme = require("input-slider/src/theme").light();
const integerTheme = require("@emmyb/input-integer/src/theme").light();

function sliderInteger(opts) {
  // use Deps
  const sliderComponent = slider({ theme: sliderTheme, ...opts }, listen);
  const integerComponent = integer({ theme: integerTheme, ...opts }, listen);

  const el = createElement();
  const shadow = el.attachShadow({ mode: "closed" });
  const display = createElement();

  appendElement(shadow, sliderComponent, integerComponent, display);

  return el;
  // component comm
  function listen(msg) {
    const { type, body } = msg;
    if (type === "update") display.innerText = body;
    console.log(type);
  }
}

const createElement = ({ el = "div", className } = {}) => {
  const ele = document.createElement(el);
  if (className) ele.classList.add(className);

  return ele;
};

const appendElement = (target, ...children) => {
  target.append(...children);
};

module.exports = sliderInteger;
