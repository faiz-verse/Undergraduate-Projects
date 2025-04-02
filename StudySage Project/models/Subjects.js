const mongoose = require('mongoose');
const Semesters = require('./Semesters');

const subjectSchema = new mongoose.Schema({
    semesterId: { type: mongoose.Schema.Types.ObjectId, ref: Semesters, required: true },
    subjectName: { type: String, required: true },
    description: String,
  });  

const Subjects = mongoose.model('Subjects', subjectSchema);

module.exports = Subjects;