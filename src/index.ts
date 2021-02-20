const gridDiv: HTMLDivElement = document.getElementById("grid")!;
let started: boolean = false;
let interval: number;
const INTERVAL_DURATION = 500;

const ROWS = 25,
	COLS = 50;

let mainGrid: number[][] = new Array(ROWS)
	.fill(undefined)
	.map(() => new Array(COLS).fill(undefined).map(() => 0));

const leftClick = (e: MouseEvent) => {
	(<HTMLDivElement>e.target).style.backgroundColor = "black";
	const r: number = Number((<HTMLDivElement>e.target).getAttribute("row"));
	const c: number = Number((<HTMLDivElement>e.target).getAttribute("col"));

	mainGrid[r][c] = 1;
};

const rightClick = (e: MouseEvent) => {
	e.preventDefault();

	(<HTMLDivElement>e.target).style.backgroundColor = "white";
	const r: number = Number((<HTMLDivElement>e.target).getAttribute("row"));
	const c: number = Number((<HTMLDivElement>e.target).getAttribute("col"));

	mainGrid[r][c] = 0;
};

mainGrid.forEach((row, ri) => {
	const gridRow: HTMLDivElement = document.createElement("div");
	gridRow.style.display = "flex";

	row.forEach((col, ci) => {
		const cell: HTMLDivElement = document.createElement("div");
		cell.style.height = "20px";
		cell.style.width = "20px";
		cell.style.border = "1px solid grey";
		cell.setAttribute("row", String(ri));
		cell.setAttribute("col", String(ci));
		cell.className = "cell";

		cell.addEventListener("click", leftClick);
		cell.addEventListener("contextmenu", rightClick);

		gridRow.appendChild(cell);
	});

	gridDiv.appendChild(gridRow);
});

const getNumberOfAliveNeighbors = (row: number, col: number): number => {
	const colAdder: number[] = [col - 1, col, col + 1];
	const rowAdder: number[][] = [
		[-1, 0, 1],
		[-1, 1],
		[-1, 0, 1]
	];
	let numNeighbors: number = 0;

	colAdder.forEach((cAdder, index) => {
		if (cAdder > -1 && cAdder < COLS) {
			rowAdder[index].forEach(rAdder => {
				if (row + rAdder > -1 && row + rAdder < ROWS) {
					if (mainGrid[row + rAdder][cAdder] === 1) {
						numNeighbors += 1;
					}
				}
			});
		}
	});

	return numNeighbors;
};

const display = (tempGrid: number[][]) => {
	const allCells: NodeList = document.querySelectorAll(".cell")!;

	allCells.forEach(cell => {
		const r: number = Number((<HTMLDivElement>cell).getAttribute("row"));
		const c: number = Number((<HTMLDivElement>cell).getAttribute("col"));

		(<HTMLDivElement>cell).style.backgroundColor =
			tempGrid[r][c] === 1 ? "black" : "white";
	});
};

const startGame = (): void => {
	let tempGrid: number[][] = mainGrid.map(r => [...r]);

	for (let row = 0; row < ROWS; row++) {
		for (let col = 0; col < COLS; col++) {
			let numNeighbors = getNumberOfAliveNeighbors(row, col);

			if (mainGrid[row][col] === 1 && (numNeighbors < 2 || numNeighbors > 3)) {
				tempGrid[row][col] = 0;
			} else if (
				mainGrid[row][col] === 1 &&
				(numNeighbors === 2 || numNeighbors === 3)
			) {
				tempGrid[row][col] = 1;
			} else if (mainGrid[row][col] === 0 && numNeighbors === 3) {
				tempGrid[row][col] = 1;
			}
		}
	}
	display(tempGrid);
	mainGrid = tempGrid.map(r => [...r]);
};

const startTheThing = () => {
	if (started) {
		interval = setInterval(() => {
			startGame();
		}, INTERVAL_DURATION);
	}
};

document.getElementById("start")?.addEventListener("click", (e: MouseEvent) => {
	started = !started;

	if (!started) {
		clearInterval(interval);
	} else {
		startTheThing();
	}

	(<HTMLButtonElement>e.target).innerText = started ? "Stop" : "Start";
});

document.getElementById("clear")?.addEventListener("click", () => {
	started = false;

	mainGrid = new Array(ROWS)
		.fill(undefined)
		.map(() => new Array(COLS).fill(undefined).map(() => 0));

	display(mainGrid);
});
