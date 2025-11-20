# Sistemas Multimidia zeEntregas — Jogo (Phaser + HTML estático)

Este repositório contém um pequeno jogo desenvolvido com Phaser e HTML/CSS/JS estático. A página principal é `index.html` e o jogo carrega os scripts em `app.js` e os utilitários em `utils/`.

Descrição
---------
Jogo em HTML estático que utiliza a biblioteca Phaser para renderização e lógica do jogo. Os recursos do jogo (sprites, imagens) estão em `assets/` e a lógica auxiliar em `utils/`.

Requisitos
---------
- `Python 3` (para servir os arquivos estaticamente com um servidor HTTP simples)
- Navegador moderno (Chrome, Firefox, Edge)
- Conexão com a internet somente se `index.html` carregar Phaser via CDN (caso contrário, o arquivo local `phaser.js` deve estar presente)

Como executar (rápido)
----------------------
1. Abra um terminal na pasta do projeto (onde está `index.html`).
2. Execute o servidor HTTP na porta 8080:

```
python3 -m http.server 8080
```

3. Abra o navegador em `http://localhost:8080` (ou `http://127.0.0.1:8080`).
4. Para parar o servidor: pressione `Ctrl+C` no terminal.

Observações:
- Se a porta `8080` estiver ocupada, escolha outra (por exemplo `8000`) e ajuste a URL correspondente.

Estrutura do projeto
--------------------
- `index.html` — página principal que inicializa o jogo
- `app.js` — script principal com a lógica do jogo (Phaser)
- `style.css` — estilos da página
- `assets/` — recursos do jogo (imagens, sprites, som)
	- `biker/`, `car/`, `npc/` — subpastas com sprites
- `utils/` — módulos utilitários
	- `Player.js`, `Car.js`, `NPC.js`

Dicas para desenvolvimento
-------------------------
- Para desenvolvimento rápido, use o comando `python3 -m http.server 8080` como acima.
- Se o jogo não carregar, abra o console do navegador (F12) e verifique erros de `404` (recursos não encontrados) ou erros de JavaScript.
- Se `Phaser` for carregado via CDN e você estiver sem internet, troque para uma cópia local de `phaser.js` ou adicione a biblioteca localmente em `libs/` e atualize `index.html`.

Contribuições
-------------
Pull requests e issues são bem-vindos. Abra uma issue descrevendo o problema ou melhoria antes de enviar mudanças maiores.

---

Arquivo gerado/atualizado em: 2025-11-20
