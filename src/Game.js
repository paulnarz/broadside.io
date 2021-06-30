import { INVALID_MOVE } from 'boardgame.io/core';

const settings = {
    width: 5,
    height: 5
}

export const Broadside = {
    setup: () => {
        const cells = [];

        for (let i = 0; i < settings.width * settings.height; i++) {
            cells[i] = { ship: null };
        }

        let bottom = (settings.height - 1) * settings.width;

        for (let i = 0; i < settings.width; i++) {
            cells[i].ship = { player: 0, health: 3, dir: "S" };
            cells[bottom + i].ship = { player: 1, health: 3, dir: "N" };
        }
             
        return {
            cells: cells
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
            
            if (!sourceCell.ship)
                return INVALID_MOVE;

            const ship = sourceCell.ship;

            if (ship.player != ctx.currentPlayer)
                return INVALID_MOVE;

            const destCell = G.cells[destIndex];

            if (destCell.ship)
                return INVALID_MOVE;

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
};

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