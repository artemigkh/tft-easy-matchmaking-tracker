import {Player} from './Player';

enum Action {
  MATCHED,
  ELIMINATED
}

class GameState {
  eligible: number[];
  ineligible: number[];
  eliminated: number[];

  currentStage: number;
  currentRound: number;

  action: Action;
  actionPlayerId: number;

  constructor(other?: GameState) {
    this.eligible = other && Object.assign([], other.eligible) || [0, 1, 2, 3, 4, 5, 6];
    this.ineligible = other && Object.assign([], other.ineligible) || [];
    this.eliminated = other && Object.assign([], other.eliminated) || [];
    this.currentStage = other && other.currentStage || 2;
    this.currentRound = other && other.currentRound || 1;
  }

  // Return game state after user plays against player with specified ID
  getStateAfterPlayingAgainst(playerId: number): GameState {
    this.action = Action.MATCHED;
    this.actionPlayerId = playerId;

    const newGameState = new GameState(this);

    newGameState.eligible = this.eligible.filter(pId => playerId != pId);
    newGameState.ineligible.push(playerId);
    if (newGameState.eligible.length < 3) {
      newGameState.eligible.push(newGameState.ineligible.shift());
    }

    newGameState.incrementRound();
    return newGameState;
  }

  // Return game state after a player with specified ID is eliminated
  getStateAfterEliminated(playerId: number): GameState {
    this.action = Action.ELIMINATED;
    this.actionPlayerId = playerId;

    const newGameState = new GameState(this);
    newGameState.ineligible = [];

    newGameState.eligible = this.eligible.filter(pId => playerId != pId);
    this.ineligible.forEach(pId => {
      if (playerId != pId) {
        newGameState.eligible.push(pId);
      }
    });

    newGameState.eliminated.push(playerId);

    return newGameState;
  }

  // Return game state after playing against a ghost army
  getStateAfterPlayingGhost(): GameState {
    this.action = Action.MATCHED;
    this.actionPlayerId = -1;
    const newGameState = new GameState(this);

    newGameState.incrementRound();
    return newGameState;
  }

  getStageRoundString(): string {
    return `${this.currentStage}-${this.currentRound}`;
  }

  incrementRound(): void {
    if (this.currentRound == 3) {
      this.currentRound = 5;
    } else if (this.currentRound == 6) {
      this.currentRound = 1;
      this.currentStage++;
    } else {
      this.currentRound++;
    }
  }
}

export class Match {
  players: Player[] = [];
  matchHistory: GameState[] = [];
  currentGameState: GameState;

  static fromPlayersString(playersString: string): Match {
    return new Match(playersString.split(','));
  }

  constructor(players: string[]) {
    if (players.length != 7) {
      console.error('Must have 7 players in a match');
      return;
    }

    players.forEach((playerName: string, index: number) => {
      this.players.push(new Player(playerName, index));
    });
    this.currentGameState = new GameState();
  }

  getEligiblePlayers(): Player[] {
    return this.currentGameState.eligible.map(pId => this.players[pId]);
  }

  getIneligiblePlayers(): Player[] {
    return this.currentGameState.ineligible.map(pId => this.players[pId]);
  }

  getEliminatedPlayers(): Player[] {
    return this.currentGameState.eliminated.map(pId => this.players[pId]);
  }

  getStageRoundString(): string {
    return this.currentGameState.getStageRoundString();
  }

  playerMatched(player: Player): void {
    console.log('player matched called');
    this.matchHistory.push(this.currentGameState);
    this.currentGameState = this.currentGameState.getStateAfterPlayingAgainst(player.playerId);
  }

  playerEliminated(player: Player): boolean {
    console.log('player eliminated called');
    this.matchHistory.push(this.currentGameState);
    this.currentGameState = this.currentGameState.getStateAfterEliminated(player.playerId);

    // Return false to avoid default browser action for right clicking
    return false;
  }

  ghostMatched(): void {
    this.matchHistory.push(this.currentGameState);
    this.currentGameState = this.currentGameState.getStateAfterPlayingGhost();
  }

  undoLastAction(): void {
    if (this.matchHistory.length > 0) {
      this.currentGameState = this.matchHistory.pop();
    }
  }

  getEventHistory(): string[] {
    return ['Game Created'].concat(this.matchHistory.map(gameState => {
      switch (gameState.action) {
        case Action.MATCHED:
          return `${gameState.getStageRoundString()}: Played Against ${this.getPlayerString(gameState)}`;
        case Action.ELIMINATED:
          return `${gameState.getStageRoundString()}: Player ${this.getPlayerString(gameState)} eliminated`;
      }
    }));
  }

  private getPlayerString(gameState: GameState): string {
    if (gameState.actionPlayerId >= 0) {
      return this.players[gameState.actionPlayerId].name;
    } else {
      return 'a ghost army';
    }
  }
}
