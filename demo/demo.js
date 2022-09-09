const sliderInteger = require("../src");

const options = {
  min: 0,
  max: 100,
  label: "Enter a range",
};

const component = sliderInteger(options);

document.body.append(component);
