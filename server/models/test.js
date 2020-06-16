const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  taskNumber: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
});

const Test = mongoose.model('Test', testSchema);

exports.Test = Test;
