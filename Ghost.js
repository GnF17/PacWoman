var Ghost = function (x, y, imagem) {

    this.xi = x;
    this.yi = y;
    this.x = x;
    this.y = y;
    this.imagem = imagem;

    this.direcaoAtual = Direcao.naoDefinida;

    //metodos dinamicos
    this.desenhar = function (ct) {
        if (this.assustado == 0) {
            this.imagem = imagem;
            ct.drawImage(this.imagem, this.x * largura, this.y * largura, largura, largura);
        } else if (this.assustado < 11) {
            if (this.assustado % 2 == 0) {
                this.imagem = new Image();
                this.imagem.src = "img/enemy6.gif";
                ct.drawImage(this.imagem, this.x * largura, this.y * largura, largura, largura);
            } else {
                this.imagem = new Image();
                this.imagem.src = "img/enemy5.gif";
                ct.drawImage(this.imagem, this.x * largura, this.y * largura, largura, largura);
            }
        } else {
            this.imagem = new Image();
            this.imagem.src = "img/enemy5.gif";
            ct.drawImage(this.imagem, this.x * largura, this.y * largura, largura, largura);
        }
    };
    this.assustado = 0;

    this.assustar = function () {
        this.assustado = 30;
        switch (this.direcaoAtual) {
            case Direcao.cima:
                this.direcaoAtual = Direcao.baixo;
                break;
            case Direcao.baixo:
                this.direcaoAtual = Direcao.cima;
                break;
            case Direcao.esquerda:
                this.direcaoAtual = Direcao.direita;
                break;
            case Direcao.direita:
                this.direcaoAtual = Direcao.esquerda;
                break;
        }
    }

    this.devorado = function () {
        this.assustado = 0;
        this.x = this.xi;
        this.y = this.yi;
    }

    this.listaDirecoes = new Array();

    this.checarDirecoes = function () {
        this.listaDirecoes.length = 0;
        if (this.direcaoAtual != Direcao.naoDefinida) {
            this.listaDirecoes.push(this.direcaoAtual);
        }
        if (this.direcaoAtual != Direcao.cima && this.direcaoAtual != Direcao.baixo) {
            this.listaDirecoes.push(Direcao.cima);
            this.listaDirecoes.push(Direcao.baixo);
        }
        if (this.direcaoAtual != Direcao.esquerda && this.direcaoAtual != Direcao.direita) {
            this.listaDirecoes.push(Direcao.esquerda);
            this.listaDirecoes.push(Direcao.direita);
        }
        var i = 0;
        while (i < this.listaDirecoes.length) {
            var remover = false;
            switch (this.listaDirecoes[i]) {
                case Direcao.cima:
                    if (this.y <= 1) {
                        remover = true;
                    } else {
                        if (Cenario.mapa[this.y - 1][this.x] == Cenario.parede) {
                            remover = true;
                        }
                    }
                    break;
                case Direcao.baixo:
                    if (this.y >= ny - 2) {
                        remover = true;
                    } else {
                        if (Cenario.mapa[this.y + 1][this.x] == Cenario.parede) {
                            remover = true;
                        }
                    }
                    break;
                case Direcao.esquerda:
                    if (this.x <= 1) {
                        remover = true;
                    } else {
                        if (Cenario.mapa[this.y][this.x - 1] == Cenario.parede) {
                            remover = true;
                        }
                    }
                    break;
                case Direcao.direita:
                    if (this.x >= nx - 2) {
                        remover = true;
                    } else {
                        if (Cenario.mapa[this.y][this.x + 1] == Cenario.parede) {
                            remover = true;
                        }
                    }
                    break;
            }
            if (remover) {
                this.listaDirecoes.splice(i, 1);
            } else {
                i++;
            }
        }
    };

    this.mover = function () {
        if (this.assustado > 0) {
            this.assustado--;
        }
        this.checarDirecoes();
        var movimento = Direcao.naoDefinida;
        var aleatorio = Math.random();
        if (aleatorio < Ghost.chanceDeMovIgual || this.listaDirecoes.length == 1) {
            movimento = this.listaDirecoes[0];
        } else {
            chance = (1 - Ghost.chanceDeMovIgual) / (this.listaDirecoes.length - 1);
            for (ca = 1; ca < this.listaDirecoes.length; ca++) {
                if (aleatorio < Ghost.chanceDeMovIgual + (ca * chance)) {
                    movimento = this.listaDirecoes[ca];
                    break;
                }
            }
        }
        this.direcaoAtual = movimento;
        switch (movimento) {
            case Direcao.cima:
                this.y--;
                break;
            case Direcao.baixo:
                this.y++;
                break;
            case Direcao.esquerda:
                this.x--;
                break;
            case Direcao.direita:
                this.x++;
                break;
            default:
                break;
        }
    };
};

Ghost.chanceDeMovIgual = 0.50;

Ghost.imagens = new Array();
var img = new Image();
img.src = "img/enemy1.gif";
Ghost.imagens.push(img);
var img = new Image();
img.src = "img/enemy2.gif";
Ghost.imagens.push(img);
var img = new Image();
img.src = "img/enemy3.gif";
Ghost.imagens.push(img);
var img = new Image();
img.src = "img/enemy4.gif";
Ghost.imagens.push(img);
var img = new Image();
img.src = "img/enemy1.gif";
Ghost.imagens.push(img);


