export interface SeatFB {
  row: number;
  column: number;
}

export class Seat {
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }

  equals(other: Seat): boolean {
    return this.row === other.row && this.column === other.column;
  }
}
