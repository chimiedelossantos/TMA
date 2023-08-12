function projStartUp() {
  popup.style.display = "none";
  cardPopup.style.display = "none";
  cardDetailsPopup.style.display = "none";
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
    const cardDetailsPopup = document.getElementById("cardDetailsPopup");

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
      //Pop-up of cardDetails
      cardDiv.addEventListener("click", () => {
        showCardDetailsPopup(board.name, card.cardName);
      });

      cardsContainer.appendChild(cardDiv);
    
      //Use this if card will be displayed in HTML.. ill go back, will check pop-up first
      //cardDiv.addEventListener("click", () => {
        //window.location.href = `card.html?cardId=${card.cardId}`;
      //});
      
      //cardDiv.addEventListener("click", () => {
        //window.location.href = `card.html?cardId=${card.cardId}`;
      //});

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
//cardDetails population popup
function showCardDetailsPopup(boardName, cardName) {
  const cardDetailsPopup = document.getElementById("cardDetailsPopup");

  cardDetailsPopup.style.display = "flex";

  const cardDetailsContent = cardDetailsPopup.querySelector(".popup-content");
  cardDetailsContent.innerHTML = `
    <span class="close-popup" id="closeCardDetailsPopup">&times;</span>
    <h2>${boardName}</h2><h2>${cardName}</h2>
    <div class="checklist">
      <button id="addChecklistBtn">+ Checklist</button>
    </div>
    <div class="comments">
      <button id="addCommentBtn">+ Comment</button>
    </div>
    <div class="attachments"></div>
      <button id="addAttachmentsBtn">+ Attachment</button>
    <button id="saveCardDetailsBtn">Save</button>
  `;

  const closeCardDetailsPopup = document.getElementById("closeCardDetailsPopup");
  if (closeCardDetailsPopup) {
    closeCardDetailsPopup.addEventListener("click", () => {
      const cardDetailsPopup = document.getElementById("cardDetailsPopup");
      cardDetailsPopup.style.display = "none";
    });
  }

  // Handle adding checklist
  const addChecklistBtn = cardDetailsContent.querySelector("#addChecklistBtn");
  if (addChecklistBtn) {
    addChecklistBtn.addEventListener("click", () => {
      const checklistContainer = cardDetailsContent.querySelector(".checklist");
  
      const checklistItem = document.createElement("div");
      checklistItem.classList.add("checklist-item");
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("checkbox");
  
      const textField = document.createElement("input");
      textField.type = "text";
      textField.placeholder = "Enter checklist item";
      textField.classList.add("text-field");
  
      // Listen for blur event on the text field
      textField.addEventListener("blur", () => {
        const trimmedValue = textField.value.trim();
        if (trimmedValue !== "") {
          const newItem = createChecklistItem(trimmedValue);
          checklistContainer.appendChild(newItem);
          saveChecklistToLocalStorage(checklistContainer);
          textField.value = ""; // Clear the text field
        }
      });
  
      checklistItem.appendChild(checkbox);
      checklistItem.appendChild(textField);
  
      checklistContainer.appendChild(checklistItem);
    });
  }
  
  function createChecklistItem(text) {
    const item = document.createElement("div");
    item.classList.add("checklist-item");
  
    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.classList.add("checkbox");
  
    const newText = document.createElement("span");
    newText.classList.add("text"); 
    newText.textContent = text;
  
    //console.log("Text content:", text);
  
    item.appendChild(newCheckbox);
    item.appendChild(newText);
  
    return item;
  }
  
  function saveChecklistToLocalStorage(container) {
    const checklistItems = Array.from(container.querySelectorAll(".checklist-item")).map(item => {
      const checkbox = item.querySelector(".checkbox");
      const textElement = item.querySelector(".text"); // Use the correct class name
      const text = textElement ? textElement.textContent : "";
  
      console.log("Saved Text:", text);
  
      return { isChecked: checkbox.checked, text: text };
    });
  
    localStorage.setItem("checklistItems", JSON.stringify(checklistItems));
  }
  
  // Load checklist items from local storage on page load
  document.addEventListener("DOMContentLoaded", () => {
  const checklistContainer = cardDetailsContent.querySelector(".checklist");
  const savedChecklistItems = JSON.parse(localStorage.getItem("checklistItems")) || [];

  savedChecklistItems.forEach(item => {
    const newItem = createChecklistItem(item.text);
    const checkbox = newItem.querySelector(".checkbox");
    checkbox.checked = item.isChecked;
    checklistContainer.appendChild(newItem);

    //console.log("Loaded Text:", item.text);
  });
});
  
  function saveChecklistToLocalStorage(container) {
    const checklistItems = Array.from(container.querySelectorAll(".checklist-item")).map(item => {
      const checkbox = item.querySelector(".checkbox");
      const textElement = item.querySelector(".text"); // Use ".text" class
      const text = textElement ? textElement.textContent : "";
      return { isChecked: checkbox.checked, text: text };
    });
  
    localStorage.setItem("checklistItems", JSON.stringify(checklistItems));
  }
  
  // Load checklist items from local storage on page load
  document.addEventListener("DOMContentLoaded", () => {
    const checklistContainer = cardDetailsContent.querySelector(".checklist");
    const savedChecklistItems = JSON.parse(localStorage.getItem("checklistItems")) || [];
  
    savedChecklistItems.forEach(item => {
      const newItem = createChecklistItem(item.text);
      const checkbox = newItem.querySelector(".checkbox");
      checkbox.checked = item.isChecked;
      checklistContainer.appendChild(newItem);
    });
  });

  // Handle adding comment
  const addCommentBtn = cardDetailsContent.querySelector("#addCommentBtn");
  if (addCommentBtn) {
    addCommentBtn.addEventListener("click", () => {
      // Add your code to handle adding a comment here
    });
  }

  const addAttachmentsBtn = cardDetailsContent.querySelector("#addAttachmentsBtn");
  if (addAttachmentsBtn) {
    addAttachmentsBtn.addEventListener("click", () => {
      // Add your code to handle adding a comment here
    });
  }
}
});
