/**
 * Board indexes
 *
 * [0] [1] [2]
 * [3] [4] [5]
 * [6] [7] [8]
 */
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default class Board {
  /**
   * @param {Array<string>} state tabuleiro com nove espaços.
   */
  constructor(state = Array(9).fill("")) {
    /** @type {Array<string>} */
    this.state = state;
  }

  /**
   * Função responsável por indicar se o tabuleiro está vazio.
   *
   * @returns retorna se o tabuleiro está totalmente vazio.
   */
  isEmpty() {
    return this.state.every((item) => !item);
  }

  /**
   * Função responsável por indicar se o tabuleiro está preenchido.
   *
   * @returns retorna se o tabuleiro está totalmente preenchido.
   */
  isFull() {
    return this.state.every((item) => item);
  }

  /**
   * Função responsável por inserir um símbolo (`X` ou `O`) no tabuleiro.
   *
   * @param {"X"|"O"} symbol símbolo do jogador atual.
   * @param {number} index posição dentro do tabuleiro onde vai ser inserido.
   */
  insert(symbol, index) {
    if (!this.state[index]) this.state[index] = symbol;
  }

  /**
   * Função responsável por resetar o tabuleiro.
   */
  reset() {
    this.state = Array(9).fill("");
  }

  /**
   * Função responsável por obter todos os índices dos campos vazios
   * no tabuleiro.
   *
   * @returns retorna todas os índices que estão vazio no tabuleiro.
   */
  obtainAvailableMoves() {
    return this.state.map((item, i) => (!item ? i : "")).filter((x) => typeof x !== "string");
  }

  /**
   * Função responsável por verificar se há algum vencedor, se a partida terminou
   * empatada ou se ainda não terminou.
   *
   * @returns retorna um objeto contendo `isTerminal` e `winner`.
   */
  isTerminal() {
    if (this.isEmpty()) return { isTerminal: false };

    // verifica se houve vencedor
    for (const condition of winConditions) {
      const value1 = this.state[condition[0]];
      const value2 = this.state[condition[1]];
      const value3 = this.state[condition[2]];

      if (value1 === "" || value2 === "" || value3 === "") {
        continue;
      }

      if (value1 === value2 && value2 === value3) {
        return { isTerminal: true, winner: value1 };
      }
    }

    if (this.isFull()) return { isTerminal: true, winner: "draw" };

    return { isTerminal: false };
  }
}
