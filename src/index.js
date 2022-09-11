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
      if (from === "integer-0" && state[from].value !== 0) {
        state["slider-0"].value = state[from].value;
      } else if (from === "slider-0" && state[from].value !== 0) {
        state["integer-0"].value = state[from].value;
      }
      let notify;
      if (type === "update") {
        notify = state["integer-0"].notify;
        if (from === "integer-0") {
          notify = state["slider-0"].notify;
        }
        notify({ type, data });
      }
    };
  }

  // use Deps
  const sliderComponent = slider({ theme: sliderTheme, ...opts }, protocol);
  const integerComponent = integer({ theme: integerTheme, ...opts }, protocol);

  const el = createElement();
  const shadow = el.attachShadow({ mode: "closed" });

  appendElement(shadow, sliderComponent, integerComponent);

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
