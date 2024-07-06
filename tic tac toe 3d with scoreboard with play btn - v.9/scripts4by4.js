document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const newGameButton = document.getElementById('newGame');
    const showHistoryButton = document.getElementById('showHistory');
    const playerXScoreDisplay = document.getElementById('playerXScore');
    const playerOScoreDisplay = document.getElementById('playerOScore');
    const winnerModal = document.getElementById('winnerModal');
    const winnerText = document.getElementById('winnerText');
    const clickSound = document.getElementById('clickSound');
    const winSound = document.getElementById('winSound');
    const closeModalButton = document.getElementById('closeModal');

    const bgMusic = new Audio('BGMAqua.mp3');
    bgMusic.loop = true;
    bgMusic.play();
    const showTopScoresButton = document.getElementById('showTopScores');
    const topScoresModal = document.getElementById('topScoresModal');
    const closeTopScoresModalButton = document.getElementById('closeTopScoresModal');


    const musicVolumeControl = document.getElementById('musicVolume');
    const soundVolumeControl = document.getElementById('soundVolume');

    const newGameModal = document.getElementById('newGameModal');
    const closeModalNewGame = document.getElementById('closeModalNewGame');
    const confirmNewGameButton = document.getElementById('confirmNewGame');
    const confirmFirstMoveButton = document.getElementById('confirmFirstMoveButton');
    const firstMoveForm = document.getElementById('firstMoveForm');


    
    let currentPlayer = 'X';
    let gameActive = true;
    let playerXScore = 0;
    let playerOScore = 0;
    let gameHistory = [];
    let highestScore = 0;
    let playerWithHighestScore = '';
    let xMoves = [];
    let oMoves = [];

    const WINNING_COMBOS = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12]
    ];
    const checkWinner = () => {
        for (let combo of WINNING_COMBOS) {
            const [a, b, c, d] = combo;
            if (
                cells[a].innerHTML &&
                cells[a].innerHTML === cells[b].innerHTML &&
                cells[a].innerHTML === cells[c].innerHTML &&
                cells[a].innerHTML === cells[d].innerHTML
            ) {
                cells[a].classList.add('winner');
                cells[b].classList.add('winner');
                cells[c].classList.add('winner');
                cells[d].classList.add('winner');
                gameActive = false;
                const winningPlayer = currentPlayer;
                winnerText.textContent = `${currentPlayer} wins!`;
                winSound.currentTime = 0;
                winSound.play();
                setTimeout(() => {
                    winnerModal.style.display = 'block';
                    updateScore(winningPlayer);
                    saveGame();
                }, 2000);
                break;
            }
        }
        if (!gameActive) {
            cells.forEach(cell => {
                if (!cell.classList.contains('winner')) {
                    cell.classList.add('not-winner');
                }
            });
        } else {
            cells.forEach(cell => {
                cell.classList.remove('not-winner');
            });
        }
    };

    const checkDraw = () => {
        let winnerFound = false;
        for (let combo of WINNING_COMBOS) {
            const [a, b, c, d] = combo;
            if (
                cells[a].innerHTML &&
                cells[a].innerHTML === cells[b].innerHTML &&
                cells[a].innerHTML === cells[c].innerHTML &&
                cells[a].innerHTML === cells[d].innerHTML
            ) {
                winnerFound = true;
                break;
            }
        }
        if (!winnerFound) {
            let allCellsFilled = true;
            for (let cell of cells) {
                if (!cell.children.length) {
                    allCellsFilled = false;
                    break;
                }
            }
            if (allCellsFilled) {
                gameActive = false;
                winnerText.textContent = "It's a draw!";
                winnerModal.style.display = 'block';
                saveGame();
            }
        }
    };
    
    const handleCellClick = (e) => {
        const cell = e.target;
        if (cell.textContent || !gameActive) return;

        const index = cell.dataset.index;
        const img = document.createElement('img');
        img.src = currentPlayer === 'X' ? 'x.png' : 'o.png';
        img.alt = currentPlayer;
        cell.innerHTML = '';
        cell.appendChild(img);
        cell.dataset.content = currentPlayer;

        if (currentPlayer === 'X') {
            xMoves.push(index);
            if (xMoves.length > 4) {
                const oldMove = xMoves.shift();
                cells[oldMove].innerHTML = '';
                cells[oldMove].addEventListener('click', handleCellClick);
            }
        } else {
            oMoves.push(index);
            if (oMoves.length > 4) {
                const oldMove = oMoves.shift();
                cells[oldMove].innerHTML = '';
                cells[oldMove].addEventListener('click', handleCellClick);
            }
        }

        checkWinner();
        checkDraw();

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        clickSound.currentTime = 0;
        clickSound.play();

        cell.removeEventListener('click', handleCellClick);
    };

    const resetGame = () => {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner', 'not-winner');
            cell.addEventListener('click', handleCellClick);
        });
        xMoves = [];
        oMoves = [];
        gameActive = true;
    };

    const updateScore = (winner) => {
        if (winner === 'X') {
            playerXScore++;
            playerXScoreDisplay.textContent = playerXScore;
        } else if (winner === 'O') {
            playerOScore++;
            playerOScoreDisplay.textContent = playerOScore;
        }
    };

    const startNewGame = () => {
        let highestScorePlayer = '';
        if (playerXScore > playerOScore) {
            highestScore = playerXScore;
            highestScorePlayer = 'X';
        } else if (playerOScore > playerXScore) {
            highestScore = playerOScore;
            highestScorePlayer = 'O';
        } else {
            // Handle tie case if needed
        }
    
        if (highestScore > 0) {
            addToLeaderboard(highestScorePlayer, highestScore);
        }
    
        playerXScore = 0;
        playerOScore = 0;
        playerXScoreDisplay.textContent = '0';
        playerOScoreDisplay.textContent = '0';
        highestScore = 0;
        playerWithHighestScore = '';
    
        resetGame();
    };
    
    const addToLeaderboard = (player, score) => {
        const leaderboardList = document.getElementById('leaderboardList');
        const listItem = document.createElement('li');
        listItem.textContent = `Player ${player}: ${score}`;
        leaderboardList.appendChild(listItem);
    };
    const saveGame = () => {
        const gameRecord = {
            xMoves: [...xMoves],
            oMoves: [...oMoves],
            winner: winnerText.textContent,
            timestamp: new Date().toLocaleString() 
        };
        gameHistory.push(gameRecord);
    };
    

    const showHistory = () => {
        let historyText = '<h2>Game History</h2>';
        gameHistory.forEach((game, index) => {
            historyText += `<p>Game ${index + 1}: ${game.winner} won at ${game.timestamp}</p>`;
        });
        document.getElementById('historyContent').innerHTML = historyText;
        document.getElementById('showHistoryModal').style.display = 'block';
    };

    const closeHistoryModal = () => {
        document.getElementById('showHistoryModal').style.display = 'none';
    };

    showHistoryButton.addEventListener('click', showHistory);
    document.getElementById('closeHistoryModal').addEventListener('click', closeHistoryModal);

    const newGame = () => {
        gameHistory = [];
        newGameModal.style.display = 'block';
    };

    const savePlayerScoresToText = (playerXScore, playerOScore) => {
        const playerScores = `Player X Score: ${playerXScore}, Player O Score: ${playerOScore}`;
        const textFile = new Blob([playerScores], { type: 'text/plain' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(textFile);
        downloadLink.download = 'player_scores.txt';
        downloadLink.click();
    };

    const resetScores = () => {
        playerXScore = 0;
        playerOScore = 0;
        playerXScoreDisplay.textContent = '0';
        playerOScoreDisplay.textContent = '0';
        savePlayerScoresToText(playerXScore, playerOScore);
    };

    const closeModal = () => {
        winnerModal.style.display = 'none';
        resetGame();
    };

    const confirmFirstMove = () => {
        const firstMoveSelection = document.querySelector('input[name="firstMove"]:checked').value;
        currentPlayer = firstMoveSelection;
        resetGame();
        winnerModal.style.display = 'none';
    };

    confirmFirstMoveButton.addEventListener('click', confirmFirstMove);

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', newGame);
    showHistoryButton.addEventListener('click', showHistory);
    closeModalButton.addEventListener('click', closeModal);
    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', () => {
        newGameModal.style.display = 'block';
    });
    confirmNewGameButton.addEventListener('click', () => {
        newGameModal.style.display = 'none';
        startNewGame();
    });
    closeModalNewGame.addEventListener('click', () => {
        newGameModal.style.display = 'none';
    });
    showTopScoresButton.addEventListener('click', () => {
        topScoresModal.style.display = 'block';
    });
    closeTopScoresModalButton.addEventListener('click', () => {
        topScoresModal.style.display = 'none';
    });
    closeModalButton.addEventListener('click', () => {
        winnerModal.style.display = 'none';
    });
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    const handleSoundVolumeChange = (e) => {
        const volume = e.target.value / 100;
        clickSound.volume = volume;
        winSound.volume = volume;
    };

    const handleMusicVolumeChange = (e) => {
        const volume = e.target.value / 100;
        bgMusic.volume = volume;
    };

    soundVolumeControl.addEventListener('input', handleSoundVolumeChange);
    musicVolumeControl.addEventListener('input', handleMusicVolumeChange);

    bgMusic.loop = true;
    bgMusic.play();

  
});

    const playBackgroundMusic = () => {
        bgMusic.loop = true;
        bgMusic.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        bgMusic.play();
    };

    const pauseBackgroundMusic = () => {
        bgMusic.pause();
    };

    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', () => {
            cell.classList.add('clicked');
        });
    });

    const displayNewGameModal = () => {
        newGameModal.style.display = 'block';
    };

    const closeNewGameModal = () => {
        newGameModal.style.display = 'none';
    };

    newGameButton.addEventListener('click', displayNewGameModal);
    closeModalNewGame.addEventListener('click', closeNewGameModal);

    confirmNewGameButton.addEventListener('click', () => {
        closeNewGameModal();a
    });

    window.addEventListener('click', function(event) {
        if (event.target == newGameModal) {
            closeNewGameModal();
        }
    });

    showTopScoresButton.addEventListener('click', function() {
        topScoresModal.style.display = 'block';
    });

    closeTopScoresModalButton.addEventListener('click', function() {
        topScoresModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == topScoresModal) {
            topScoresModal.style.display = 'none';
        }
    });



    document.addEventListener("DOMContentLoaded", function() {
  var dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(function(dropdown) {
    var button = dropdown.querySelector('.dropbtn');

    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevents the click event from propagating to the document

      var content = dropdown.querySelector('.dropdown-content');
      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
    });
  });

  // Close dropdowns when clicking anywhere else on the document
  document.addEventListener('click', function(e) {
    dropdowns.forEach(function(dropdown) {
      var content = dropdown.querySelector('.dropdown-content');
      if (dropdown.contains(e.target) || content.contains(e.target)) {
        return;
      }
      content.style.display = 'none';
    });
  });
});
