import Board from "./board.js";

export default class Player {
  /**
   * @param {number} [maxDepth=-1] valor máximo de profundidade.
   */
  constructor(maxDepth = -1) {
    /** @type {number} */
    this.maxDepth = maxDepth;
    /** @type {Map<any, any>} */
    this.nodes = new Map();
  }

  /**
   * Função responsável por obter o melhor movimento possível
   * com base no algoritmo minimax.
   *
   * @param {Board} board tabuleiro do jogo atual.
   * @param {boolean} maximizing indica se o jogador atual é o maximizador.
   * @param {function} callback uma função anônima que será chamada no final da chamada.
   * @param {number} [depth=0] nível da profundidade do nó atual.
   *
   * @returns retorna a melhor posição para incluir o próximo passo no tabuleiro.
   */
  obtainBestMove(board, maximizing = true, callback = () => {}, depth = 0) {
    // se for um novo movimento, limpa os nós.
    if (depth == 0) this.nodes.clear();

    const { isTerminal, winner } = board.isTerminal();
    // se a partida tiver encontrado um valor terminal,
    // ou seja, vencedor ou empate, retorna um valor heurístico.
    if (isTerminal || depth == this.maxDepth) {
      if (winner === "X") {
        return 100 - depth;
      } else if (winner === "O") {
        return -100 + depth;
      }

      return 0;
    }
    // se for maximizador
    if (maximizing) {
      // o menor valor possível
      let score = -100;
      const emptyCells = board.obtainAvailableMoves();
      // percorrer todas as celulas vazias
      for (const index of emptyCells) {
        // cria uma copia do tabuleiro atual
        const copy = new Board([...board.state]);
        // insere o símbolo que representa o valor máximo na celula vazia
        copy.insert("X", index);
        // recursivamente chama o método para obter o melhor movimento e avaliar
        // as possíveis jogadas do outro jogador
        const node = this.obtainBestMove(copy, false, callback, depth + 1);
        // atualiza o melhor valor
        score = Math.max(score, node);

        if (depth == 0) {
          const moves = this.nodes.has(node) ? `${this.nodes.get(node)}, ${index}` : index;
          this.nodes.set(node, moves);
        }
      }

      if (depth == 0) {
        let value;
        if (typeof this.nodes.get(score) == "string") {
          const arr = this.nodes.get(score).split(",");
          const rand = Math.floor(Math.random() * arr.length);
          value = arr[rand];
        } else {
          value = this.nodes.get(score);
        }

        callback(value);
        return value;
      }

      return score;
    }
    // se for minimizador
    if (!maximizing) {
      // o maior valor possível
      let score = 100;
      const emptyCells = board.obtainAvailableMoves();
      // percorrer todas as celulas vazias
      for (const index of emptyCells) {
        // cria uma copia do tabuleiro atual
        const copy = new Board([...board.state]);
        // insere o símbolo que representa o valor máximo na celula vazia
        copy.insert("O", index);
        // recursivamente chama o método para obter o melhor movimento e avaliar
        // as possíveis jogadas do outro jogador
        const node = this.obtainBestMove(copy, true, callback, depth + 1);
        // atualiza o melhor valor
        score = Math.min(score, node);

        if (depth == 0) {
          const moves = this.nodes.has(node) ? `${this.nodes.get(node)}, ${index}` : index;
          this.nodes.set(node, moves);
        }
      }

      if (depth == 0) {
        let value;
        if (typeof this.nodes.get(score) == "string") {
          const arr = this.nodes.get(score).split(",");
          const rand = Math.floor(Math.random() * arr.length);
          value = arr[rand];
        } else {
          value = this.nodes.get(score);
        }

        callback(value);
        return value;
      }

      return score;
    }
  }
}
