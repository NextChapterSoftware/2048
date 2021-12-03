import { TilePosition, Tile } from "./tile";
import { Direction } from "./enums";

export class GameEvent {}

export class TileMergeEvent extends GameEvent {
  constructor(
    public oldPosition: TilePosition,
    public mergePosition: TilePosition,
    public newValue: number
  ) {
    super();
  }
}

export class TileMoveEvent extends GameEvent {
  constructor(
    public oldPosition: TilePosition,
    public newPosition: TilePosition,
    public value: number,
    public shouldBeDeleted: boolean
  ) {
    super();
  }
}

export class TileCreatedEvent extends GameEvent {
  constructor(public tile: Tile) {
    super();
  }
}

export class TileCountEvent extends GameEvent {
  constructor(public tile: Tile) {
    super();
  }
}

export class TileDidALittleDanceEvent extends GameEvent { 
  constructor(public danceName: string) {
    super() 
  }
}

export class TileDeletedEvent extends GameEvent {
  constructor(public position: TilePosition) {
    super();
  }
}

export class TilesNotMovedEvent extends GameEvent {
  constructor(public direction: Direction) {
    super();
  }
}

export class GameStartedEvent extends GameEvent {}

export class GameOverEvent extends GameEvent {}
