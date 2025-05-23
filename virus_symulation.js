document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('virusCanvas');
    const ctx = canvas.getContext('2d');
    const startSimBtn = document.getElementById('startSimBtn');
    const resetSimBtn = document.getElementById('resetSimBtn');

    const CELL_SIZE = 10; // Rozmiar pojedynczej kom�rki
    const GRID_WIDTH = canvas.width / CELL_SIZE;
    const GRID_HEIGHT = canvas.height / CELL_SIZE;

    let grid = []; // Siatka kom�rek
    let animationFrameId; // ID ramki animacji do zatrzymywania

    const STATE = {
        HEALTHY: 0,
        INFECTED: 1,
        RECOVERED: 2 // Oporny/Wyleczony
    };

    const COLORS = {
        [STATE.HEALTHY]: '#17a2b8',    // Niebieski
        [STATE.INFECTED]: '#ffc107',   // ��ty
        [STATE.RECOVERED]: '#6c757d'   // Szary
    };

    const INFECTION_CHANCE = 0.05; // Szansa na zara�enie s�siada (5%)
    const RECOVERY_TIME = 100; // Czas po ilu klatkach kom�rka si� wyleczy (100 klatek)


    function initGrid() {
        grid = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < GRID_WIDTH; x++) {
                row.push({
                    state: STATE.HEALTHY,
                    infectionTimer: 0
                });
            }
            grid.push(row);
        }
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Wyczy�� canvas
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const cell = grid[y][x];
                ctx.fillStyle = COLORS[cell.state];
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    function updateSimulation() {
        const nextGrid = JSON.parse(JSON.stringify(grid)); // Tworzymy kopi� siatki do aktualizacji

        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const cell = grid[y][x];
                let nextCellState = cell.state;
                let nextInfectionTimer = cell.infectionTimer;

                if (cell.state === STATE.INFECTED) {
                    nextInfectionTimer++;
                    if (nextInfectionTimer >= RECOVERY_TIME) {
                        nextCellState = STATE.RECOVERED; // Wyleczenie
                        nextInfectionTimer = 0;
                    }

                    // Pr�buj zarazi� s�siad�w
                    const neighbors = [
                        { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, // Prawo/Lewo
                        { dx: 0, dy: -1 }, { dx: 0, dy: 1 }, // G�ra/D�
                        { dx: -1, dy: -1 }, { dx: 1, dy: -1 }, // Po skosie
                        { dx: -1, dy: 1 }, { dx: 1, dy: 1 }
                    ];

                    neighbors.forEach(n => {
                        const nx = x + n.dx;
                        const ny = y + n.dy;

                        // Sprawd�, czy s�siad jest w granicach siatki
                        if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
                            const neighbor = grid[ny][nx];
                            if (neighbor.state === STATE.HEALTHY && Math.random() < INFECTION_CHANCE) {
                                // Je�li s�siad jest zdrowy i mamy szcz�cie, zara�amy go
                                nextGrid[ny][nx].state = STATE.INFECTED;
                            }
                        }
                    });

                } else if (cell.state === STATE.RECOVERED) {
                    // Wyleczone kom�rki pozostaj� wyleczone
                    // Opcjonalnie: Mog� zn�w sta� si� podatne po d�u�szym czasie
                }
                
                nextGrid[y][x].state = nextCellState;
                nextGrid[y][x].infectionTimer = nextInfectionTimer;
            }
        }
        grid = nextGrid; // Aktualizuj g��wn� siatk�
    }

    function animateSimulation() {
        updateSimulation();
        drawGrid();
        animationFrameId = requestAnimationFrame(animateSimulation); // Zap�tl animacj�
    }

    // Funkcja do rozpocz�cia symulacji
    function startSimulation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Zatrzymuje poprzedni� animacj�, je�li dzia�a
        }
        initGrid();
        // Zara� losow� kom�rk� pocz�tkow�
        const startX = Math.floor(Math.random() * GRID_WIDTH);
        const startY = Math.floor(Math.random() * GRID_HEIGHT);
        grid[startY][startX].state = STATE.INFECTED;
        grid[startY][startX].infectionTimer = 0; // Reset timera dla pocz�tkowego zara�enia
        animateSimulation(); // Rozpocznij p�tl� animacji
    }

    // Funkcja do zresetowania symulacji
    window.resetSimulation = function() { // Ustawiamy j� globalnie, �eby `script.js` m�g� j� wywo�a�
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Zatrzymuje animacj�
            animationFrameId = null;
        }
        initGrid(); // Inicjalizuj siatk� do stanu pocz�tkowego
        drawGrid(); // Narysuj czyst� siatk�
    }


    // Podpi�cie przycisk�w
    startSimBtn.addEventListener('click', startSimulation);
    resetSimBtn.addEventListener('click', resetSimulation);

    // Inicjalizacja przy pierwszym za�adowaniu strony
    resetSimulation();
});