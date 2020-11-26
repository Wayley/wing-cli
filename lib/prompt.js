const nameInput = {
  type: 'input',
  message: 'Please enter your application name:',
  name: 'name',
  validate(value) {
    return value !== '' || 'Please enter the name';
  },
};
const versionInput = {
  type: 'input',
  message: 'Please enter your application version:',
  name: 'version',
  default: '1.0.0',
};
const descriptionInput = {
  type: 'input',
  message: 'Please enter your application description:',
  name: 'description',
};
const keywordsInput = {
  type: 'input',
  message: 'Please enter your application keywords:',
  name: 'keywords',
};
const authorInput = {
  type: 'input',
  message: 'Please enter the author of your application:',
  name: 'author',
};
const okConfirm = {
  type: 'confirm',
  message: 'Is this OK?',
  name: 'okConfirm',
  default: true,
};
module.exports = {
  nameInput,
  versionInput,
  descriptionInput,
  keywordsInput,
  authorInput,
  okConfirm,
};
