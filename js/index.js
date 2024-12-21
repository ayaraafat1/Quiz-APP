// !========================== Start Global Variables================//
const startBtn = document.querySelector("#startQuiz");
const category = document.querySelector("#categoryMenu");
const difficulty = document.querySelector("#difficultyOptions");
const questionsNumber = document.querySelector("#questionsNumber");
const quizForm = document.getElementById("quizForm");
let Questions = [];
let quizData;
// !========================== End Global Variables================//


// ========================== Start Events================//
startBtn.addEventListener("click",async()=>{

    quizData = new Quiz(category.value , difficulty.value , questionsNumber.value);
    Questions = await quizData.getQuizaData()
    quizForm.classList.replace("d-flex","d-none");
    let myQuestion = new Question(0);
    myQuestion.displayData();
    console.log(Questions)
})
// ========================== End Events================//


// ?========================== Start Classes================//
class Quiz{
    constructor(Category,difficulty,amount){
        this.Category = Category;
        this.difficulty = difficulty;
        this.amount = amount;
        this.score = 0;
    }
    // function to get data from API
    async getQuizaData(){
        let response = await fetch(`https://opentdb.com/api.php?amount=${this.amount}&category=${this.Category}&difficulty=${this.difficulty}`)
        let data = await response.json()
        // console.log(data.results)
        return data.results;
    }
        
    // function to show Result of Quiz
    ShowResult(){
            return `
              <div
                class="Question bg-white shadow-lg mx-auto p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-4 animate__animated animate__fadeInRight"
             >
                <h2 class="mb-0">
                ${
                    this.score == this.amount ? `Congratulations 🎉` : `Your score is ${this.score}`
                }      
                </h2>
                <button class="again btn btn-danger rounded-pill">Try Again</button>
              </div>
            `;
    }
}

class Question {
    constructor(index){
        this.index = index;
        this.category = Questions[this.index].category;
        this.CurrentQuestion = Questions[this.index].question;
        this.CorrectAnswer = Questions[this.index].correct_answer;
        this.InCorrectAnswer = Questions[this.index].incorrect_answers;
        this.length = Questions.length;
        this.AllAnswers = this.getAllAnswers();
        this.isAnswered = false;
    }

    // function to get all answer and sort them
    getAllAnswers(){
        let AllChoices = [this.CorrectAnswer, ...this.InCorrectAnswer]
        AllChoices.sort();
        return AllChoices;
    }
    
    // function to get Question data and display them
    displayData(){
        let cartona =`
    <div class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__fadeInLeft">
        <div class="w-100 d-flex justify-content-between g-1">
        <span class="btn btn-category">${this.category} </span>
        <span class="fs-6 btn btn-questions"> ${this.index +1} of ${this.length} Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center"> ${this.CurrentQuestion}  </h2>  
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
        ${this.AllAnswers.map((choice)=>`<li>${choice}</li> `).join("")}
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${quizData.score} </h2>        
    </div>
        `;
        document.getElementById("questionsContainer").innerHTML = cartona;

        let allChoices = document.querySelectorAll(".choices li");

        allChoices.forEach((answer) => {
            answer.addEventListener("click", () => {
            this.checkAnswer(answer);
            this.nextQuestion()
        });
        });
    }

    // function to check the Answer
    checkAnswer(answer){
        if(!this.isAnswered){
            this.isAnswered = true;
            if(answer.innerHTML === this.CorrectAnswer){
                answer.classList.add("correct")
                quizData.score++
            }
            else{
                answer.classList.add("wrong")
                answer.classList.add("animate__animated")
                answer.classList.add("animate__bounceIn")
            }
        }
    }

    // function to move user to next Question
    nextQuestion(){
        this.index++;
        setTimeout(() =>{
        if(this.index <this.length)
        {
            let myNextQuestion = new Question(this.index);
            myNextQuestion.displayData()
        }
        else
        {
            document.getElementById("questionsContainer").innerHTML = quizData.ShowResult();
            document.querySelector(".again").addEventListener("click"  ,  ()=>{
                window.location.reload()
            })
        }
    }, 1500)
    }

}
// ?========================== End Classes================//