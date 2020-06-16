const auth = require('../middleware/auth');
const { Student } = require('../models/student');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

router.get('/me', auth, async (req, res) => {
  const student = await Student.findById(req.user._id).select('-password');
  res.send(student);
});

router.get('/student', auth, async (req, res) => {
  const student = await Student.findById(req.user._id).select('-password');
  res.send(student);
});

router.get('/', async (req, res) => {
  const students = await Student.find().sort({ lastname: 1, firstname: 1 });
  res.send(
    students.map((student) =>
      _.pick(student, ['_id', 'firstname', 'lastname', 'index'])
    )
  );
});

router.post('/', async (req, res) => {
  let student = await Student.findOne({ index: req.body.index });
  if (student) return res.status(400).send('Student already registered.');
  student = new Student(
    _.pick(req.body, ['firstname', 'lastname', 'password', 'index'])
  );
  const salt = await bcrypt.genSalt(10);
  student.password = await bcrypt.hash(student.password, salt);
  await student.save();
  const token = student.generateAuthToken();
  res
    .header('x-auth-token', token)
    .send(_.pick(student, ['_id', 'firstname', 'lastname', 'index']));
});

router.put('/tests', auth, async (req, res) => {
  const { test, taskNumber } = req.body;
  const studentSelected = await Student.findById(req.user._id).select(
    '-password'
  );
  const { tests, tasks } = studentSelected;
  tests[taskNumber - 1].tasks = test;
  tasks[taskNumber - 1] = true;

  const student = await Student.findByIdAndUpdate(req.user._id, {
    tests: tests,
    tasks,
  });
  if (!student) return res.status(404).send('The student was not found');

  let transporter = nodemailer.createTransport({
    host: 'mail.pwr.wroc.pl',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EDU_USER,
      pass: process.env.EDU_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: '"mgr Paweł Jabłoński" <pawel.jablonski@pwr.edu.pl>',
    to: `${student.index}@student.pwr.edu.pl`,
    subject: `Techniki wytwarzania - obróbka plastyczna - Ćwiczenie ${taskNumber}`,
    text: `Dziękuje za wykonanie zadań z kartkówki. Twoje odpowiedzi to:
      
    ${test[0].question}
    ${test[0].answer}
    
    ${test[1].question}
    ${test[1].answer}

  Pozdrawiam,
  Paweł Jabłoński`,
  });
  console.log(`Message sent: ${info.messageId} ${student.index}`);
  res.send(student);
});

module.exports = router;
