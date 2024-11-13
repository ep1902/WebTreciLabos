//Dohvaćanje canvas objekta
const canvas = document.getElementById("gCanvas");
const ctx = canvas.getContext("2d");
//Definiranje podataka za veličinu canvasa na fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//Inicijalizacija rezultata, pobjede te hohvaćanje najboljeg rezultata ako takav posoji u localstorageu
let score = 0;
let win = false;
let highScore = localStorage.getItem("highScore")
  ? parseInt(localStorage.getItem("highScore"))
  : 0;

//Definiranje osobina palice
const paddleHeight = 15; //visina
const paddleWidth = canvas.width * 0.12; //širina
let paddleX = (canvas.width - paddleWidth) / 2; //Početna x koordinata
let paddleY = canvas.height - paddleHeight - canvas.height * 0.02; //Početna y koordniata

//Definiranje osobina loptice
let ballRadius = 10; //polumjer
let x = canvas.width / 2; //Početna x koordinata
let y = canvas.height - canvas.height * 0.1; //Početna y koordniata
let dx =
  Math.random() < 0.5 ? -1.5 * (Math.random() + 1) : 1.5 * (Math.random() + 1); //Brzina kretanja po x osi prvo slucajan odabir smjera pa zatim brzina po x u intervalu od [1.5, 3]
let dy = -1.5 * (Math.random() + 1); //Brzina kretanja po y osi u intervalu od [1.5, 3] početno prema gore

//Definiranje osobina cigli
const rows = 3; //Redci
const collumns = 5; //Stupci
const brickW = canvas.width / (collumns + (collumns + 1) * (1 / 3)); //Dinamički odabir širine cigle ovisno o broju stupaca
const brickH = 20; //Visina cigle
const paddingX = brickW / 3; //Razmak među ciglama po x osi
const paddingY = 40; //Razmak među ciglama po y osi
const fromTop = 70; //Početna udaljenost prve cigle od gornjeg dijela stranice
const fromLeft = brickW / 3; //Početna udaljenost prve cigle od lijevog dijela stranice

let bricks = []; //Lista cigli

//For petlja u kojoj kreiramo cigle bez dodanih koordinata
for (let i = 0; i < rows; i++) {
  bricks[i] = [];
  for (let j = 0; j < collumns; j++) {
    bricks[i][j] = { brickX: 0, brickY: 0, status: 1 };
  }
}

//Varijable kojima pratimo klik tipke na tipkovnici
let rightPressed = false;
let leftPressed = false;

//Listener koji prate klik i otpuštanje tipke na tipkovnici
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//Slušatelj koji sluša pritiskanje tipke i mijenja varijable koje prate klikove za tipke: A, D, te stelice lijevo i desno
function keyDownHandler(e) {
  if (e.key === "D" || e.key === "d" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "A" || e.key === "a" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}
//Slušatelj koji sluša otpuštanje tipke i mijenja varijable koje prate klikove  za tipke: A, D, te stelice lijevo i desno
function keyUpHandler(e) {
  if (e.key === "D" || e.key === "d" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "A" || e.key === "a" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}
//Funkcija koje će crtati lopticu
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}
//Funkcija koja crta palicu
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  //Definiranje osjenčanog ruba
  ctx.fillStyle = "#FF0000";
  ctx.shadowColor = "rgba(255, 0, 0, 1)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.fill();
  ctx.closePath();
  //Micanje sjenčanja jer će nam u protivnome Canvas API dodati sjenčani rub na sve elemente
  ctx.shadowColor = "rgba(0, 0, 0, 0)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}
//Funkcija koja crta cigle
function drawBricks() {
  //Iteriraj po svakoj cigli
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < collumns; j++) {
      //Provjera dali cigla ima status 1 jer ju inaće ne crtamo
      if (bricks[i][j].status === 1) {
        //Definiranje koordinata cigli
        bricks[i][j].brickX = j * (brickW + paddingX) + fromLeft;
        bricks[i][j].brickY = i * (brickH + paddingY) + fromTop;
        //Dalje je proces crtanja cigli
        ctx.beginPath();
        ctx.rect(bricks[i][j].brickX, bricks[i][j].brickY, brickW, brickH);
        ctx.fillStyle = "#0000FF";
        //Definiranje osjenčanog ruba
        ctx.shadowColor = "rgba(0, 0, 255, 1)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fill();
        ctx.closePath();
        //Micanje sjenčanja jer će nam u protivnome Canvas API dodati sjenčani rub na sve elemente
        ctx.shadowColor = "rgba(0, 0, 0, 0)";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    }
  }
}
//Ispis trenutnog i najviseg rezultata u gornjem desnom kutu
function drawScore() {
  ctx.font = "18px Arial";
  ctx.fillStyle = "#00FF00";
  ctx.fillText("Score: " + score, canvas.width - 120, 20);
  ctx.fillText("High Score: " + highScore, canvas.width - 120, 40);
}
//Ispis zavrsetka igre u slučaju da loptica dodirne donji rub
function drawGameOver() {
  ctx.font = "50px Arial";
  ctx.fillStyle = "#00FF00";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
}
//Ispit pobjednickog citata u slucaju da je igrac razbio sve cigle
function drawGameOverWinner() {
  ctx.font = "48px Arial";
  ctx.fillStyle = "#00FF00";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("YOU ARE THE WINNER", canvas.width / 2, canvas.height / 2);
}
//Funkcija koja prati kolizije cigle i loptice
function brickHit() {
  //Iteriramo po svakoj cigli
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < collumns; j++) {
      //Ako je cigla jos uvijek prisutna
      if (bricks[i][j].status === 1) {
        let brick = bricks[i][j];
        //Uvijet koji mora biti zadovoljen kako bi doslo do kontakta izmedu loptice i cigle koordinate loptice (s uracunatim radiusom) moraju biti unutar koordinatnog intervala u kojem se nalazi cigla
        if (
          x + ballRadius > brick.brickX && //Dodirivanje s desna
          x - ballRadius < brick.brickX + brickW && //Dodirivanje s lijeva
          y + ballRadius > brick.brickY && //Dodirivanje s gornje strane
          y - ballRadius < brick.brickY + brickH //Dodirivanje s donje strane
        ) {
          //Sada moramo provjeriti s koje se strane tocno dogodio kontakt kako bismo znali u kojem smjeru je potrebno odbiti lopticu
          //X koordinate nam se nalaze unutar intervala pa znamo da je loptica u kontak s ciglom došla po y smjeru kojeg moramo promjeniti (kretanje po y), staviti status cigle na 0 kako
          //se nebi više prikazivala i povecati trenutni rezultat za 1
          if (x > brick.brickX && x < brick.brickX + brickW) {
            dy = -dy;
            brick.status = 0;
            score += 1;
          } else if (y > brick.brickY && y < brick.brickY + brickH) {
            //Y koordinate nam se nalaze unutar intervala pa znamo da je loptica u kontak s ciglom došla po x smjeru kojeg moramo promjeniti (kretanje po x), staviti status cigle na 0 kako
            //se nebi više prikazivala i povecati trenutni rezultat za 1
            dx = -dx;
            brick.status = 0;
            score += 1;
          }
          //Provjeravanje dali je naš trenutni rezultat najveći rezultat i ako je promjena pohrane u localStorageu
          if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
          }
          //Poziv funkcije koja će provjeriti pobjednika
          if (winner()) {
            win = true;
            return;
          }
        }
      }
    }
  }
}
//Funkcija koja provjerava pobjednika, ako pronađe ciglu s statusom 1 igra nije gotova jer se nije dogodila kolizija sa tom ciglom
function winner() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < collumns; j++) {
      if (bricks[i][j].status === 1) {
        return false;
      }
    }
  }
  return true;
}
//Glavna funkcija koja crta likove i prati kolizije sa zidovima
function draw() {
  //Pocisti plohu
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //Nacrtaj lopticu
  drawBall();
  //Nacrtaj palicu
  drawPaddle();
  //Nacrtaj cigle
  drawBricks();
  //Nacrtaj rezultate
  drawScore();
  //Prati koliziju s ciglom
  brickHit();
  //Ako je igrac pobjedio ispisi teskt pobjede i rezultat
  //Moramo pocistiti plohu prije ponovnog crtanja
  if (win) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawScore();
    drawGameOverWinner();
    return;
  }
  //Kolizije sa zidovima
  if (x < ballRadius) {
    //Kolizija s lijevim zidom
    dx = -dx;
  } else if (x > canvas.width - ballRadius) {
    //Kolizija s desnim zidom
    dx = -dx;
  }
  if (y < ballRadius) {
    //Kolizija s gornjim zidom
    dy = -dy;
  } else {
    if (x >= paddleX && x <= paddleX + paddleWidth) {
      //Kolizija loptice i palice
      if (y + ballRadius >= paddleY && y + ballRadius <= paddleY + dy) {
        //Provjera koordinata koje zadovoljavaju koliziju od gore
        dy = -dy; //Mijenjanje smjera po y osi
      }
    } else if (y > paddleY && y < paddleY + paddleHeight) {
      //Provjera koordinata koje zadovoljavaju koliziju sa bocnih strana palice (y os)
      if (x + ballRadius >= paddleX && x < paddleX) {
        //Uvijet za udarac s lijeve strane
        dx = -dx; //Promjena smjera kretanja po x osi
      } else if (
        //Uvijet za udarac s desne strane
        x - ballRadius <= paddleX + paddleWidth &&
        x > paddleX + paddleWidth
      ) {
        dx = -dx; //Promjena smjera kretanja po x osi
      }
    } else if (y > canvas.height - ballRadius) {
      //Udarac u donju stranu i kraj igre, ispis gubitka
      drawGameOver();
      return;
    }
  }
  //Projera uvijeta pritiska tipke na tipkovnici i mijenjanje pozicije palice ukoliko se neka od tipki kliknuta
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }
  //Mjenjanje pozicije loptice odnosno definiranje kretnje za lopticu
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}
//Poziv funkcije za crtanje
draw();
