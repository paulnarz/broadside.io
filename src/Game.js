import { INVALID_MOVE } from 'boardgame.io/core';

const settings = {
    width: 5,
    height: 5
}

export const Broadside = {
    setup: () => {
        const cells = Array(settings.width * settings.height).fill(null); 

        let bottom = (settings.height - 1) * settings.width;

        for (let i = 0; i < settings.width; i++) {
            cells[i] = { player: 0, health: 3, dir: "S" };
            cells[bottom + i] = { player: 1, health: 3, dir: "N" };
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
            if (x1 < 0 || x1 >= settings.width)
                return INVALID_MOVE;

            if (x2 < 0 || x2 >= settings.width)
                return INVALID_MOVE;

            if (y1 < 0 || y1 >= settings.height)
                return INVALID_MOVE;

            if (y2 < 0 || y2 >= settings.height)
                return INVALID_MOVE;

            if (x1 === x2 && y1 === y2)
                return INVALID_MOVE;

            if (x1 !== x2 && y1 !== y2)
                return INVALID_MOVE;

            const sourceIndex = y1 * settings.width + x1;
            const destIndex = y2 * settings.width + x2;

            const source = G.cells[sourceIndex];

            if (!source)
                return INVALID_MOVE;

            if (source.player != ctx.currentPlayer)
                return INVALID_MOVE;

            const dest = G.cells[destIndex];

            if (dest)
                return INVALID_MOVE;

            G.cells[destIndex] = G.cells[sourceIndex];
            G.cells[sourceIndex] = null;

            if (y2 < y1) {
                source.dir = "N";
            }
            else if (x2 > x1) {
                source.dir = "E";
            }
            else if (y2 > y1) {
                source.dir = "S";
            }
            else if (x2 < x1) {
                source.dir = "W";
            }
        },
    },
};