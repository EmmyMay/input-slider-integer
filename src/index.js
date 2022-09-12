const slider = require("input-slider");
const integer = require("wizard-input-integer");
const sliderTheme = require("input-slider/src/theme").light();
const integerTheme = require("wizard-input-integer/src/theme").light();
const slider2 = require("input-slider");
const integer2 = require("wizard-input-integer");

function sliderInteger(opts) {
  // unique state
  const state = {};

  // use Deps
  const sliderComponent = slider({ theme: sliderTheme, ...opts }, protocol);
  const integerComponent = integer({ theme: integerTheme, ...opts }, protocol);
  const sliderComponent2 = slider2({ theme: sliderTheme, ...opts }, protocol);
  const integerComponent2 = integer2(
    { theme: integerTheme, ...opts },
    protocol
  );

  const el = createElement();
  const shadow = el.attachShadow({ mode: "closed" });

  appendElement(
    shadow,
    sliderComponent,
    integerComponent,
    sliderComponent2,
    integerComponent2
  );

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

const createElement = ({ el = "div", attr, attrVal } = {}) => {
  const ele = document.createElement(el);
  if (attr && attrVal) ele.setAttribute(attr, attrVal);
  return ele;
};

const appendElement = (target, ...children) => {
  target.append(...children);
};

module.exports = sliderInteger;
