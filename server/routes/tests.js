const auth = require('../middleware/auth');
const { Test } = require('../models/test');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  let { task } = req.query;
  task = parseInt(task);
  const tasks = await Test.find({ taskNumber: task });
  res.send(tasks);
});

router.post('/', async (req, res) => {
  const test = new Test({
    taskNumber: req.body.taskNumber,
    question: req.body.question,
  });
  try {
    let response = await test.save();
    res.send(response);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
