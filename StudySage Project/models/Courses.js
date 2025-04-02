const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    courseName: { type: String, required: true },
    description: String,
});

const Courses = mongoose.model('Courses', courseSchema);

module.exports = Courses;