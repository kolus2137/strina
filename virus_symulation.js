document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('virusCanvas');
    const ctx = canvas.getContext('2d');
    const startSimBtn = document.getElementById('startSimBtn');
    const resetSimBtn = document.getElementById('resetSimBtn');

    const CELL_SIZE = 10; // Rozmiar pojedynczej komórki
    const GRID_WIDTH = canvas.width / CELL_SIZE;
    const GRID_HEIGHT = canvas.height / CELL_SIZE;

    let grid = []; // Siatka komórek
    let animationFrameId; // ID ramki animacji do zatrzymywania

    const STATE = {
        HEALTHY: 0,
        INFECTED: 1,
        RECOVERED: 2 // Oporny/Wyleczony
    };

    const COLORS = {
        [STATE.HEALTHY]: '#17a2b8',    // Niebieski
        [STATE.INFECTED]: '#ffc107',   // ¯ó³ty
        [STATE.RECOVERED]: '#6c757d'   // Szary
    };

    const INFECTION_CHANCE = 0.05; // Szansa na zara¿enie s¹siada (5%)
    const RECOVERY_TIME = 100; // Czas po ilu klatkach komórka siê wyleczy (100 klatek)


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
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Wyczyœæ canvas
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const cell = grid[y][x];
                ctx.fillStyle = COLORS[cell.state];
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    function updateSimulation() {
        const nextGrid = JSON.parse(JSON.stringify(grid)); // Tworzymy kopiê siatki do aktualizacji

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

                    // Próbuj zaraziæ s¹siadów
                    const neighbors = [
                        { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, // Prawo/Lewo
                        { dx: 0, dy: -1 }, { dx: 0, dy: 1 }, // Góra/Dó³
                        { dx: -1, dy: -1 }, { dx: 1, dy: -1 }, // Po skosie
                        { dx: -1, dy: 1 }, { dx: 1, dy: 1 }
                    ];

                    neighbors.forEach(n => {
                        const nx = x + n.dx;
                        const ny = y + n.dy;

                        // SprawdŸ, czy s¹siad jest w granicach siatki
                        if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
                            const neighbor = grid[ny][nx];
                            if (neighbor.state === STATE.HEALTHY && Math.random() < INFECTION_CHANCE) {
                                // Jeœli s¹siad jest zdrowy i mamy szczêœcie, zara¿amy go
                                nextGrid[ny][nx].state = STATE.INFECTED;
                            }
                        }
                    });

                } else if (cell.state === STATE.RECOVERED) {
                    // Wyleczone komórki pozostaj¹ wyleczone
                    // Opcjonalnie: Mog¹ znów staæ siê podatne po d³u¿szym czasie
                }
                
                nextGrid[y][x].state = nextCellState;
                nextGrid[y][x].infectionTimer = nextInfectionTimer;
            }
        }
        grid = nextGrid; // Aktualizuj g³ówn¹ siatkê
    }

    function animateSimulation() {
        updateSimulation();
        drawGrid();
        animationFrameId = requestAnimationFrame(animateSimulation); // Zapêtl animacjê
    }

    // Funkcja do rozpoczêcia symulacji
    function startSimulation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Zatrzymuje poprzedni¹ animacjê, jeœli dzia³a
        }
        initGrid();
        // ZaraŸ losow¹ komórkê pocz¹tkow¹
        const startX = Math.floor(Math.random() * GRID_WIDTH);
        const startY = Math.floor(Math.random() * GRID_HEIGHT);
        grid[startY][startX].state = STATE.INFECTED;
        grid[startY][startX].infectionTimer = 0; // Reset timera dla pocz¹tkowego zara¿enia
        animateSimulation(); // Rozpocznij pêtlê animacji
    }

    // Funkcja do zresetowania symulacji
    window.resetSimulation = function() { // Ustawiamy j¹ globalnie, ¿eby `script.js` móg³ j¹ wywo³aæ
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Zatrzymuje animacjê
            animationFrameId = null;
        }
        initGrid(); // Inicjalizuj siatkê do stanu pocz¹tkowego
        drawGrid(); // Narysuj czyst¹ siatkê
    }


    // Podpiêcie przycisków
    startSimBtn.addEventListener('click', startSimulation);
    resetSimBtn.addEventListener('click', resetSimulation);

    // Inicjalizacja przy pierwszym za³adowaniu strony
    resetSimulation();
});