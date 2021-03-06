import "core-js/es6/promise";
import * as Mousetrap from "mousetrap";
import * as Hammer from "hammerjs";

import { Direction } from "game/enums";
import { Game2048 } from "game/game2048";
import { DefaultRandom } from "helpers/random";
import { RenderConsole } from "render-console/render-console";
import { RenderSVG } from "render-svg/render-svg";
import { ensure } from "helpers/syntax";

import {
  enableNavbarToggle,
  toggleMainNavbar,
  triggerModal
} from "styles/bulma-helpers";

import "styles/bulma.sass";
import "styles/open-iconic.css";
import "styles/app.less";

const GAME_STATE_LOCALSTORAGE_KEY = "game_state_11";

async function gameMain() {
  enableNavbarToggle();
  ensure(document.getElementById("loading-indicator")).remove();
  ensure(document.getElementById("game-content")).style.visibility = "visible";

  console.log("Main called")

  const game = new Game2048(4, new DefaultRandom());
  const renderConsole = new RenderConsole(game);
  const renderSVG = new RenderSVG(game);
  const moveAction = function(direction: Direction) {
    return function() {
      game.queueAction({ type: "MOVE", direction });
    };
  };

  Mousetrap.bind("up", moveAction(Direction.Up));
  Mousetrap.bind("down", moveAction(Direction.Down));
  Mousetrap.bind("left", moveAction(Direction.Left));
  Mousetrap.bind("right", moveAction(Direction.Right));

  ensure(document.getElementById("btn-up")).addEventListener(
    "click",
    moveAction(Direction.Up)
  );
  ensure(document.getElementById("btn-down")).addEventListener(
    "click",
    moveAction(Direction.Down)
  );
  ensure(document.getElementById("btn-left")).addEventListener(
    "click",
    moveAction(Direction.Left)
  );
  ensure(document.getElementById("btn-right")).addEventListener(
    "click",
    moveAction(Direction.Right)
  );
  ensure(document.getElementById("btn-new-game")).addEventListener(
    "click",
    function() {
      game.queueAction({ type: "START", serializedState: "" });
      toggleMainNavbar();
    }
  );
  ensure(document.getElementById("btn-about")).addEventListener(
    "click",
    function() {
      toggleMainNavbar();
      triggerModal("modal-about");
    }
  );

  const hammer = new Hammer(document.body, {
    recognizers: [[Hammer.Swipe, { direction: Hammer.DIRECTION_ALL }]]
  });
  hammer.on("swipe", function(e) {
    let dir;
    switch (e.direction) {
      case Hammer.DIRECTION_UP:
        dir = Direction.Up;
        break;
      case Hammer.DIRECTION_DOWN:
        dir = Direction.Down;
        break;
      case Hammer.DIRECTION_LEFT:
        dir = Direction.Left;
        break;
      case Hammer.DIRECTION_RIGHT:
        dir = Direction.Right;
        break;
    }
    if (dir) {
      game.queueAction({ type: "MOVE", direction: dir });
    }
  });

  await Promise.all([renderConsole.init(), renderSVG.init()]);
  game.queueAction({
    type: "START",
    serializedState:
      window.localStorage.getItem(GAME_STATE_LOCALSTORAGE_KEY) || ""
  });
  while (true) {
    const gameUpdates = await game.processAction();
    const serializedState = game.serialize();
    window.localStorage.setItem(GAME_STATE_LOCALSTORAGE_KEY, serializedState);
    await Promise.all([
      renderConsole.update(gameUpdates),
      renderSVG.update(gameUpdates)
    ]);
  }
}

(window as any).game2048 = {
  init: gameMain
};
