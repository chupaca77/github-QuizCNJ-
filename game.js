import { quiz_montegolri } from './scriptQuiz.js';

const questionZone = document.querySelector(".question")
const optionsZone =  document.querySelector(".options")
const replayButton = document.querySelector("#replay-button")
const nextButton = document.querySelector("#next-button")
const scoreZone = document.querySelector(".scoreMessage")

let currentQuestionIndex = 0
let userScore = 0
let barreProgression = 0;
let SpawnBarreProgression = 0;
let startTime;
let stopConfetti;
let timerInterval;
let endingMusic;


// Démarrer le player audio musique de fond
const musicAscenseur = document.getElementById("music1");
document.body.addEventListener("click", startMusic);

function startMusic() {
  if (musicAscenseur.paused) {
      musicAscenseur.play();
  }
  document.body.removeEventListener("click", startMusic);
}

//On charge la question et ses options de réponse
function loadQuestion() {
  optionsZone.innerHTML='';
  const currentQuestion = quiz_montegolri.questions[currentQuestionIndex]
  questionZone.innerText = currentQuestion.text
  let optionNumber = 0
  currentQuestion.options.forEach(option => {
      optionNumber++
      const optionButton = document.createElement('button');
      optionButton.innerText = option;
      optionButton.dataset.index = optionNumber;
      optionsZone.appendChild(optionButton);
      optionButton.addEventListener('click', function(event){
        checkAnswer(event);
        barreProgression += 10;
        SpawnBarreProgression += 10;
        document.getElementById("progressBar").style.width = barreProgression + "%";
        document.getElementsByClassName("percentage")[0].innerHTML = SpawnBarreProgression + "%";
        
      } )
      
    }
  )
}



//On assigne les fonctions au bouton Rejouer
replayButton.addEventListener('click', () => {
  currentQuestionIndex = 0;
  userScore = 0;
  barreProgression = 0;
  SpawnBarreProgression = 0;
  document.getElementById("progressBar").style.width = barreProgression + "%";
  document.getElementsByClassName("percentage")[0].innerHTML = SpawnBarreProgression + "%";
  nextButton.style.display = 'inline-block';
  replayButton.style.display = 'none';
  loadQuestion()
  clearInterval(stopConfetti);
  endingMusic.pause();
}
)

const rightAnswer = document.getElementById("right");
const wrongAnswer = document.getElementById("wrong");

function startSound(isCorrect) {
  if (isCorrect) {
    rightAnswer.play();
  } else {
    wrongAnswer.play();
  }
}

function checkAnswer(event) {
  const clickedButton = event.target
  let clickedIndex = clickedButton.getAttribute('data-index')
  const currentQuestion = quiz_montegolri.questions[currentQuestionIndex]
  
  // On rend incliquable les autres réponses possibles
  const allButtonsOptions = document.querySelectorAll(".options button")
  allButtonsOptions.forEach(button => {
    button.disabled = true; 
  });
  
  //On compare la réponse sélectionnée avec la bonne réponse
  if (clickedIndex == currentQuestion.correct_answer){
    clickedButton.style.borderColor = "green";
    clickedButton.style.backgroundColor = "lightgreen";
    userScore += 2;
    startSound(true);
  } else { 
    clickedButton.style.borderColor= "red";
    const rightAnswerSelector = `.options button:nth-of-type(${currentQuestion.correct_answer})`
    const rightAnswerButton = document.querySelector(rightAnswerSelector);
    rightAnswerButton.style.borderColor = "green";
    rightAnswerButton.style.backgroundColor = "lightgreen";
    rightAnswerButton.style.fontWeight = "bold";
    startSound(false);
  }
  
  // On rend le bouton Suivant cliquable à nouveau  
  nextButton.style.cursor = "pointer";
  nextButton.disabled = false;
  
  startTimer();
  nextButton.addEventListener('click', nextFunction);

  // décompte dans le bouton suivant
  let countdown=4;
  timerInterval = setInterval(() => {
    countdown--;
    nextButton.innerText = `Suivant ${countdown}`;
    if (countdown === 0) {
      nextButton.innerText = "Suivant";
      clearInterval(timerInterval);
    }
  }, 1000);
}

function nextFunction() {
  // on enleve le compteur
  clearTimeout(startTime);
  // on eneleve le décompte
  clearInterval(timerInterval);
  // on redonne le nom du bouton
  nextButton.innerText = "Suivant";
  currentQuestionIndex++;
  if (currentQuestionIndex<quiz_montegolri.questions.length) {
    loadQuestion();
    nextButton.disabled = true;
    
  } else {
    questionZone.innerText = 'Le quiz est terminé !';

    musicAscenseur.pause();
    musicAscenseur.currentTime = 0; // Remet à zéro pour éviter un repeat

    endingMusic = document.getElementById("music2");
    endingMusic.play()

    launchConfetti()
    stopConfetti = setInterval(launchConfetti, 2000)

    let scoreMessage = "";
      if (userScore >= 0 & userScore <= 4) {
        scoreMessage = "Oula... On va dire que tu t'es trompé d'examen et que t'étais pas censé être là. 😅 Mais bon, au moins, t'as essayé, et c'est déjà courageux !"
      } else if (userScore >= 5 & userScore <= 9) {
        scoreMessage = "C'est pas la gloire, mais au moins, tu ne finis pas dernier ! Un peu plus d'entraînement et qui sait ? Peut-être que tu atteindras le rang légendaire de… personne qui connaît des trucs."
      } else if (userScore >= 10 & userScore <= 14) {
        scoreMessage = "Pas mal du tout ! Tu es officiellement dans la moyenne, ce qui veut dire que tu peux briller en société… à condition que personne ne te demande trop de détails."
      } else if (userScore >= 15 & userScore <= 19) {
        scoreMessage = "Wow, impressionnant ! Tu frôles la perfection. Encore un petit effort et on t'appelle pour remplacer l'IA sur les quiz en ligne !"
      } else if (userScore === 20) {
        scoreMessage = "Alors là, chapeau ! T'as tout bon, t'es un(e) génie, ou alors t'as eu un gros coup de chance… mais on va dire que c'est du talent. Respect éternel !"
      }
        optionsZone.innerHTML = `Ton score est de ${userScore} sur 20`;
        scoreZone.innerHTML = `${scoreMessage}`;
        nextButton.style.display = 'none';
        replayButton.style.display = 'inline-block';
  }
}

function startTimer() {
        if (startTime){
          clearTimeout(startTime)
        }
        startTime = setTimeout(nextFunction, 4000);
      }

function launchConfetti() {
  const canvas = document.querySelector('#confetti-canvas')
  let myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
  myConfetti({
    particleCount: 100,
    spread: 160
  });
}

//Ajout de la possibilité de presser la touche Entrée au lieu de cliquer sur Suivant

document.addEventListener('keydown', function(event) {
  if (event.code === 'Enter') {
    document.getElementById('next-button').click();
  }
});

//Ajout de la possibilité de presser la touche Entrée au lieu de cliquer sur Suivant

document.addEventListener('keydown', function(event) {
  if (event.code === 'Enter') {
    document.getElementById('next-button').click();
  }
});

loadQuestion();
