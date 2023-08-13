const express = require('express');
const router = express.Router();
const multer = require('multer');
const Question = require('../models/questionSchema'); // Import your question schema
const path = require('path'); // Import the path module

const imageMimeType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads/sp1'); // Specify the destination folder for uploads
    },
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeType.includes(file.mimetype));
    }
});

// Render the upload form
router.get('/', (req, res) => {
    res.render('admin/upload');
});

// Handle the form submission and save the question
router.post('/', upload.single('question'), async (req, res) => {
    try {
        const file = req.file;
        const question = new Question({
            question: file.filename, // Save the generated filename
            ans: req.body.ans,
            specialPaper: req.body.specialPaper
        });
        await question.save();
        console.log('Question uploaded successfully');
        res.render('admin/upload');
    } catch (error) {
        console.error('Error uploading question:', error);
        res.status(500).send('Unable to save question. Please check the fields and file.');
    }
});

module.exports = router;
