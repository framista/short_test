// const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { Student } = require('../models/student');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  let student = await Student.findOne({ index: req.body.index });
  if (!student) return res.status(400).send('Invalid index or password.');
  const validPassword = await bcrypt.compare(
    req.body.password,
    student.password
  );
  if (!validPassword) return res.status(400).send('Invalid index or password.');
  const token = student.generateAuthToken();
  res.send(token);
});

module.exports = router;
