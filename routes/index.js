const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
// const Quotation = require('../models/quotationSchema');
const jsonFilePath = path.join(__dirname, '../json', 'paperOne.json');

router.get("/", async (req, res) => {
  
    try{
      res.render("home/index",{
      });
    }catch(err){
      res.send("error hosting web")
      console.log(err)
    }
    
  });

  router.get("/quiz", (req, res) => {
    
  
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
      if (err) {
        console.log("Error reading JSON file:", err);
        res.status(500).send("Error reading JSON file");
        return;
      }
  
      try {
        const paperOne = JSON.parse(data);
        // console.log(paperOne);
        res.render("home/quiz",{
            papers: paperOne
        });
      } catch (error) {
        console.log("Error parsing JSON:", error);
        res.status(500).send("Error parsing JSON");
      }
    });
  });

  router.post("/results", (req,res)=>{
      const userAnswers = req.body;
      fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
          console.log("Error reading JSON file:", err);
          res.status(500).send("Error reading JSON file");
          return;
        }
    
        try {
          const papers = JSON.parse(data);
          const result = {};
          let trueCount = 0;
          let count = 0;

          papers.paperOne.forEach(question => {
              const userAnswerKey = `ans${question.id}`;
              
              if (userAnswerKey in userAnswers) {
                const correctAnswer = question.ans;
                const userAnswer = userAnswers[userAnswerKey];
                
                result[question.id] = {
                  correctAnswer: question.ans,
                  userAnswer: userAnswer,
                  isCorrect: correctAnswer === userAnswer
                };
              }
            });


            for (const questionId in result) {
              if (result.hasOwnProperty(questionId)) {
                if (result[questionId].isCorrect === true) {
                  trueCount++;
                }
              }
              count++;
            }

            console.log(`Number of correct answers: ${trueCount}`);

            res.render("home/results",{
                results: result,
                total: count,
                Papers: papers,
                grade: trueCount
            });
          console.log(result);
          
        } catch (error) {
          console.log("Error parsing JSON:", error);
          res.status(500).send("Error parsing JSON");
        }
      });
      // res.send(answers);
  })
  

  module.exports = router;