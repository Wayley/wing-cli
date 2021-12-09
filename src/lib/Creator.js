function Creator(options) {
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) {
      this[key] = options[key];
    }
  }
}
Creator.prototype.create = async function () {};
module.exports = Creator;
