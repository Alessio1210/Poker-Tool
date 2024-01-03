// Spieler-Management
// Spieler-Management
let players = [];

function addPlayer() {
    const playerName = document.getElementById('playerName').value;
    players.push({ name: playerName });
    updatePlayerList();
}

function removeAllPlayers() {
    players = [];
    updatePlayerList();
}

function updatePlayerList() {
    const playerListContainer = document.getElementById('playerList');
    playerListContainer.innerHTML = "<h3>Spielerliste:</h3>";

    players.forEach(player => {
        playerListContainer.innerHTML += `<p>${player.name} <button onclick="removePlayerByName('${player.name}')">Entfernen</button></p>`;
    });
}

function removePlayerByName(playerName) {
    const playerIndex = players.findIndex(player => player.name === playerName);
    if (playerIndex !== -1) {
        players.splice(playerIndex, 1);
        updatePlayerList();
    }
}

function assignRandomCards() {
    players.forEach(player => {
        if (!player.card) {
            const randomNumber = Math.floor(Math.random() * 9) + 2; // Zufällige Zahl zwischen 2 und 10
            const suits = ['Herz', 'Karo', 'Pik', 'Kreuz'];
            const randomSuit = suits[Math.floor(Math.random() * suits.length)]; // Zufälliges Zeichen einer Pokerkarte

            player.card = { number: randomNumber, suit: randomSuit };
        }
    });

    updatePlayerList();
}

function updatePlayerList() {
    const playerListContainer = document.getElementById('playerList');
    playerListContainer.innerHTML = "<h3>Spielerliste:</h3>";

    players.forEach(player => {
        const cardInfo = player.card ? `Karte: ${player.card.number} ${player.card.suit}` : "Karte: Nicht zugewiesen";
        playerListContainer.innerHTML += `<p>${player.name} - ${cardInfo} <button onclick="removePlayerByName('${player.name}')">Entfernen</button></p>`;
    });
}

/// Pot-Rechner (aktualisierte Funktion)
function calculateTotalPot() {
    const individualBet = parseFloat(document.getElementById('individualBet').value);
    const playerCount = parseInt(document.getElementById('playerCount').value);
    const totalPotDisplay = document.getElementById('totalPot');
    const pizzaPriceContainer = document.getElementById('pizzaPriceContainer');

    if (!isNaN(individualBet) && !isNaN(playerCount)) {
        // Berechne den Gesamtpot unter Berücksichtigung von Rebuys, aber nicht den Pizzapreis für Rebuys
        const totalPot = (individualBet * playerCount) + (4 * playerCount) + calculateTotalRebuys();
        totalPotDisplay.innerText = `${totalPot}€`;
        
        // Aktualisiere den Pizzapreis nur für die ursprünglichen Einsätze, nicht für Rebuys
        pizzaPriceContainer.innerHTML = `<h4>Preis für Pizzen</h4><p>${4 * playerCount}€ für ${playerCount} Personen</p>`;
    } else {
        alert("Ungültige Eingaben. Bitte stellen Sie sicher, dass Einsatz und Spieleranzahl numerische Werte sind.");
    }
}

// Funktion zur Berechnung der Gesamt-Rebuys
function calculateTotalRebuys() {
    let totalRebuys = 0;
    players.forEach(player => {
        totalRebuys += player.rebuys || 0;
    });
    return totalRebuys;
}


// Rebuys
let rebuys = [];

// Rebuys (korrigierte Funktion)
function addRebuy() {
    const rebuyAmount = parseFloat(document.getElementById('rebuyAmount').value);

    if (!isNaN(rebuyAmount)) {
        const currentPlayer = getCurrentPlayer();
        currentPlayer.rebuys = currentPlayer.rebuys ? currentPlayer.rebuys + rebuyAmount : rebuyAmount;

        updateRebuyList();
        calculateTotalPot();
    } else {
        alert("Ungültiger Rebuy-Betrag. Bitte stellen Sie sicher, dass der Betrag numerisch ist.");
    }
}

function removeAllRebuys() {
    players.forEach(player => {
        player.rebuys = 0;
    });

    updateRebuyList();
    calculateTotalPot();
}

function updateRebuyList() {
    const rebuyListContainer = document.getElementById('rebuyList');
    rebuyListContainer.innerHTML = "<h3>Rebuy-Liste:</h3>";

    players.forEach(player => {
        const rebuyInfo = player.rebuys ? `Rebuys: ${player.rebuys}€` : "Keine Rebuys";
        rebuyListContainer.innerHTML += `<p>${player.name} - ${rebuyInfo}</p>`;
    });
}

// Hilfsfunktion für die aktuelle ausgewählte Person
function getCurrentPlayer() {
    const playerName = document.getElementById('playerName').value;
    return players.find(player => player.name === playerName);
}


// Leaderboard
let leaderboard = [];

function updateLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard');
    leaderboardContainer.innerHTML = "<h2>Leaderboard</h2>";

    players.forEach(player => {
        const playerBalance = calculatePlayerBalance(player.name);
        leaderboardContainer.innerHTML += `<p>${player.name} - Kontostand: ${playerBalance}€</p>`;
    });

    calculateWinner();
}

function calculatePlayerBalance(playerName) {
    const playerRebuys = rebuys.filter(rebuy => rebuy.player === playerName).map(rebuy => rebuy.amount);
    const totalRebuys = playerRebuys.length > 0 ? playerRebuys.reduce((acc, curr) => acc + curr) : 0;
    return totalRebuys;
}

function calculateWinner() {
    const sortedLeaderboard = leaderboard.sort((a, b) => b.balance - a.balance);
    const totalPot = sortedLeaderboard.reduce((acc, player) => acc + player.balance, 0);

    const firstPlace = Math.round(totalPot * 0.41);
    const secondPlace = Math.round(totalPot * 0.33);
    const thirdPlace = Math.round(totalPot * 0.16);

    leaderboard.forEach(player => {
        if (player.balance >= firstPlace) {
            player.winnings = firstPlace;
        } else if (player.balance >= secondPlace) {
            player.winnings = secondPlace;
        } else if (player.balance >= thirdPlace) {
            player.winnings = thirdPlace;
        } else {
            player.winnings = 0;
        }
    });

    displayWinnings();
}

function displayWinnings() {
    const leaderboardContainer = document.getElementById('leaderboard');
    
    leaderboard.forEach(player => {
        leaderboardContainer.innerHTML += `<p>${player.name} - Kontostand: ${player.balance}€ - Gewinn: ${player.winnings}€</p>`;
    });
}

// Blind-Rechner
function calculateBlinds() {
    // Implementieren Sie die Logik für den Blind-Rechner
    // Dies könnte je nach den Regeln des Turniers variieren
    alert("Blinds berechnet.");
}

function handleKeyPress(event, actionFunction) {
    if (event.key === "Enter") {
        event.preventDefault();
        actionFunction();
    }
}