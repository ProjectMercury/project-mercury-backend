const { db } = require("./admin");

const getFormName = async formId => {
  try {
    const formName = await db
      .collection("forms")
      .where("id", "=", formId)
      .select("title")
      .get();
    return { formName };
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = getFormName