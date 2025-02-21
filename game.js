import { quiz_montegolri } from './scriptQuizMontegolri.js';

const questionZone = document.querySelector(".question")
const optionsZone =  document.querySelector(".options")
const replayButton = document.querySelector("#replay-button")
const nextButton = document.querySelector("#next-button")

let currentQuestionIndex = 0
let userScore = 0

//On charge la question et ses options de réponse

function loadQuestion(){
  optionsZone.innerHTML='';
  const currentQuestion = quiz_montegolri.questions[currentQuestionIndex]
  questionZone.innerText = currentQuestion.text
  let optionNumber = 0
  currentQuestion.options.forEach(option => {
      optionNumber++
      const optionButton = document.createElement('button');
      optionButton.innerText = option;
      optionButton.classList.add(optionNumber);
      optionsZone.appendChild(optionButton);
      optionButton.addEventListener('click', function(event){
        checkAnswer(event);
      } )
    }
  )
}

// On assigne les fonctions au bouton Suivant

nextButton.addEventListener('click', () => {

  currentQuestionIndex++;
  if (currentQuestionIndex<quiz_montegolri.questions.length) {
    loadQuestion();
    nextButton.disabled = true;
  } else {
    questionZone.innerText = 'Le quiz est terminé !';
    optionsZone.innerHTML = `Ton score est de ${userScore} sur 20`;
    nextButton.style.display = 'none';
    replayButton.style.display = 'inline-block';
  }
})

//On assigne les fonctions au bouton Rejouer
replayButton.addEventListener('click', () => {
  currentQuestionIndex = 0;
  userScore = 0;
  nextButton.style.display = 'inline-block';
  replayButton.style.display = 'none';
  loadQuestion()
}
)

function checkAnswer(event) {
  const clickedButton = event.target
  const currentQuestion = quiz_montegolri.questions[currentQuestionIndex]
  
  // On rend incliquable les autres réponses possibles
  const allButtonsOptions = document.querySelectorAll(".options button")
  allButtonsOptions.forEach(button => {
    button.disabled = true; 
  });
  
  //On compare la réponse sélectionnée avec la bonne réponse
  if (clickedButton.classList == currentQuestion.correct_answer){
    clickedButton.style.borderColor = "green";
    clickedButton.style.backgroundColor = "lightgreen";
    userScore += 2;
  } else { 
    clickedButton.style.borderColor= "red";
    const rightAnswerSelector = `.options button:nth-of-type(${currentQuestion.correct_answer})`
    const rightAnswerButton = document.querySelector(rightAnswerSelector);
    rightAnswerButton.style.borderColor = "green";
    rightAnswerButton.style.backgroundColor = "lightgreen";
    rightAnswerButton.style.fontWeight = "bold";
  }
  
  // On rend le bouton Suivant cliquable à nouveau  
  nextButton.style.cursor = "pointer";
  nextButton.disabled = false;
    
}

loadQuestion()

