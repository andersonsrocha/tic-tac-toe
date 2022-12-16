import Board from "./src/board.js";
import Player from "./src/player.js";

const data = {
  humanSymbol: "X",
  iaSymbol: "O",
  scorePlayerX: 0,
  scorePlayerO: 0,
  running: false,
};

document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".container");
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const displayInfo = document.querySelector(".display-info");
  const end = document.querySelector(".end");
  const winner = document.querySelector(".winner");
  const scoreboardX = document.querySelector(".scoreboard-player-X");
  const scoreboardO = document.querySelector(".scoreboard-player-O");
  const restartBtn = document.querySelector("#restart");
  const restartGameBtn = document.querySelector("#restart-game");

  const board = new Board();
  // fácil: 1, médio: 4, dificil: -1
  const p = new Player();

  /**
   * Reiniciar o jogo.
   * - Remove a informação do vencedor da tela.
   * - Remove todas as jogadas feitas.
   * - Define a vez como sendo do jogador `X`.
   * - Define o jogo como ativo.
   */
  const restart = () => {
    data.running = false;
    // remove o vencedor da tela
    end.classList.remove("won");
    // remove o preenchimento dos campos
    tiles.forEach((tile) => tile.classList.remove("player-X", "player-O"));
    // reseta a vez do jogador
    displayInfo.innerText = `Vez de X`;
    container.classList.add("player-X");
    container.classList.remove("player-O");
    // reinicia o jogo
    board.reset();
  };

  /**
   * Reiniciar o jogo e o placar.
   * - Remove a informação do vencedor da tela.
   * - Remove todas as jogadas feitas.
   * - Define a vez como sendo do jogador `X`.
   * - Define o jogo como ativo.
   * - Redefine o placar de `X` e `O` para 0.
   */
  const restartGame = () => {
    restart();
    scoreboardX.innerText = "-";
    scoreboardO.innerText = "-";
  };

  /**
   * Verifica quem foi o vencedor ou se ocorreu empate e anuncia.
   */
  const announce = () => {
    const { winner: won } = board.isTerminal();
    switch (won) {
      case "X": {
        const newScore = data.scorePlayerX + 1;
        data.scorePlayerX = newScore;
        scoreboardX.innerText = newScore;
        // announce
        end.classList.add("won");
        winner.innerText = "Jogador X venceu!";
        break;
      }
      case "draw": {
        // announce
        end.classList.add("won");
        winner.innerText = "Empate!";
        break;
      }
      case "O": {
        const newScore = data.scorePlayerO + 1;
        data.scorePlayerO = newScore;
        scoreboardO.innerText = newScore;
        // announce
        end.classList.add("won");
        winner.innerText = "Jogador O venceu!";
        break;
      }
    }
  };

  /**
   * Altera a vez do jogador.
   * - Alterar o display para informar a vez do jogador atual.
   * - Alterar a classe do {@link container} adicionando o novo jogador.
   * - Alterar a classe do {@link container} removendo o antigo jogador.
   *
   * @param {"X"|"O"} currentSymbol símbolo do jogador atual.
   */
  const changePlayer = (currentSymbol) => {
    const { humanSymbol, iaSymbol } = data;
    const oldPlayer = currentSymbol;
    const newPlayer = oldPlayer === humanSymbol ? iaSymbol : humanSymbol;

    displayInfo.innerText = `Vez de ${newPlayer}`;
    // remove a classe antiga
    container.classList.add(`player-${newPlayer}`);
    // adicionar a classe nova
    container.classList.remove(`player-${oldPlayer}`);
  };

  /**
   * Ação executada no clique de um espaço.
   * Valida se a ação pode ser executada e se o jogo está em andamento,
   * se sim, adiciona `X` ou `O` no espaço clicado, atualiza a lista de jogadas,
   * verifica se há um vencedor e altera a vez do jogador.
   *
   * @param {Element} tile elmento html do espaço clicado.
   * @param {number} index posição do espaço clicado.
   */
  const action = (tile, index) => {
    const { humanSymbol, iaSymbol, running } = data;

    if (!running && !board.isTerminal().isTerminal) {
      data.running = true;
      tile.classList.add(`player-${humanSymbol}`);
      board.insert(humanSymbol, index);
      changePlayer(humanSymbol);

      if (board.isTerminal().isTerminal) {
        announce();
        return;
      }

      p.obtainBestMove(board, false, (score) => {
        setTimeout(() => {
          const index = Number(score);
          board.insert(iaSymbol, index);
          tiles[index].classList.add(`player-${iaSymbol}`);

          if (board.isTerminal().isTerminal) announce();

          changePlayer(iaSymbol);
          data.running = false;
        }, 600);
      });
    }
  };

  /**
   * Para cada um dos 9 espaços do jogo, adiciona um evento para ouvir
   * o click no espaço e executar a ação.
   */
  for (const index in tiles) {
    const tile = tiles[index];
    tile.addEventListener("click", () => action(tile, index));
  }

  /**
   * Adicionar ouvinte para o evento de clique no botão de reiniciar o jogo.
   */
  restartBtn.addEventListener("click", restart);

  /**
   * Adicionar ouvinte para o evento de clique no botão de reiniciar
   * completamente o jogo, incluindo o placar.
   */
  restartGameBtn.addEventListener("click", restartGame);
});
