function projStartUp() {
  popup.style.display = "none";
  cardPopup.style.display = "none";
  //localStorage.clear();
}

document.addEventListener("DOMContentLoaded", () => {
  projStartUp();

  const projectNameElement = document.getElementById("projectName");
  //const projectDescriptionElement = document.getElementById("projectDescription");

  const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
  if (selectedProject) {
    projectNameElement.textContent = selectedProject.name;
    //projectDescriptionElement.textContent = selectedProject.description;
  
    const addBoardBtn = document.querySelector(".add-board-btn");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    const boardNameInput = document.getElementById("boardName");
    const boardColorInput = document.getElementById("boardColor");
    const saveBoardBtn = document.getElementById("saveBoardBtn");
    const boardContainer = document.getElementById("boardContainer");

    // Load saved boards from localStorage
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];

    // Clear the boardContainer before displaying boards for the current project
    boardContainer.innerHTML = "";

    // Filter the savedBoards array to get boards for the current project
    const boardsForProject = savedBoards.filter(board => board.projectName === selectedProject.name);

    // Display saved boards for the current project on page load
    boardsForProject.forEach(board => {
      const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");
    boardDiv.style.setProperty("--board-color", board.color);
    boardDiv.draggable = true;
    boardDiv.innerHTML = `
      <h3>${board.name}</h3>
    `;
    // Display saved cards for the current board
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    const cardsForBoard = savedCards.filter(card => card.boardName === board.name);

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("cards-container");
    cardsForBoard.forEach(card => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.textContent = card.cardName;
      cardDiv.setAttribute("data-card-id", card.cardId);
      cardsContainer.appendChild(cardDiv);
      
      
    });

    boardDiv.appendChild(cardsContainer);

    boardDiv.addEventListener("click", () => {
      showCardPopup(board.name);
      
    });
    
    boardContainer.appendChild(boardDiv);
    
  });


    // Drag and drop functionality
    let draggedBoard = null;

    boardContainer.addEventListener("dragstart", (event) => {
      draggedBoard = event.target;
      event.target.style.opacity = 0.5;
    });

    boardContainer.addEventListener("dragend", (event) => {
      event.target.style.opacity = "";
      draggedBoard = null;
    });

    boardContainer.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (event.target.classList.contains("cards-container")) {
        event.target.classList.add("drag-over"); // Add visual feedback
      }    
    });

    boardContainer.addEventListener("dragleave", (event) => {
      if (event.target.classList.contains("cards-container")) {
        event.target.classList.remove("drag-over"); // Remove visual feedback
      }
    });
    

    boardContainer.addEventListener("drop", (event) => {
      event.preventDefault();
      if (event.target.classList.contains("cards-container")) {
        event.target.classList.remove("drag-over"); // Remove visual feedback
    
        const cardId = event.dataTransfer.getData("text/plain");
        if (cardId) {
          const targetBoard = event.target.closest(".board");
          if (targetBoard) {
            const targetBoardName = targetBoard.dataset.boardName;
    
            // Update the card's boardName in localStorage
            const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
            const updatedCards = savedCards.map(card => {
              if (card.cardId === cardId) {
                card.boardName = targetBoardName;
              }
              return card;
            });
            localStorage.setItem("cards", JSON.stringify(updatedCards));
    
            // Move the card element to the target board's cards-container
            const sourceCard = boardContainer.querySelector(`.card[data-card-id="${cardId}"]`);
            if (sourceCard) {
              // Ensure the source card retains its data-card-id attribute after being moved
              sourceCard.dataset.cardId = cardId;
              event.target.appendChild(sourceCard);
            }
          }
        }
      }
    }); 

  const cardElements = document.querySelectorAll(".card");
  cardElements.forEach(card => {
    card.draggable = true;
    card.addEventListener("dragstart", handleCardDragStart);
  });

  boardContainer.addEventListener("dragover", handleCardDragOver);
  boardContainer.addEventListener("drop", handleCardDrop);


    addBoardBtn.addEventListener("click", () => {
      popup.style.display = "flex";
    });

    closePopup.addEventListener("click", () => {
      popup.style.display = "none";
    });

    saveBoardBtn.addEventListener("click", () => {
        const boardName = boardNameInput.value;
        const boardColor = boardColorInput.value;
        const projectName = selectedProject.name;

        if (boardName && boardColor && projectName) {
          const board = { name: boardName, color: boardColor, projectName: projectName };
          savedBoards.push(board);
          localStorage.setItem("boards", JSON.stringify(savedBoards));

          const boardDiv = document.createElement("div");
          boardDiv.classList.add("board");
          boardDiv.style.setProperty("--board-color", boardColor);
          boardDiv.draggable = true; // Enable draggable
          boardDiv.innerHTML = `
            <h3>${boardName}</h3>
            <div class="cards-container"></div>
          `;
          boardContainer.appendChild(boardDiv);

          boardNameInput.value = "";
          boardColorInput.value = "";

          popup.style.display = "none";

        window.location.reload();
      }
    });
  } else {
    projectNameElement.textContent = "No project selected.";
    projectDescriptionElement.textContent = "";
  }

  function showCardPopup(boardName) {
    const cardPopup = document.getElementById("cardPopup");
  const closeCardPopup = document.getElementById("closeCardPopup");
  const cardNameInput = document.getElementById("cardName");
  const saveCardBtn = document.getElementById("saveCardBtn");

  cardPopup.style.display = "flex";

  saveCardBtn.addEventListener("click", () => {
    const cardName = cardNameInput.value;
  if (cardName) {
    const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
    if (selectedProject) {
      const card = {
        cardName: cardName,
        boardName: boardName, // You need to define the boardName variable here
        projectName: selectedProject.name
      };

      // Save the card details to localStorage or perform other actions
      const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
      savedCards.push(card);
      localStorage.setItem("cards", JSON.stringify(savedCards));

      // Find the appropriate board's cards container
      const boardDiv = boardContainer.querySelector(`.board[data-board-name="${boardName}"]`);
      if (boardDiv) {
        const cardsContainer = boardDiv.querySelector(".cards-container");
        if (cardsContainer) {
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("card");
          cardDiv.textContent = cardName;
          cardsContainer.appendChild(cardDiv);
        }
      }

      cardNameInput.value = "";
      cardPopup.style.display = "none";

      window.location.reload();
    }
  }
});

  closeCardPopup.addEventListener("click", () => {
    cardPopup.style.display = "none";
    
  });   
}

// Function to handle card drag start
function handleCardDragStart(event) {
  console.log("Card drag start:", event.target.dataset.cardId);
  event.dataTransfer.setData("text/plain", event.target.dataset.cardId);
  event.target.style.opacity = 0.5;
}

// Function to handle card drag over
function handleCardDragOver(event) {
  event.preventDefault();
  if (event.target.classList.contains("cards-container")) {
    event.target.classList.add("drag-over");
  }
}

// Function to handle card drop
function handleCardDrop(event) {
  event.preventDefault();
  const cardId = event.dataTransfer.getData("text/plain");
  if (cardId) {
    const targetBoard = event.target.closest(".board");
    if (targetBoard) {
      const targetBoardName = targetBoard.dataset.boardName;

      // Update the card's boardName in localStorage
      const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
      const updatedCards = savedCards.map(card => {
        if (card.cardId === cardId) {
          card.boardName = targetBoardName;
        }
        return card;
      });
      localStorage.setItem("cards", JSON.stringify(updatedCards));

      // Move the card element to the target board's cards container
      const sourceCard = boardContainer.querySelector(`.card[data-card-id="${cardId}"]`);
      if (sourceCard) {
        targetBoard.querySelector(".cards-container").appendChild(sourceCard);
        event.target.classList.remove("drag-over"); // Remove visual feedback
      }
    }
  }
}
});