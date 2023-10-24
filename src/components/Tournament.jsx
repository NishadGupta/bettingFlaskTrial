import { useState } from 'react';

const randomInteger = (min, max) => {
    return min + Math.floor(Math.random() * (max - min + 1));
};

const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
};

export const Tournament = ({ N, B }) => {
    const [tournamentResult, setTournamentResult] = useState('');
    const [tournamentLog, setTournamentLog] = useState([]);

    const logMessage = (message) => {
        setTournamentLog((prevLog) => [...prevLog, message]);
    };

    const playTournament = () => {
        const one = 1;
        const numPlayer = one << N + 2;

        const playerID = Array.from({ length: numPlayer }, (_, i) => i);
        const budget = Array(numPlayer).fill(B);
        const bet = Array(numPlayer).fill(0);

        const betRecord = Array.from({ length: N + 1 }, () => Array(numPlayer).fill(-1));

        // Initialize players and budgets
        for (let i = 1; i <= numPlayer; i++) {
            playerID[i - 1] = i - 1;
            budget[i - 1] = B;
        }

        logMessage('Each line represents a round with (playerID, betAmount)');

        for (let round = 1; round <= N + 1; round++) {
            let playerCount = one << (N - round + 1);
            if (round === 1) playerCount += 2;
            if (round === N + 1) playerCount++;

            // Randomly shuffle active players
            shuffle(playerID.slice(0, playerCount));

            // Players determine their bets (currently randomly assigned by the machine)
            for (let i = 0; i < playerCount; i++) {
                if (round === N + 1) {
                    bet[i] = budget[playerID[i]];
                } else {
                    bet[i] = randomInteger(0, budget[playerID[i]]);
                }
                budget[playerID[i]] -= bet[i];
            }

            // Log player matchups (randomly matched)
            if (round < N + 1) {
                logMessage(`Round ${round} Matchups:`);
                const matchups = [];
                for (let i = 0; i < playerCount; i++) {
                    matchups.push(playerID[i]);
                    if (matchups.length === 2) {
                        const [playerA, playerB] = matchups;
                        logMessage(`Match ${i / 2 + 1}: Player ${playerA} vs Player ${playerB}`);
                        matchups.length = 0;
                    }
                }
            }

            // record the bets
            for (let i = 0; i < playerCount; i++) {
                betRecord[round - 1][playerID[i]] = bet[i];
                logMessage(`(${playerID[i]}, ${bet[i]})`);
            }

            // Move winners to the first playerCount/2 positions
            for (let i = 0; i < playerCount / 2; i++) {
                let winner;
                if (bet[2 * i] < bet[2 * i + 1]) winner = 2 * i + 1;
                else if (bet[2 * i] > bet[2 * i + 1]) winner = 2 * i;
                else {
                    if (budget[playerID[2 * i]] < budget[playerID[2 * i + 1]]) winner = 2 * i + 1;
                    else if (budget[playerID[2 * i]] > budget[playerID[2 * i + 1]]) winner = 2 * i;
                    else winner = randomInteger(2 * i, 2 * i + 1);
                }
                playerID[i] = playerID[winner];
                bet[i] = bet[winner];
            }

            // Determine the best of best and move it to position playerCount/2
            if (round < N) {
                const j = playerCount / 2;
                let k = j;

                // Sort playerID and bet pairs by increasing bet values
                for (let i = 0; i < k - 1; i++) {
                    for (let m = 0; m < k - 1 - i; m++) {
                        if (bet[m] > bet[m + 1]) {
                            const tempID = playerID[m];
                            const tempBet = bet[m];
                            playerID[m] = playerID[m + 1];
                            bet[m] = bet[m + 1];
                            playerID[m + 1] = tempID;
                            bet[m + 1] = tempBet;
                        }
                    }
                }

                // Find the last index k such that bet[k] !== bet[k - 1]
                while (k > 1 && bet[k - 1] === bet[k - 2]) {
                    k--;
                }

                // Sort playerID[k-1,j-1] and corresponding bet pairs by increasing budget values
                const p = (j - 1) - (k - 1) + 1;

                for (let i = 0; i < p - 1; i++) {
                    for (let m = k - 1; m < j - 1 - i; m++) {
                        if (budget[playerID[m]] > budget[playerID[m + 1]]) {
                            const tempID = playerID[m];
                            const tempBet = bet[m];
                            playerID[m] = playerID[m + 1];
                            bet[m] = bet[m + 1];
                            playerID[m + 1] = tempID;
                            bet[m + 1] = tempBet;
                        }
                    }
                }

                // Find the last index m such that budget[playerID[m]] !== budget[playerID[m - 1]]
                let m = k;
                while (m > 1 && budget[playerID[m - 1]] === budget[playerID[m - 2]]) {
                    m--;
                }

                // Randomly select pass between [m..j] which offered the maximum bet and have their budgets equally highest
                const pass = randomInteger(m - 1, j - 1);

                // Swap playerID[j] and playerID[pass], and bet[j] and bet[pass]
                const tempID = playerID[j - 1];
                const tempBet = bet[j - 1];
                playerID[j - 1] = playerID[pass];
                bet[j - 1] = bet[pass];
                playerID[pass] = tempID;
                bet[pass] = tempBet;
            }

            // Move previous pass winner to next round
            if (round > 1 && round <= N) {
                playerID[Math.floor(playerCount / 2)] = playerID[Math.floor(playerCount / 2) - 1];
                playerID[Math.floor(playerCount / 2) - 1] = playerID[playerCount];
            }
        }

        let award = 0;
        for (let i = 0; i < numPlayer; i++) {
            award += B - budget[i];
        }

        // Print tournament data
        logMessage(`Winner ID: ${playerID[0]}`);
        logMessage(`Award: ${award}`);
        setTournamentResult(`Winner ID: ${playerID[0]}\nAward: ${award}`);
    };

    return (
        <div>
            <button onClick={playTournament}>Play Tournament</button>
            <h2>Tournament Log:</h2>
            <ul>
                {tournamentLog.map((logEntry, index) => (
                    <li key={index}>{logEntry}</li>
                ))}
            </ul>
            <h2>Tournament Result:</h2>
            <pre>{tournamentResult}</pre>
        </div>
    );
};
