const { db } = require("../utils/admin");
const { getFormName, asyncForEach } = require("../utils/notification-helpers");

//Create a new notification - this happens whenever a respondent submits a response
exports.createNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await db.doc(`forms/${id}`).get();

    if (!form.exists) return res.status(404).json({ error: "Form not found" });

    const userId = form.data().userId;
    const notification = {
      isRead: false,
      created: new Date().toISOString(),
      formId: id,
      userId: userId
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
    const notifications_data = [];
    const forms_data = [];

    const notifications = await db
      .collection("notifications")
      .where("userId", "==", req.user.id)
      .get();

    const forms = await db
      .collection("forms")
      .where("userId", "==", req.user.id)
      .get();

    forms.forEach(doc => {
      forms_data.push({
        formId: doc.id,
        inputs: doc.data().inputs,
        options: doc.data().options,
        created: doc.data().created,
        title: doc.data().title
      });
    });

    const compressedFormsObject = forms_data.reduce(
      (obj, cur) => ({ ...obj, [cur.formId]: cur.title }),
      {}
    );

    notifications.forEach(async notification => {
      notifications_data.push({
        id: notification.id,
        isRead: notification.data().isRead,
        created: notification.data().created,
        formId: notification.data().formId,
        form_title: compressedFormsObject[notification.data().formId]
      });
    });

    return res.status(200).json(notifications_data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Oops, something went wrong, buddy: ${error.message}` });
  }
};

//Considered updating the isRead field to true as oppoosed to deleting the notification when a user clicks on it,
//but what's the point if the user is never going to go back to an unread state and why not just free up a slot anyway

exports.deleteNotification = (req, res) => {
  db.collection("notifications")
    .where("formId", "==", req.params.id)
    .get()
    .then(querySnapshot => {
      const batch = db.batch();

      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    })
    .then(() => {
      return res.status(201).json({ message: "deleted" });
    })
    .catch(error => res.status(500).json({ error: error.message }));
};

exports.getNotificationCount = async (req, res) => {
  const groupNotificationsByForm = array => {
    const grouped = [];
    new Map(
      [...new Set(array)].map(x => [
        x.form_title,
        array.filter(y => y.form_title === x.form_title).length
      ])
    ).forEach((value, key) => {
      grouped.push({
        form_title: key,
        notification_count: value,
        formId: array.find(form => form.form_title === key).formId
      });
    });
    return grouped;
  };

  try {
    const notifications_data = [];
    const forms_data = [];

    const notifications = await db
      .collection("notifications")
      .where("userId", "==", req.user.id)
      .get();

    const forms = await db
      .collection("forms")
      .where("userId", "==", req.user.id)
      .get();

    forms.forEach(doc => {
      forms_data.push({
        formId: doc.id,
        inputs: doc.data().inputs,
        options: doc.data().options,
        created: doc.data().created,
        title: doc.data().title
      });
    });

    const compressedFormsObject = forms_data.reduce(
      (obj, cur) => ({ ...obj, [cur.formId]: cur.title }),
      {}
    );

    notifications.forEach(async notification => {
      notifications_data.push({
        id: notification.id,
        isRead: notification.data().isRead,
        created: notification.data().created,
        formId: notification.data().formId,
        form_title: compressedFormsObject[notification.data().formId]
      });
    });

    const grouped_data = groupNotificationsByForm(notifications_data);

    return res.status(200).json(grouped_data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Oops, something went wrong, buddy: ${error.message}` });
  }
};
