document.addEventListener('DOMContentLoaded', () => {
    // --- Obs�uga zak�adek ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Usu� aktywne klasy
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Dodaj aktywne klasy do wybranej zak�adki i zawarto�ci
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Je�li przechodzimy do symulacji wirusa, spr�buj j� zresetowa�
            if (targetTab === 'virus-sim' && typeof resetSimulation === 'function') {
                resetSimulation();
            }
        });
    });

    // --- Obs�uga sekcji Satysfakcja ---
    const nickInput = document.getElementById('nickInput');
    const generateBtn = document.getElementById('generateBtn');
    const satisfactionList = document.getElementById('satisfactionList');

    function generateSatisfaction() {
        const nick = nickInput.value.trim();

        satisfactionList.innerHTML = ''; // Wyczy�� poprzednie fakty

        if (nick === '') {
            const li = document.createElement('li');
            li.textContent = 'Wpisz co� w pole nicku, aby zacz��!';
            satisfactionList.appendChild(li);
            return;
        }

        const facts = [
            `Wow, ${nick}! Jeste� niesamowity/a w tym, co robisz!`,
            `Ka�dego dnia, ${nick}, sprawiasz, �e �wiat staje si� lepszym miejscem!`,
            `${nick}, Twoja energia jest naprawd� inspiruj�ca!`,
            `Nikt nie potrafi tak dobrze jak ${nick} rozwi�zywa� problem�w!`,
            `${nick}, Twoja kreatywno�� nie zna granic!`,
            `Jeste� mistrzem/mistrzyni� w radzeniu sobie z wyzwaniami, ${nick}!`,
            `Dzie� staje si� ja�niejszy, gdy pojawia si� w nim kto� taki jak ${nick}!`,
            `Twoja determinacja, ${nick}, jest godna podziwu!`,
            `Pami�taj, ${nick}, jeste� silniejszy/a, ni� my�lisz!`,
            `Z ${nick} u boku, wszystko jest mo�liwe!`
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

    // Domy�lne wygenerowanie fakt�w przy �adowaniu strony
    // Note: To zadzia�a tylko je�li sekcja Satysfakcja jest domy�lnie aktywna.
    // Je�li nie, zostanie wywo�ane po przej�ciu na zak�adk�.
    // generateSatisfaction(); 
});