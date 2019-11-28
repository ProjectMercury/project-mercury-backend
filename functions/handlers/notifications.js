const firebase = require("firebase");
const { db } = require("../utils/admin");
const getFormName = require("../utils/notification-helpers");

exports.postForm = async (req, res) => {
  const { inputs, options } = req.body;
  if (!inputs) {
    return res.status(400).json({ error: "No questions in form" });
  }

  const newForm = {
    userId: req.user.id,
    inputs,
    created: new Date().toISOString()
  };

  if (options) newForm.options = options;

  try {
    const inputResult = await db.collection("forms").add(newForm);
    const output = newForm;

    output.formId = inputResult.id;
    return res.status(201).json(output);
  } catch (error) {
    res.status(500).json({ error: "something went wrong: " + error.message });
  }
};

exports.createNotification = async (req, res) => {
  const { notification } = req.body;
  try {
    const result = await db.collection("notifications").add(notification);

    //id, formId, isRead, createdAt, creatorId
  } catch (error) {
    res
      .status(500)
      .json({ error: `Oops, something went wrong, buddy: ${error.message}` });
  }
};



exports.fetchUserNotifications = async (req, res) => {
  try {
    const data = [];
    const userNotifications = await db
      .collection("notifications")
      .orderBy("created", "desc")
      .where("userId", "==", req.user.id)
      .get();

    userNotifications.forEach(async notification => {
      data.push({
        id: notification.id,
        isRead: notification.data().isRead,
        created: notification.data().created,
        form_name: await getFormName(notification.data().formId)
      });
    });
    return res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Oops, something went wrong, buddy: ${error.message}` });
  }
};

exports.updateNotificationsAsRead = async (req, res) => {
  
}