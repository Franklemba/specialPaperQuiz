const express = require('express');
const router = express.Router();
const fs = require('fs').promises; // Import the fs.promises module
const multer = require('multer');
const Question = require('../models/questionSchema'); // Import your question schema
const path = require('path'); // Import the path module
const user = require('../models/adminSchema');


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

router.get('/all', async (req,res)=>{


    const question = await Question.find();

    try{
        res.render('admin/allquestions',{
                    questions: question
                })
    }
    catch (error) {
        console.error('Error viewing all questions:', error);
        res.status(500).send('error displaying page, Please try again.');
    }


})

router.post('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Find the question in the database by ID
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).send('Question not found');
        }

        // Delete the uploaded picture from its path destination
        const imagePath = `public/uploads/sp1/${question.question}`;
        await fs.unlink(imagePath);

        // Delete the question record from the database
        // await question.remove();

        await question.deleteOne({    ///deletes selected item
            _id:`${id}`      
        })

        console.log('Question deleted successfully');
        res.send('Question deleted successfully');
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).send('Unable to delete question. Please try again.');
    }
});




async function registerUser(userName, password) {
    try {
      // Generate a salt to use for hashing the password
      const salt = await bcrypt.genSalt(10);
  
      // Hash the password using the salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user document with the hashed password
      const user = new User({
        userName: userName,
        password: hashedPassword
      });
  
      // Save the user document to the database
      await user.save();
  
      console.log(`User ${userName} registered successfully`);
    } catch (error) {
      console.error(`Error registering user: ${error.message}`);
    }
  }

module.exports = router;
