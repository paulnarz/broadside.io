import { Client } from 'boardgame.io/client';
import { Broadside } from './Game';

const settings = {
    width: 15,
    height: 13,
    colors: ["blue", "red"]
}

class BroadSideClient {
    constructor(rootElement) {
        this.client = Client({ game: Broadside });
        this.client.start();
        this.rootElement = rootElement;
        this.createBoard();
        this.attachListeners();
        this.client.subscribe(state => this.update(state));
        this._selectedCell = null;
        this._selectedId = null;
    }

    createBoard() {
        // Create cells in rows for the Tic-Tac-Toe board.
        const rows = [];
        for (let i = 0; i < settings.height; i++) {
            const cells = [];
            for (let j = 0; j < settings.width; j++) {
                const id = settings.width * i + j;
                cells.push(`<td class="cell" data-id="${id}"></td>`);
            }
            rows.push(`<tr>${cells.join('')}</tr>`);
        }

        // Add the HTML to our app <div>.
        // We’ll use the empty <p> to display the game winner later.
        this.rootElement.innerHTML = `
      <table>${rows.join('')}</table>
      <p class="winner"></p>
    `;
    }

    attachListeners() {
        // This event handler will read the cell id from a cell’s
        // `data-id` attribute and make the `clickCell` move.
        const handleCellClick = event => {
            const id = parseInt(event.target.dataset.id);

            if (this._selectedId === null) {
                this._selectedId = id;
                this._selectedCell = this.rootElement.querySelector('.cell[data-id="' + id + '"]');
                this._selectedCell.classList.add("selected");
            }
            else {
                const x1 = this._selectedId % settings.width;
                const y1 = Math.floor(this._selectedId / settings.width);
                const x2 = id % settings.width;
                const y2 = Math.floor(id / settings.width);
                this._selectedId = null;
                this._selectedCell.classList.remove("selected");
                this._selectedCell = null;

                this.client.moves.moveShip(x1, y1, x2, y2);
            }
        };
        // Attach the event listener to each of the board cells.
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.onclick = handleCellClick;
        });
    }

    update(state) {
        // Get all the board cells.
        const cells = this.rootElement.querySelectorAll('.cell');
        // Update cells to display the values in game state.
        cells.forEach(cell => {
            const cellId = parseInt(cell.dataset.id);
            const gridCell = state.G.cells[cellId];
            this.displayCell(cell, gridCell);
        });
        // Get the gameover message element.
        const messageEl = this.rootElement.querySelector('.winner');
        // Update the element to show a winner if any.
        if (state.ctx.gameover) {
            messageEl.textContent =
                state.ctx.gameover.winner !== undefined
                    ? 'Winner: ' + state.ctx.gameover.winner
                    : 'Draw!';
        } else {
            messageEl.textContent = '';
        }
    }

    displayCell(cell, gridCell) {
        if (!gridCell) {
            cell.textContent = "";
            cell.style.color = "";
            cell.style.background = "#000";
        }
        else if (gridCell.ship) {
            const ship = gridCell.ship;
            cell.textContent = ship.health + " " + ship.dir;
            cell.style.color = settings.colors[ship.player];
            cell.style.background = "";
        }
        else {
            cell.textContent = "";
            cell.style.color = "";
            cell.style.background = "";
        }
    }
}

const appElement = document.getElementById('app');
const app = new BroadSideClient(appElement);