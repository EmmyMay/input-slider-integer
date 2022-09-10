const slider = require("input-slider");
const integer = require("wizard-input-integer");
const sliderTheme = require("input-slider/src/theme").light();
const integerTheme = require("wizard-input-integer/src/theme").light();

function sliderInteger(opts) {
  // unique state
  const state = {};

  // component communication

  function protocol({ from }, notify) {
    state[from] = { value: 0, notify };
    return function (msg) {
      const { from, type, data } = msg;
      state[from].value = data;
      if (type === "update") display.innerText = data;
      console.log(state);
    };
  }

  // use Deps
  const sliderComponent = slider({ theme: sliderTheme, ...opts }, protocol);
  const integerComponent = integer({ theme: integerTheme, ...opts }, protocol);

  const el = createElement();
  const shadow = el.attachShadow({ mode: "closed" });
  const display = createElement();

  appendElement(shadow, sliderComponent, integerComponent, display);

  return el;
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
