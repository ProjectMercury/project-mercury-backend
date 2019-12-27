/* eslint-disable no-await-in-loop */
const { db } = require("./admin");

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    // eslint-disable-next-line callback-return
    await callback(array[index], index, array);
  }
};

const getFormName = async formId => {
  try {
    const form = await db.doc(`forms/${formId}`).get();
    return form.data().title;
  } catch (error) {
    console.log(error.message);
  }
};
