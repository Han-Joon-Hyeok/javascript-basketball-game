// 캔버스 가져오기

var bgCanvas = document.getElementById("background");
var bgCtx = bgCanvas.getContext("2d");

var gCanvas = document.getElementById("game");
var gCtx = gCanvas.getContext("2d");

// 배경, 공 이미지 표시

var bgImage = new Image();
bgImage.src = "./images/background.png";
var hoopImage = new Image();
hoopImage.src = "./images/hoop.png";
var ball = new Image();
ball.src = "./images/basketball.png";

window.onload = function drawBackground(){
    bgCtx.drawImage(bgImage, 0, 0);
    bgCtx.drawImage(hoopImage, 1060, 400);
    scoreArr = [0, 0, 0];
    showTime();
    createRanking();
    startScreen();
}

const width = gCanvas.width;
const height = gCanvas.height;
const groundX = 100;
const groundY = 630;
let ballX = 100;
let ballY = 630;
let ballPower;
let ballV;
let ballVx;
let ballVy;
let gauge = 0;
let isCharging = false;
let isFired = false;
let isHitted = false;
const GRAVITY_ACCELERATION = 0.098;
let degree=0;

// 각도기 조절

var arrow = new Image();
arrow.src = "./images/arrow.png";

// 90도 틀 그리기
function arrowFrame() {
  gCtx.beginPath();
  gCtx.moveTo(248, 610);
  gCtx.lineTo(340, 610);
  gCtx.strokeStyle = "#707070";
  gCtx.lineWidth = 5;
  gCtx.stroke();
  gCtx.closePath();

  gCtx.beginPath();
  gCtx.moveTo(250, 520);
  gCtx.lineTo(250, 612);
  gCtx.strokeStyle = "#707070";
  gCtx.lineWidth = 5;
  gCtx.stroke();
  gCtx.closePath();
}

var direction = -1;
var rotateX = -1;
var rotateY = -1;

function moveArrow() {
  
    // 방향 설정
    if (degree == -20) direction = -1;
    else if (degree == -90) direction = 1;

    // 화살표 위치 조정
    rotateX = -(-degree / 10) - 1.5;
    rotateY = -(-degree / 30) * 2 - 1;

    // 화살표 그리기
    gCtx.save();
    gCtx.translate(248, 600);
    gCtx.rotate(degree * Math.PI / 180);
    gCtx.drawImage(arrow, rotateX, rotateY);
    gCtx.restore();

    degree += direction;
}

// 타이머

// 타이머 영역 만들기

var timeArea = document.createElement("div");
timeArea.setAttribute("class", "timer area");
document.getElementById("canvas-area").appendChild(timeArea);

var sec = document.createElement("p");
sec.setAttribute("class", "large");
document.querySelector(".timer").appendChild(sec);

var timerText = document.createElement("span");
timerText.setAttribute("class", "bold");
timerText.innerText = "SECOND";
document.querySelector(".timer").appendChild(timerText);

// 타이머

var time = 30;

function showTime() {
  document.querySelector(".timer > p").innerText = time;
}

function gameTimer() {
  var arrow = setInterval(moveArrow, 15);
  var timer = setInterval(changeTime, 1000);
  function changeTime() {
    time -= 1;
    if (time != 0) {
      document.querySelector(".timer > p").innerText = time;
    } else {
      document.querySelector(".timer > p").innerText = time;
      clearInterval(timer);
      clearInterval(arrow);
      time = 30;
      endScreen();
    }
  }
}

// gameTimer();

// 스코어 영역 만들기
// 점수 카운트하는 부분이 구현되지 않아 임의로 값 넣어둠

var scoreArea = document.createElement("div");
scoreArea.setAttribute("class", "score area");
document.getElementById("canvas-area").appendChild(scoreArea);

var score = document.createElement("p");
score.setAttribute("class", "large");
score.innerText = 0;
document.querySelector(".score").appendChild(score);

var scoreText = document.createElement("span");
scoreText.setAttribute("class", "bold");
scoreText.innerText = "SCORE";
document.querySelector(".score").appendChild(scoreText);

// 시작 화면

function startScreen() {
    var darkDiv = document.createElement("div");
    darkDiv.setAttribute("class", "dark-div");
  
    var largeBtn = document.createElement("p");
    largeBtn.setAttribute("class", "div-btn");
    largeBtn.innerHTML = "PRESS ENTER<br />TO START";
    darkDiv.appendChild(largeBtn);
  
    document.getElementById("canvas-area").appendChild(darkDiv);
  }
  
  // 엔딩 화면
  
  var currentScore;
  
  function endScreen() {
    var darkDiv = document.createElement("div");
    darkDiv.setAttribute("class", "dark-div end");
  
    var gameOver = document.createElement("h1");
    gameOver.setAttribute("class", "end-heading");
    gameOver.innerText = "GAME OVER";
    darkDiv.appendChild(gameOver);
  
    var scoreBox = document.createElement("div");
    scoreBox.setAttribute("class", "score-box");
    darkDiv.appendChild(scoreBox);
  
    var scoreText = document.createElement("div");
    scoreText.setAttribute("class", "score-text-box");
    scoreBox.appendChild(scoreText);
  
    var score = document.createElement("p");
    score.setAttribute("class", "score-text");
    score.innerText = "SCORE";
    scoreText.appendChild(score);
  
    var scoreNum = document.createElement("p");
    scoreNum.setAttribute("class", "score-text");
    // var currentScore = document.querySelector(".score p").innerText;
    // 이미지랑 랭킹 업데이트 확인하려고 1로 지정해둠
    currentScore = "1";
    scoreNum.innerText = currentScore;
    scoreText.appendChild(scoreNum);
  
    var best = document.createElement("p");
    best.setAttribute("class", "score-text");
    best.innerText = "BEST";
    scoreText.appendChild(best);
  
    var bestNum = document.createElement("p");
    bestNum.setAttribute("class", "score-text");
    bestNum.innerText = (parseInt(currentScore) > parseInt(scoreArr[0]) ? currentScore : scoreArr[0]);
    scoreText.appendChild(bestNum);
  
    // 새로운 베스트 스코어가 나오면 new 이미지 띄우기
  
    if (parseInt(scoreNum.innerText) > parseInt(scoreArr[0])) {
      var newScore = document.createElement("img");
      newScore.setAttribute("src", "./images/new.png");
      newScore.setAttribute("class", "new-score");
      scoreBox.appendChild(newScore);
    }
  
    var smallBtn = document.createElement("p");
    smallBtn.setAttribute("class", "div-btn smBtn");
    smallBtn.innerHTML = "PRESS ENTER TO RESTART";
    darkDiv.appendChild(smallBtn);
  
    document.getElementById("canvas-area").appendChild(darkDiv);
  
    // 랭킹 업데이트 
  
    for (var i = 0; i < scoreArr.length; i++) {
      if (scoreArr.includes(parseInt(currentScore))) break;
      if (parseInt(currentScore) > parseInt(scoreArr[i])) {
        scoreArr.splice(i, 0, parseInt(currentScore));
        scoreArr.pop();
        break;
      }
    }
  }
  
  // 게임 시작 & 재시작
  
  function startGame(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      var div = document.querySelector(".dark-div");
      div.parentNode.removeChild(div);
      var rank = document.querySelector(".ranking");
      rank.parentNode.removeChild(rank);
      showTime();
      createRanking();
      gameTimer();
    }
  }
  
  document.addEventListener("keydown", startGame);
  
  // 랭킹 테이블
  
  var scoreArr; // onload에서 초기화했음
  
  function createRanking() {
    var ranking = document.createElement("table");
    var rankingHead = document.createElement("thead");
    var rankingBody = document.createElement("tbody");
    ranking.appendChild(rankingHead);
    ranking.appendChild(rankingBody);
    ranking.setAttribute("class", "ranking");
    for (var i = 0; i < 4; i++) {
      if (!i) {
        rankingHead.innerHTML += "<tr><th>순위</th><th>점수</th></tr>";
      } else {
        rankingBody.innerHTML += "<tr><td>"+i+"등</td><td>"+scoreArr[i-1]+"점</td></tr>";
      }
    }
    document.getElementById("canvas-area").appendChild(ranking);
  }

// 공 그리기

function drawBall(){
    gCtx.drawImage(ball, ballX, ballY, 120, 120);

}

function draw(){
    gCtx.clearRect(0,0,width,height);
    arrowFrame();
    moveArrow();
    drawGauging();
    drawGaugeBar();
    drawBall();
    // drawBackground();

    if(!isFired){
        ballX = 100;
        ballY = 630;
    }
    else{
        if(ballY+ballVy < 0 || ballY + ballVy > height){
            ballVy = - ballVy;
        }
        else if(ballX+ballVx < 0 || ballX + ballVx > width){
            ballVx = - ballVx;
        }
        ballVy += 0.98;
        ballX += ballVx;
        ballY += ballVy;
    }
}

function drawGaugeBar(){
    gCtx.strokeRect(600,100,200,30);
    gCtx.lineWidth = 3;
    gCtx.font = "20px bold"
    gCtx.fillText("파워 게이지", 650, 180);
}

function drawGauging(){
    if(gauge<=200 && isCharging && !isFired){
        gCtx.fillStyle = "#E67567";
        gauge += 1;
        gCtx.fillRect(600,100,gauge,30);
    }
    else if(!isCharging && isFired){
        gCtx.fillStyle = "black";
        gCtx.fillRect(600,100,0,30);
    }
    else if(isCharging){
        gCtx.fillRect(600,100,200,30);
    }
};



// 스페이스바 입력

const keydownHandler = event => {
    if (event.keyCode === 32) {
        event.preventDefault();
        isCharging = true;
        isFired = false;
        draw();
    }
};

const keyupHandler = event => {
    if(event.keyCode === 32 && !isFired){
        isCharging = false;
        isFired = true;
        ballPower = gauge / 2;
        let degreeR = -(degree) * Math.PI / 180;

        ballVx = ballPower * Math.cos(degreeR);
        ballVy = -ballPower * Math.sin(degreeR);

        gauge = 0;
    }
};

const start = setInterval(draw, 10);
document.addEventListener("keydown", keydownHandler, false);
document.addEventListener("keyup", keyupHandler, false);