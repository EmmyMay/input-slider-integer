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
