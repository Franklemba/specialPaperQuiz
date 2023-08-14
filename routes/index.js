const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Question = require('../models/questionSchema'); // Import your question schema
// const Quotation = require('../models/quotationSchema');
// const jsonFilePath = path.join(__dirname, '../json', 'quiz.json');

router.get("/", async (req, res) => {
  
    try{
      res.render("home/index",{
      });
    }catch(err){
      res.send("error hosting web")
      console.log(err)
    }
    
  });

  router.get("/about", async(req,res)=>{
    res.render("home/about",{

    })
  })
 //////////////////////////////////   /quiz link BEGIN 
 router.get("/sp1_quiz", async (req, res) => {

  try {
    const question = await Question.find({specialPaper:"sp1"});

    // Shuffle the array randomly
    const shuffledPaperOne = question.sort(() => Math.random() - 0.5);
    // question.sort

    // Select the first 20 elements
    const selectedData = shuffledPaperOne.slice(0, 15);

    res.render("home/quiz", {
      papers: selectedData
    });
            
    
  } catch (error) {
    console.log("Error parsing JSON:", error);
    res.status(500).send("Error parsing JSON");
  }
});

router.get("/sp2_quiz", async (req,res)=>{
  try {
  const question = await Question.find({specialPaper:"sp2"});

  const shuffledPaperOne = question.sort(() => Math.random() - 0.5);
    // question.sort

    // Select the first 20 elements
    const selectedData = shuffledPaperOne.slice(0, 15);

  res.render("home/quiz", {
    papers: selectedData
  });
} catch (error) {
  console.log("Error parsing JSON:", error);
  res.status(500).send("Error parsing JSON");
}
})
///////////////////////////////////////////   /quiz link END 
///////////////////////////////////////////   /results link BEGIN 

router.post("/results/:specialpaper", async (req,res)=>{

    const userAnswers = req.body;
    const specialpaper = req.params.specialpaper;
    
  
      try {
        // const papers = JSON.parse(data);
        
        const result = [];
        const Results = {};
        let trueCount = 0;
        let count = 0;

        if(specialpaper === "sp1"){
          const papers = await Question.find({specialPaper:"sp1"});
          papers.forEach(question => {
            const userAnswerKey = `ans${question._id}`;
            
            if (userAnswerKey in userAnswers) {
              const correctAnswer = question.ans;
              const userAnswer = userAnswers[userAnswerKey];
              
              Results[question._id] = { 
                question: question.question,
                correctAnswer: question.ans,
                userAnswer: userAnswer,
                isCorrect: correctAnswer === userAnswer
              };

              result.push({
                specialPaper: question.specialPaper,
                question: question.question,
                correctAnswer: correctAnswer,
                userAnswer: userAnswer,
                isCorrect: correctAnswer === userAnswer
            });

            }
          }); 
        }else if(specialpaper === "sp2"){
          const papers = await Question.find({specialPaper:"sp2"});
          papers.forEach(question => {
            const userAnswerKey = `ans${question._id}`;
            
            if (userAnswerKey in userAnswers) {
              const correctAnswer = question.ans;
              const userAnswer = userAnswers[userAnswerKey];
              
              Results[question._id] = { 
                correctAnswer: question.ans,
                userAnswer: userAnswer,
                isCorrect: correctAnswer === userAnswer
              };

              result.push({
                specialPaper: question.specialPaper,
                question: question.question,
                correctAnswer: correctAnswer,
                userAnswer: userAnswer,
                isCorrect: correctAnswer === userAnswer
            });

            }
          }); 
        }

        


          for (const questionId in Results) {
            if (Results.hasOwnProperty(questionId)) {
              if (Results[questionId].isCorrect === true) {
                trueCount++;
              }
            }
            count++;
          }

          console.log(`Number of correct answers: ${trueCount}`);

          res.render("home/results",{
              results: result,
              total: count,
              time: req.body.timerValue,
              grade: trueCount
          });
        console.log(result);
        
      } catch (error) {
        console.log("Error parsing JSON:", error);
        res.status(500).send("Error parsing JSON");
      }
    });
// res.send(answers);
// });


  module.exports = router;