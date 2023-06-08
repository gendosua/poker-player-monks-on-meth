export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    betCallback(this.generateRandomInteger(250, 500));
  }

  private generateRandomInteger(min: number, max: number): number {
    return Math.floor(min + Math.random()*(max - min + 1))
  }

  public showdown(gameState: any): void {

  }
};

export default Player;
