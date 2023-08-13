const mongoose = require('mongoose')
const path = require('path')
// const sp1Path = 'uploads/sp1';
// const sp2Path = 'uploads/sp2';


const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    ans: {
        type: String,
        required: true
    },
    specialPaper: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

questionSchema.virtual('ImagesPath').get(function(){
    if(this.question != null){
        return path.join('/', sp1Path )
    }
})

module.exports = mongoose.model('question',questionSchema )
// module.exports.sp1Path = sp1Path
// module.exports.sp2Path = sp2Path