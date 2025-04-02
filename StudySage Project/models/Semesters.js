const mongoose = require('mongoose');
const Courses = require('./Courses');

const semesterSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: Courses, required: true },
    semesterName: { type: String, required: true },
    description: String,
  });  

const Semesters = mongoose.model('Semesters', semesterSchema);

module.exports = Semesters;