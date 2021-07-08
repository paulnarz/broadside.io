export function createMap() {
    const map_string = `
00............0
..............0
...............
...............
.............00
0.....00.....00
00...0000...000
00.............
00.............
000............
000............
0000000000.....
0000000000.....
`;

    const cells = [];

    let lines = map_string.trim().replace(/\n/g, '<br/>').replace(/\s/g, '').split('<br/>');
    let height = lines.length;
    let width = 0;

    for (let y = 0; y < height; y++) {
        if (lines[y].length > width)
            width = lines[y].length;
    }

    for (let y = 0; y < height; y++) {
        let line = lines[y];
        console.log(line);
        for (let x = 0; x < width; x++) {
            let square = line[x];
            if (square == ".")
                cells.push({ ship: null });
            else
                cells.push(null);
        }
    }    

    return {
        width: width,
        height: height,
        cells: cells
    };
}

export function createTestMap() {
    const cells = [];
    let height = 5;
    let width = 5;

    for (let i = 0; i < width * height; i++) {
        cells[i] = { ship: null };
    }

    let end = height * width - 1;

    for (let i = 0; i < 2; i++) {
        cells[i].ship = { player: 0, health: 3, dir: "S" };
        cells[end - i].ship = { player: 1, health: 3, dir: "N" };
    }

    //walls
    cells[10] = null;
    cells[11] = null;
    cells[13] = null;
    cells[14] = null;

    //for (let i = 0; i < width; i++) {
    //    cells[i].ship = { player: 0, health: 1, dir: "S" };
    //    cells[i + width].ship = { player: 0, health: 1, dir: "S" };
    //    cells[end - i].ship = { player: 1, health: 3, dir: "N" };
    //}

    return {
        width: width,
        height: height,
        cells: cells
    };
}