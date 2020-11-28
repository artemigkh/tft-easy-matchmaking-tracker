export class Player {
  name: string;
  playerId: number;
  notes = '';

  constructor(name: string, playerId: number) {
    this.name = name;
    this.playerId = playerId;
  }
}
