const { db } = require("./admin");

const getFormName = async formId => {
  try {
    const formName = await db
      .collection("forms")
      .where("id", "==", formId)
      .select("title")
      .get();
    const name =
      typeof formName === "object" &&
      !Array.isArray(formName) &&
      formName !== null
        ? { title }
        : formName;
    return name;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = getFormName;
