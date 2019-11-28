const { db } = require("../utils/admin");
const getFormName = require("../utils/notification-helpers");

//Create a new notification - this happens whenever a respondent submits a response
exports.createNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await db.doc(`forms/${id}`).get();

    if (!form.exists) return res.status(404).json({ error: "Form not found" });

    const { userId } = form;
    
    const notification = {
      isRead: false,
      created: firebase.firestore.Timestamp.fromDate(new Date()),
      formId: id,
      userId
    };

    const result = await db.collection("notifications").add(notification);

    notification.id = result.id;

    return res.status(201).json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Oops, something went wrong, buddy: ${error.message}` });
  }
};

//the getFormName function simply fetches the name of the form that the notification belongs to so that it can be displayed on the client side
//and firestore has no native marge functionality for collections
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

//I considered updating the isRead field to true as oppoosed to deleting the notification when a user clicks on it,
//but what's the point if the user is never going to go back to an unread state and why not just free up a slot anyway

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await db.doc(`/notifications/${req.params.id}`).get();

    if (!notification.exists)
      return res.status(404).json({ error: "notification not found" });

    if (notification.data().userId !== req.user.id)
      return res.status(403).json({ error: "unauthorized" });

    await db.doc(`/notifications/${req.params.id}`).delete();

    return res.status(200).json({ message: "notification deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Oops, something went wrong, buddy: ${error.message}` });
  }
};
