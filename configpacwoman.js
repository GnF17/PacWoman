var Cenario = function () {
};
Cenario.vazio = 0;
Cenario.parede = 1;
Cenario.poder = 2;
Cenario.ghost = 3;
Cenario.pacman = 4;
Cenario.ponto = 5;

var Teclas = function () {
};
Teclas.cima = 38;
Teclas.baixo = 40;
Teclas.esquerda = 37;
Teclas.direita = 39;
Teclas.Pausar = 80;
Teclas.NovoJogo = 78;
Teclas.Continuar = 13;
Teclas.MaiorVelocidade = 190;
Teclas.MenorVelocidade = 188;

var Direcao = function () {
};
Direcao.naoDefinida = -1;
Direcao.cima = 0;
Direcao.baixo = 1;
Direcao.esquerda = 2;
Direcao.direita = 3;

//Armazena cópia do cenário
Cenario.mapa = null;

//Largura de cada elemanto da matriz
var largura = 16;
var intervalo = 230;

