const slider = require("input-slider");
const integer = require("wizard-input-integer");
const sliderTheme = require("input-slider/src/theme").light();
const integerTheme = require("wizard-input-integer/src/theme").light();

function sliderInteger(opts) {
  // unique state
  const state = {};

  // use Deps
  const sliderComponent = slider({ theme: sliderTheme, ...opts }, protocol);
  const integerComponent = integer({ theme: integerTheme, ...opts }, protocol);

  const el = createElement();
  const shadow = el.attachShadow({ mode: "closed" });

  appendElement(shadow, sliderComponent, integerComponent);

  // component communication
  function protocol({ from }, notify) {
    state[from] = { value: 0, notify };

    return function (msg) {
      const { from, type, data } = msg;

      // update component value on state obj
      state[from].value = data;

      let notify;
      if (type === "update") {
        notify = state["integer-0"].notify;

        // if we increment input-integer run the function that updates slider
        if (from === "integer-0") {
          notify = state["integer-0"].notify;
        }
        notify({ type, data });
        if (from === "integer-0") {
          state["slider-0"].value = state[from].value;
        } else if (from === "slider-0") {
          state["integer-0"].value = state[from].value;
        }
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
