import { INVALID_MOVE } from 'boardgame.io/core';
import { settings } from './Map';
import { createMap } from './Map';

export const Broadside = {
    setup: () => {
        var map = createMap();

        console.log(map);

        return {
            cells: map.cells
        };
    },

    turn: {
        moveLimit: 1,
    },

    moves: {
        moveShip: (G, ctx, x1, y1, x2, y2) => {
            const sourceIndex = getIndex(x1, y1);
            const destIndex = getIndex(x2, y2);

            if (sourceIndex == -1)
                return INVALID_MOVE;

            if (destIndex == -1)
                return INVALID_MOVE;

            if (x1 === x2 && y1 === y2)
                return INVALID_MOVE;

            if (x1 !== x2 && y1 !== y2)
                return INVALID_MOVE;

            const sourceCell = G.cells[sourceIndex];

            if (!sourceCell || !sourceCell.ship)
                return INVALID_MOVE;

            const ship = sourceCell.ship;

            if (ship.player != ctx.currentPlayer)
                return INVALID_MOVE;

            if (!checkPath(G, x1, y1, x2, y2))
                return INVALID_MOVE;

            const destCell = G.cells[destIndex];

            //do the move
            destCell.ship = ship;
            sourceCell.ship = null;

            if (y2 < y1) {
                ship.dir = "N";
            }
            else if (x2 > x1) {
                ship.dir = "E";
            }
            else if (y2 > y1) {
                ship.dir = "S";
            }
            else if (x2 < x1) {
                ship.dir = "W";
            }

            if (isNS(ship.dir)) {
                doDamage(G, ship, x2 - 1, y2);
                doDamage(G, ship, x2 + 1, y2);
            }
            else {
                doDamage(G, ship, x2, y2 - 1);
                doDamage(G, ship, x2, y2 + 1);
            }

            if (ship.health <= 0) {
                destCell.ship = null;
            }
        },
    },

    endIf: (G, ctx) => {
        var total = [0, 0];

        G.cells.forEach(cell => {
            if (cell && cell.ship)
                total[cell.ship.player]++;
        });

        if (total[0] == 0 && total[1] == 0)
            return { draw: true };

        if (total[0] == 0)
            return { winner: 1 };

        if (total[1] == 0)
            return { winner: 0 };
    },

    ai: {
        enumerate: (G, ctx) => {
            let moves = [];

            for (let y = 0; y < settings.height; y++) {
                for (let x = 0; x < settings.width; x++) {
                    var cell = getCell(G, x, y);
                    if (cell && cell.ship && cell.ship.player == ctx.currentPlayer) {
                        availableMoves(G, x, y, (x2, y2) => { moves.push({ move: 'moveShip', args: [x, y, x2, y2] }); });
                    }
                }
            }

            return moves;
        },

        XXobjectives: () => ({
            'less_damage': {
                checker: (G, ctx) => {                    
                    var otherHealth = 0;
                    var otherShips = 0;
                    var myHealth = 0;
                    var myShips = 0;
                    for (let y = 0; y < settings.height; y++) {
                        for (let x = 0; x < settings.width; x++) {
                            var cell = getCell(G, x, y);
                            if (cell && cell.ship && cell.ship.player == ctx.currentPlayer) {
                                myHealth += cell.ship.health;
                                myShips++;
                            }
                            if (cell && cell.ship && cell.ship.player != ctx.currentPlayer) {
                                otherHealth += cell.ship.health;
                                otherShips++;
                            }
                        }
                    }
                    if (myHealth > otherHealth || myShips > otherShips)
                        return true;
                    return false;
                },
                weight: 10,
            },
        })
    }
};

function availableMoves(G, x, y, func) {
    availablePath(G, x, y, 1, 0, func);
    availablePath(G, x, y, -1, 0, func);
    availablePath(G, x, y, 0, 1, func);
    availablePath(G, x, y, 0, -1, func);
}

function availablePath(G, x, y, dx, dy, func) {
    while (true) {
        x += dx;
        y += dy;
        let cell = getCell(G, x, y);

        if (!cell || cell.ship)
            break;

        func(x, y);
    }
}
    
function checkPath(G, x1, y1, x2, y2) {
    const dx = Math.sign(x2 - x1);
    const dy = Math.sign(y2 - y1);
    let cx = x1;
    let cy = y1;
    while (cx != x2 || cy != y2) {
        cx += dx;
        cy += dy;
        let cell = getCell(G, cx, cy);
        if (!cell || cell.ship)
            return false;
    }
    return true;
}

function doDamage(G, ship, x, y) {
    const other = getCell(G, x, y);
    if (other && other.ship && other.ship.player != ship.player) {        
        if (isNS(ship.dir) == isNS(other.ship.dir)) {
            ship.health--;
        }
        other.ship.health--;
        if (other.ship.health <= 0) {
            other.ship = null;
        }
    }
}

function isNS(dir) {
    if (dir == "N" || dir == "S")
        return true;
    return false;
}

function getIndex(x, y) {
    if (x < 0)
        return -1;
    if (x >= settings.width)
        return -1;
    if (y < 0)
        return -1;
    if (y >= settings.height)
        return -1;

    return y * settings.width + x;
}

function getCell(G, x, y) {
    var index = getIndex(x, y);

    if (index === -1)
        return null;

    return G.cells[index];
}