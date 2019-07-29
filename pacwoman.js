var relogio = null;
var relogioGhosts = null;
var audioWaka = document.getElementById("waka");
var audioOpening_song = document.getElementById("opening_song");
var audioDie = document.getElementById("die");
var audioEatghost = document.getElementById("eatghost");
var audioEatpill = document.getElementById("eatpill");

var nx = 0, ny = 0;//Número de colunas e linhas
var pontos = 0;
var gameOverTest = true;
var divAlerta = document.getElementById("alerta");
divAlerta.style.display = "none";
var divPlacar = document.getElementById("vidas");
divPlacar.style.display = "none";

var canvasPlacar = document.getElementById("placarVidas");
var ctxVidas = canvasPlacar.getContext("2d");

var score = 258;
var lvl = 1;
var vida = 3;

var dificuldade = 2.0;
var dificuldadeAntesDoPoder = 2.0;


var px = -1, py = -1;//Posição do PAC-MAN
//Recuperando referências dos objetos no documento

var canvas = document.getElementById("tela");
var canvasScore = document.getElementById("score");
var canvasLvl = document.getElementById("lvl");
var ctxScore = canvasScore.getContext("2d");


var ctxLvl = canvasLvl.getContext("2d");
var ctx = canvas.getContext("2d");
var btPausa = document.getElementById("btPausa");

//Imagens que serão desenhadas
var pacfechado = new Image();
pacfechado.onload = desenharTudo;
pacfechado.src = "img/pacfechado.png";

var paccima = new Image();
paccima.onload = desenharTudo;
paccima.src = "img/paccima.png";

var pacbaixo = new Image();
pacbaixo.onload = desenharTudo;
pacbaixo.src = "img/pacbaixo.png";

var pacesquerda = new Image();
pacesquerda.onload = desenharTudo;
pacesquerda.src = "img/pacesquerda.png";

var pacdireita = new Image();
pacdireita.onload = desenharTudo;
pacdireita.src = "img/pacdireita.png";

var parede = new Image();
parede.onload = desenharTudo;
parede.src = "img/block.gif";

var ponto = new Image();
ponto.onload = desenharTudo;
ponto.src = "img/ponto.png";

var poder = new Image();
poder.onload = desenharTudo;
poder.src = "img/poder.png";


var ghosts = new Array();
var nGhosts = 0;

document.onkeydown = onKD;
var setaCima = false;
var setaBaixo = false;
var setaDireita = false;
var setaEsquerda = false;

var direcaoAtual = Direcao.naoDefinida;
var proximaDirecao = Direcao.naoDefinida;
var abertaOuFechado = true;
var lado = 0;
var testeNovoLvl = false;
var testeVida = false;
var gambiarra = false;
var testeIniciar = false;

function atualizaRelogio() {
    relogio = setInterval("atualizarPacman()", intervalo);
    relogioGhosts = setInterval("atualizarGhosts()", Math.round(intervalo * dificuldade));
}

function paraRelogio() {
    clearInterval(relogio);
    clearInterval(relogioGhosts);
    relogio = null;
    relogioGhosts = null;
}

function pausar() {
    if (relogio != null) {
        paraRelogio();
        btPausa.innerHTML = "Continuar (P)";
    } else {
        if (testeIniciar) {
            audioOpening_song.currentTime = 0;
            audioOpening_song.play();
            testeIniciar = false;
        }
        atualizaRelogio();
        btPausa.innerHTML = "Pausar (P)";
    }
}

function maiorVelocidade() {
    if (intervalo > 30) {
        intervalo -= 10;
        paraRelogio();
        atualizaRelogio();
    }
}

function menorVelocidade() {
    if (intervalo < 600) {
        intervalo += 10;
        paraRelogio();
        atualizaRelogio();
    }
}

function tempoVida() {
    clearInterval(relogio);
    clearInterval(relogioGhosts);
    relogio = null;
    relogioGhosts = null;
}

function atualizarGhosts() {
    moverGhosts();
    desenharTudo();
    if (verificarColisoes()) {
        if (vida == 0) {
            gameOver();
        } else {
            for (i = 0; i < ghosts.length; i++) {
                ghosts[i].devorado();
            }
            tempoVida();
        }
    }
}

function atualizarPacman() {
    moverPacman();
    desenharTudo();
    if (verificarColisoes()) {
        if (vida == 0) {
            gameOver();
        } else {
            for (i = 0; i < ghosts.length; i++) {
                ghosts[i].devorado();
            }
            tempoVida();
        }
    }
}


function gameOver() {
    gameOverTest = false;
    pausar();
    btPausa.disabled = true;
    btPausa.innerHTML = "Game Over";
    Cenario.mapa = new Image();
    Cenario.mapa.src = "img/gameover.png";
    Cenario.mapa.onload = function () {
        ctx.drawImage(Cenario.mapa, 0, 0);
    }
}

function novoLvl() {
    if (score <= 0) {
        divAlerta.style.display = "block";
        pausar();
        btPausa.disabled = true;
        testeNovoLvl = true;
        dificuldade = dificuldadeAntesDoPoder;
        dificuldade -= 0.1;
        dificuldadeAntesDoPoder -= 0.1;
        paraRelogio();
    }
}

function vidas() {
    ghosts = new Array();
    nGhosts = 0;
    for (y = 0; y < ny; y++) {
        for (x = 0; x < nx; x++) {
            if (Cenario.mapa[y][x] == Cenario.pacman) {
                px = x;
                py = y;
            }
            if (Cenario.mapa[y][x] == Cenario.ghost) {
                ghosts.push(new Ghost(x, y, Ghost.imagens[nGhosts++]));
            }
        }
    }
    desenharTudo();
    btPausa.innerHTML = "Continuar (P)";
    btPausa.disabled = false;
    divPlacar.style.display = "none";
    testeVida = false;
}

function continuaProximoLvl() {
    btPausa.disabled = false;
    testeNovoLvl = false;
    divAlerta.style.display = "none";
    lvl++;
    Cenario.mapa = new Array();
    for (i = 0; i < cenarioCriado.length; i++) {
        Cenario.mapa.push(cenarioCriado[i].slice(0));
    }
    nx = Cenario.mapa[0].length;
    ny = Cenario.mapa.length;
    canvas.width = nx * largura;
    canvas.height = ny * largura;
    ghosts = new Array();
    nGhosts = 0;
    for (y = 0; y < ny; y++) {
        for (x = 0; x < nx; x++) {
            if (Cenario.mapa[y][x] == Cenario.pacman) {
                px = x;
                py = y;
            }
            if (Cenario.mapa[y][x] == Cenario.ghost) {
                ghosts.push(new Ghost(x, y, Ghost.imagens[nGhosts++]));
            }
        }
    }
    desenharTudo();
    score = 258;
}

function verificarColisoes() {
    if (Cenario.mapa[py][px] == Cenario.ponto) {
        Cenario.mapa[py][px] = Cenario.vazio;
        score--;
        pontos++;
        audioWaka.currentTime = 0;
        audioWaka.play();
        novoLvl();
    } else if (Cenario.mapa[py][px] == Cenario.poder) {
        Cenario.mapa[py][px] = Cenario.vazio;
        score--;
        pontos += 5;
        for (i = 0; i < ghosts.length; i++) {
            ghosts[i].assustar();
        }
        if(dificuldade != 2.5) {
            dificuldadeAntesDoPoder = dificuldade;
        }
        dificuldade = 2.5;
        paraRelogio();
        atualizaRelogio();
        gambiarra = true;
        audioEatpill.currentTime = 0;
        audioEatpill.play();
        novoLvl();
    }
    for (i = 0; i < ghosts.length; i++) {
        if (px == ghosts[i].x && py == ghosts[i].y) {
            if (ghosts[i].assustado == 0) {
                vida--;
                if (vida != 0) {
                    audioDie.currentTime = 0;
                    audioDie.play();
                    divPlacar.style.display = "block";
                    divPlacar.style.visibility = "visible";
                    ctxVidas.clearRect(0, 0, 300, 68);
                    ctxVidas.font = "25px Arial";
                    ctxVidas.fillStyle = "#fff";
                    ctxVidas.fillText("Restam: " + vida + " Vida(s)!!!", 40, 40);
                    testeVida = true;
                    btPausa.disabled = true;
                }
                return true;
            } else {
                audioEatghost.currentTime = 0;
                audioEatghost.play();
                ghosts[i].devorado();
                pontos += 10;
            }
        }
        if (ghosts[i].assustado == 1 && gambiarra) {
            dificuldade = dificuldadeAntesDoPoder;
            paraRelogio();
            atualizaRelogio();
            gambiarra = false;
        }
    }

    return false;
}


function novoJogo() {
    testeIniciar = true;
    gambiarra = false;
    dificuldade = 2.0;
    dificuldadeAntesDoPoder = 2.0;
    testeVida = false;
    testeNovoLvl = false;
    divAlerta.style.display = "none";
    divPlacar.style.display = "none";
    vida = 3;
    gameOverTest = true;
    pontos = 0;
    lvl = 1;
    score = 258;
    lado = 0;
    abertaOuFechado = true;
    direcaoAtual = Direcao.naoDefinida;
    proximaDirecao = Direcao.naoDefinida;
    setaCima = false;
    setaBaixo = false;
    setaDireita = false;
    setaEsquerda = true;
    clearInterval(relogio);
    clearInterval(relogioGhosts);
    relogio = null;
    relogioGhosts = null;
    ghosts.length = 0;
    nGhosts = 0;
    Cenario.mapa = new Array();
    for (i = 0; i < cenarioCriado.length; i++) {
        Cenario.mapa.push(cenarioCriado[i].slice(0));
    }
    nx = Cenario.mapa[0].length;
    ny = Cenario.mapa.length;
    canvas.width = nx * largura;
    canvas.height = ny * largura;
    for (y = 0; y < ny; y++) {
        for (x = 0; x < nx; x++) {
            if (Cenario.mapa[y][x] == Cenario.pacman) {
                px = x;
                py = y;
            }
            if (Cenario.mapa[y][x] == Cenario.ghost) {
                ghosts.push(new Ghost(x, y, Ghost.imagens[nGhosts++]));
            }
        }
    }
    btPausa.disabled = false;
    btPausa.innerHTML = "Iniciar (P)";
    desenharTudo();
}


function onKD(evt) {
    var tecla = evt.keyCode;
    if (relogio != null) {
        switch (tecla) {
            case Teclas.direita:
                evt.preventDefault();
                return setaDireita = true;
            case Teclas.esquerda:
                evt.preventDefault();
                return setaEsquerda = true;
            case Teclas.cima:
                evt.preventDefault();
                return setaCima = true;
            case Teclas.baixo:
                evt.preventDefault();
                return setaBaixo = true;
            case Teclas.MaiorVelocidade:
                evt.preventDefault();
                maiorVelocidade();
                break;
            case Teclas.MenorVelocidade:
                evt.preventDefault();
                menorVelocidade();
                break;
            default :
                break;
        }
    }
    if (Teclas.NovoJogo == tecla) {
        evt.preventDefault();
        novoJogo();
    }
    if (tecla == Teclas.Continuar) {
        evt.preventDefault();
        if (testeNovoLvl) {
            continuaProximoLvl();
        }
        if (testeVida) {
            vidas();
        }
    }
    if (gameOverTest) {
        if (tecla == Teclas.Pausar && !testeNovoLvl && !testeVida){
            evt.preventDefault();
            pausar();
        }
    }
}


function moverPacman() {
    if (setaDireita) {
        proximaDirecao = Direcao.direita;
        setaDireita = false;
    }
    if (setaEsquerda) {
        proximaDirecao = Direcao.esquerda;
        setaEsquerda = false;
    }
    if (setaCima) {
        proximaDirecao = Direcao.cima;
        setaCima = false;
    }
    if (setaBaixo) {
        proximaDirecao = Direcao.baixo;
        setaBaixo = false;
    }

    switch (proximaDirecao) {
        case Direcao.cima:
            if (py - 1 >= 0) {
                if (Cenario.mapa[py - 1][px] != Cenario.parede) {
                    direcaoAtual = proximaDirecao;
                    proximaDirecao = Direcao.naoDefinida;
                }
            } else if (Cenario.mapa[ny - 1][px] != Cenario.parede) {
                direcaoAtual = proximaDirecao;
                proximaDirecao = Direcao.naoDefinida;
            }
            break;
        case Direcao.baixo:
            if (py + 1 < ny) {
                if (Cenario.mapa[py + 1][px] != Cenario.parede) {
                    direcaoAtual = proximaDirecao;
                    proximaDirecao = Direcao.naoDefinida;
                }
            } else if (Cenario.mapa[0][px] != Cenario.parede) {
                direcaoAtual = proximaDirecao;
                proximaDirecao = Direcao.naoDefinida;
            }
            break;
        case Direcao.esquerda:
            if (px - 1 >= 0) {
                if (Cenario.mapa[py][px - 1] != Cenario.parede) {
                    direcaoAtual = proximaDirecao;
                    proximaDirecao = Direcao.naoDefinida;
                }
            } else if (Cenario.mapa[py][nx - 1] != Cenario.parede) {
                direcaoAtual = proximaDirecao;
                proximaDirecao = Direcao.naoDefinida;
            }
            break;
        case Direcao.direita:
            if (px + 1 < nx) {
                if (Cenario.mapa[py][px + 1] != Cenario.parede) {
                    direcaoAtual = proximaDirecao;
                    proximaDirecao = Direcao.naoDefinida;
                }
            } else if (Cenario.mapa[py][0] != Cenario.parede) {
                direcaoAtual = proximaDirecao;
                proximaDirecao = Direcao.naoDefinida;
            }
            break;
    }

    switch (direcaoAtual) {
        case Direcao.cima:
            if (py - 1 >= 0) {
                if (Cenario.mapa[py - 1][px] != Cenario.parede) {
                    py--;
                    lado = 1;
                }
            } else if (Cenario.mapa[ny - 1][px] != Cenario.parede) {
                py = ny - 1;
                lado = 1;
            }
            break;
        case Direcao.baixo:
            if (py + 1 < ny) {
                if (Cenario.mapa[py + 1][px] != Cenario.parede) {
                    py++;
                    lado = 2;
                }
            } else if (Cenario.mapa[0][px] != Cenario.parede) {
                py = 0;
                lado = 2;
            }
            break;
        case Direcao.esquerda:
            if (px - 1 >= 0) {
                if (Cenario.mapa[py][px - 1] != Cenario.parede) {
                    px--;
                    lado = 3;
                }
            } else if (Cenario.mapa[py][nx - 1] != Cenario.parede) {
                px = nx - 1;
                lado = 3;
            }
            break;
        case Direcao.direita:
            if (px + 1 < nx) {
                if (Cenario.mapa[py][px + 1] != Cenario.parede) {
                    px++;
                    lado = 4;
                }
            } else if (Cenario.mapa[py][0] != Cenario.parede) {
                px = 0;
                lado = 4;
            }
            break;
    }
}


function desenharTudo() {

    //Limpar a tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Cenário
    //ctx.fillStyle = "#9999EE";
    for (y = 0; y < ny; y++) {
        for (x = 0; x < nx; x++) {
            if (Cenario.mapa[y][x] == Cenario.parede) {
                ctx.drawImage(parede, x * largura, y * largura, largura, largura);
            } else if (Cenario.mapa[y][x] == Cenario.ponto) {
                ctx.drawImage(ponto, x * largura, y * largura, largura, largura);
            } else if (Cenario.mapa[y][x] == Cenario.poder) {
                ctx.drawImage(poder, x * largura, y * largura, largura, largura);
            }
        }
    }

    if (abertaOuFechado) {
        ctx.drawImage(pacfechado, px * largura, py * largura, largura, largura);
        abertaOuFechado = false;
    } else {
        switch (lado) {
            case 1:
                ctx.drawImage(paccima, px * largura, py * largura, largura, largura);
                break;
            case 2:
                ctx.drawImage(pacbaixo, px * largura, py * largura, largura, largura);
                break;
            case 3:
                ctx.drawImage(pacesquerda, px * largura, py * largura, largura, largura);
                break;
            case 4:
                ctx.drawImage(pacdireita, px * largura, py * largura, largura, largura);
                break;
            default :
                ctx.drawImage(pacfechado, px * largura, py * largura, largura, largura);
                break;
        }
        abertaOuFechado = true;
    }

    ctxScore.clearRect(0, 0, 104, 28);
    ctxScore.font = "16px Arial";
    ctxScore.fillStyle = "#fff";
    ctxScore.fillText("Score: " + pontos, 10, 20);

    ctxLvl.clearRect(0, 0, 104, 28);
    ctxLvl.font = "16px Arial";
    ctxLvl.fillStyle = "#fff";
    ctxLvl.fillText("Level: " + lvl, 10, 20);


    //fantasmas
    for (i = 0; i < ghosts.length; i++) {
        ghosts[i].desenhar(ctx);
    }

}

function moverGhosts() {
    for (i = 0; i < ghosts.length; i++) {
        ghosts[i].mover();
    }

}

novoJogo();