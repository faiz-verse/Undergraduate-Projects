const mongoose = require('mongoose');
const Subjects = require('./Subjects');

const chapterSchema = new mongoose.Schema({
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: Subjects, required: true },
    chapterName: { type: String, required: true },
    description: String,
});

const Chapters = mongoose.model('Chapters', chapterSchema);

module.exports = Chapters;