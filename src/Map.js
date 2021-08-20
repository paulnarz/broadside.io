export const settings = {
    width: 0,
    height: 0,
    colors: ["red", "blue"],
    transforms: {
        "N": 180,
        "S": 0,
        "E": 270,
        "W": 90,
    }
}

export function createMap() {
    var map = createDefaultMap();
    //var map = createTestMap();
    settings.width = map.width;
    settings.height = map.height;
    return map;
}

function createDefaultMap() {
    const map_string = `
XX..1111111111X
..............X
...............
...............
.............XX
X.....XX.....XX
XX...XXXX...XXX
XX.............
XX.............
XXX............
XXX............
XXXXXXXXXX00000
XXXXXXXXXX00000
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
            if (square == "0")
                cells.push({ ship: { player: "0", health: 3, dir: "N" } });
            else if (square == "1")
                cells.push({ ship: { player: "1", health: 3, dir: "S" } });
            else if (square == ".")
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

function createTestMap() {
    const cells = [];
    let height = 3;
    let width = 3;

    for (let i = 0; i < width * height; i++) {
        cells[i] = { ship: null };
    }

    cells[0].ship = { player: "1", health: 3, dir: "S" };
    cells[5].ship = { player: "0", health: 3, dir: "N" };
    cells[7].ship = { player: "0", health: 3, dir: "N" };
    cells[8].ship = { player: "0", health: 3, dir: "N" };

    //walls
    //cells[4] = null;

    //for (let i = 0; i < width; i++) {
    //    cells[i].ship = { player: "0", health: 1, dir: "S" };
    //    cells[i + width].ship = { player: "0", health: 1, dir: "S" };
    //    cells[end - i].ship = { player: "1", health: 3, dir: "N" };
    //}

    return {
        width: width,
        height: height,
        cells: cells
    };
}

function createEvenSmallerTestMap() {
    const cells = [];
    let height = 2;
    let width = 3;

    for (let i = 0; i < width * height; i++) {
        cells[i] = { ship: null };
    }

    cells[0].ship = { player: "1", health: 1, dir: "S" };
    cells[5].ship = { player: "0", health: 1, dir: "N" };    

    return {
        width: width,
        height: height,
        cells: cells
    };
}
