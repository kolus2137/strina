document.addEventListener('DOMContentLoaded', () => {
    // --- Obs³uga zak³adek ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Usuñ aktywne klasy
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Dodaj aktywne klasy do wybranej zak³adki i zawartoœci
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Jeœli przechodzimy do symulacji wirusa, spróbuj j¹ zresetowaæ
            if (targetTab === 'virus-sim' && typeof resetSimulation === 'function') {
                resetSimulation();
            }
        });
    });

    // --- Obs³uga sekcji Satysfakcja ---
    const nickInput = document.getElementById('nickInput');
    const generateBtn = document.getElementById('generateBtn');
    const satisfactionList = document.getElementById('satisfactionList');

    function generateSatisfaction() {
        const nick = nickInput.value.trim();

        satisfactionList.innerHTML = ''; // Wyczyœæ poprzednie fakty

        if (nick === '') {
            const li = document.createElement('li');
            li.textContent = 'Wpisz coœ w pole nicku, aby zacz¹æ!';
            satisfactionList.appendChild(li);
            return;
        }

        const facts = [
            `Wow, ${nick}! Jesteœ niesamowity/a w tym, co robisz!`,
            `Ka¿dego dnia, ${nick}, sprawiasz, ¿e œwiat staje siê lepszym miejscem!`,
            `${nick}, Twoja energia jest naprawdê inspiruj¹ca!`,
            `Nikt nie potrafi tak dobrze jak ${nick} rozwi¹zywaæ problemów!`,
            `${nick}, Twoja kreatywnoœæ nie zna granic!`,
            `Jesteœ mistrzem/mistrzyni¹ w radzeniu sobie z wyzwaniami, ${nick}!`,
            `Dzieñ staje siê jaœniejszy, gdy pojawia siê w nim ktoœ taki jak ${nick}!`,
            `Twoja determinacja, ${nick}, jest godna podziwu!`,
            `Pamiêtaj, ${nick}, jesteœ silniejszy/a, ni¿ myœlisz!`,
            `Z ${nick} u boku, wszystko jest mo¿liwe!`
        ];

        const selectedFacts = new Set();
        while (selectedFacts.size < 3 && selectedFacts.size < facts.length) {
            selectedFacts.add(facts[Math.floor(Math.random() * facts.length)]);
        }

        selectedFacts.forEach((fact, index) => {
            const li = document.createElement('li');
            li.textContent = fact;
            li.style.animationDelay = `${index * 0.2}s`;
            satisfactionList.appendChild(li);
        });
    }

    generateBtn.addEventListener('click', generateSatisfaction);

    nickInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            generateSatisfaction();
        }
    });

    // Domyœlne wygenerowanie faktów przy ³adowaniu strony
    // Note: To zadzia³a tylko jeœli sekcja Satysfakcja jest domyœlnie aktywna.
    // Jeœli nie, zostanie wywo³ane po przejœciu na zak³adkê.
    // generateSatisfaction(); 
});