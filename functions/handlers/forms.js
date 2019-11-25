const { db } = require('../utils/admin');

exports.postForm = async (req, res) => {
  const { inputs, options } = req.body;
  if (!inputs) {
    return res.status(400).json({ error: 'No questions in form' });
  }

  const newForm = {
    userId: req.user.id,
    inputs,
    created: new Date().toISOString()
  };

  if (options) newForm.options = options;

  try {
    const inputResult = await db.collection('forms').add(newForm);
    const output = newForm;

    output.formId = inputResult.id;
    return res.status(201).json(output);
  } catch (error) {
    res.status(500).json({ error: 'something went wrong: ' + error.message });
  }
};

exports.getUserForms = async (req, res) => {
  try {
    const response = [];
    console.log(req.user.id);
    const forms = await db
      .collection('forms')
      //   .orderBy('createdAt', 'desc')
      .where('userId', '==', req.user.id)
      .get();

    forms.forEach(doc => {
      response.push({
        formId: doc.id,
        inputs: doc.data().inputs,
        options: doc.data().options,
        created: doc.data().created
      });
    });

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'something went wrong: ' + error.message });
  }
};

exports.deleteUserForm = async (req, res) => {
  try {
    const formDocument = db.doc(`/forms/${req.params.id}`);

    const form = await formDocument.get();

    if (!form.exists) return res.status(404).json({ error: 'form not found' });
    if (form.data().userId !== req.user.id)
      return res.status(403).json({ error: 'unauthorized' });

    await formDocument.delete();
    return res.status(200).json({ message: 'form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'something went wrong: ' + error.message });
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const response = [];
    const forms = await db.collection('forms').get();

    forms.forEach(doc => {
      response.push({
        formId: doc.id,
        inputs: doc.data().inputs,
        options: doc.data().options,
        userId: doc.data().userId,
        created: doc.data().created
      });
    });

    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'something went wrong: ' + error.message });
  }
};

exports.getFormById = async (req, res) => {
  try {
    const formDocument = db.doc(`/forms/${req.params.id}`);

    const form = await formDocument.get();
    if (!form.exists) return res.status(404).json({ error: 'form not found' });

    const response = {};
    response.formId = form.id;
    response.inputs = form.data().inputs;
    response.options = form.data().options;
    response.userId = form.data().userId;
    response.created = form.data().created;

    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'something went wrong: ' + error.message });
  }
};

exports.addResponse = async (req, res) => {
  try {
    const form = await db.doc(`forms/${req.params.id}`).get();

    if (!form.exists) return res.status(404).json({ error: 'form not found' });

    const newResponse = { formId: req.params.id, answer: req.body.responses };
    const output = await db.collection('results').add(newResponse);
    newResponse.id = output.id;
    return res.status(201).json(newResponse);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'something went wrong: ' + error.message });
  }
};

exports.getFormResponses = async (req, res) => {
  try {
    const output = [];
    const responses = await db
      .collection('results')
      .where('formId', '==', req.params.id)
      .get();

    responses.forEach(doc => {
      output.push({
        responseId: doc.id,
        formId: doc.data().formId,
        answer: doc.data().answer
      });
    });

    return res.status(200).json(output);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'something went wrong: ' + error.message });
  }
};
