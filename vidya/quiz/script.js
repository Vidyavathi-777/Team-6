const quizContainer = document.getElementsByClassName("container")[0];
const quiz = document.getElementsByClassName("quiz")[0];
const previous = document.getElementsByClassName("prev")[0];
const next = document.getElementsByClassName("next")[0];
const submit = document.getElementsByClassName("sub")[0];
const reset =document.getElementsByClassName("reset")[0];
const resultEle = quizContainer.querySelector(".results")

const questions = [
  {
    id: 1,
    question: "Who is the creator?",
    answers: {
      a: "Me",
      b: "You",
      c: "Other",
    },
    correctAnswer: "c",
  },
  {
    id: 2,
    question: "Which one is a programming language?",
    answers: {
      a: "HTML",
      b: "JS",
      c: "CSS",
    },
    correctAnswer: "b",
  },
  {
    id: 3,
    question: "What is Python?",
    answers: {
      a: "Programming language",
      b: "Speaking language",
      c: "Writing language",
    },
    correctAnswer: "a",
  },
];

const quizSlide = [];
let currentSlide = 0;
let quizSubmitted = false;
const answeredByUser = [];

function onNext(){
  const upcomingSlide = currentSlide + 1;
  if (upcomingSlide >= questions.length){
    return;
  } else{
    showSlide(upcomingSlide);
  }
}

function onPrevious(){
  const upcomingSlide = currentSlide -1;
  if (upcomingSlide < 0){
    return;

  }else{
    showSlide(upcomingSlide);
  }
}

function onSub(){
  quizSubmitted = true;
  const resultEle = quizContainer.querySelector('.results');
  const correctAnswers = answeredByUser.filter(i => i.isCorrect == true);

  const displayText = `${correctAnswers.length} of ${questions.length} are correct.`;

  resultEle.innerHTML=displayText;
  enableSub(false);
  enableReset(true);
  disableAnswers();


}
function onReset(){
  resultEle.innerHTML='';
  answeredByUser = [];
  quizSubmitted=false;

  unsetAllQue();
  showSlide(0);

  enableSub(false);
  enableReset(false);
}

function enability(){
  if (currentSlide <= 0){
    previous.setAttribute('disabled','disabled');
  }else{
    previous.removeAttribute('disabled');
  }

  if(currentSlide >= quizSlide.length-1){
    next.setAttribute('disabled','disabled');
  }else{
    next.removeAttribute('disabled')
  }
}

function enableSub(enable){
  if (enable){
    submit.removeAttribute('disabled');
  }else{
    submit.setAttribute('disabled','disabled')
  }
}

function enableReset(enable){
  if(enable){
    reset.removeAttribute('disabled');
  }else{
    reset.setAttribute('disabled','disabled');
  }

}

function buildQuiz() {
  questions.forEach(function (question, index) {
    const slideEle = document.createElement("div");
    slideEle.setAttribute("class", "slide");

    const quesEle = document.createElement("div");
    quesEle.setAttribute("class", "question");
    quesEle.innerHTML = question.question;

    slideEle.appendChild(quesEle);

    const ansEle = document.createElement("div");
    ansEle.setAttribute("class", "answers");
    
    for (const letter in question.answers) {
      const answerElement = document.createElement("div");
      answerElement.setAttribute("class", "answer");

      const inputOptionEle = document.createElement("input");
      inputOptionEle.setAttribute("type", "radio");
      inputOptionEle.setAttribute("name", `questions${question.id}`);
      inputOptionEle.setAttribute("id", letter);
      inputOptionEle.setAttribute("value", question.answers[letter]);
      inputOptionEle.setAttribute("onclick", "onAnserClick(event)");

      answerElement.appendChild(inputOptionEle);

      const spanEle = document.createElement("span");
      spanEle.innerHTML = question.answers[letter];

      answerElement.appendChild(spanEle);
      ansEle.appendChild(answerElement);
    }

    slideEle.appendChild(ansEle);
    quizSlide.push(slideEle);
  });
}

function onAnserClick(ev){
  const questionId = ev.target.name.match(/(?<=questions).*/gi)[0];
  const existingAns = answeredByUser.find(i => i.questionId == questionId);
  const answered = existingAns ?? {questionId:questionId};
  answered.answerchosen = ev.target.id;

  markCorrect(answered);
  if (!existingAns){
    answeredByUser.push(answered);
  }
  if (questions.length == answeredByUser.length){
    enableSub(true);
  }
}

function markCorrect(answered){
  const question = questions.find(i => i.id == answered.questionId);
  if(question.correctAnswer == answered.answerchosen){
    answered.isCorrect=true;
  }else{
    answered.isCorrect=false;
  }
}
function disableAnswers(){
  const slide = quizSlide[currentSlide];
  const allTheAns = slide.querySelectorAll("input[type=radio");
  for (let i=0;i<allTheAns.length;i++){
    const ele =allTheAns[i];
    ele.setAttribute('disabled','disabled')
  }
}
function unsetAllQue(){
  for (let i=0;i < quizSlide.length;i++){
    const slide = quizSlide[i];
    const allTheAns = slide.querySelectorAll("input[type=radio");
    unsetAllAns(allTheAns);
    currentSlide=i;
    disableAnswers(false);
  }
}
function unsetAllAns(){
  for(let i=0;i<allTheAns.length;i++){
    const ele =allTheAns[i];
    ele.checked = false;
  }
}

function showSlide(slideNumber) {
  quiz.innerHTML = "";

  const slide = quizSlide[slideNumber];
  quiz.appendChild(slide);

  currentSlide = slideNumber;
  enability();

  if (quizSubmitted){
    disableAnswers();
  }
}

function initialize() {
  currentSlide = 0;
  buildQuiz();
  showSlide(0);
  enableSub(false);
}

initialize();
