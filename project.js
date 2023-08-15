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

      const dueDateStatus = checkDueDate(card.targetDate);

      // Display card name and target date together
      cardDiv.innerHTML = `
        <span class="card-name">${card.cardName}</span>
        <span class="target-date">${card.targetDate}</span>
        ${dueDateStatus === "reminder" ? '<img class="reminder" src="reminder.png">' : ''}
        ${dueDateStatus === "delayed" ? '<img class="delayed" src="delayed.png">' : ''}

      `;
  
      cardDiv.setAttribute("data-card-id", card.cardId);
      //Pop-up of cardDetails
      cardDiv.addEventListener("click", () => {
        showCardDetailsPopup(board.name, card.cardName);
      });

      cardsContainer.appendChild(cardDiv);
    

    });

    boardDiv.appendChild(cardsContainer);

    boardDiv.addEventListener("click", () => {
      showCardPopup(board.name);
      
    });
    
    boardContainer.appendChild(boardDiv);
   
      function checkDueDate(targetDate) {
        const currentDate = new Date();
        const dueDate = new Date(targetDate);
      
        const timeDifference = dueDate.getTime() - currentDate.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);
      
        if (daysDifference <= 2 && daysDifference >= 0) {
          return "reminder"; // Display reminder icon
        } else if (dueDate < currentDate) {
          return "delayed"; // Display delayed icon
        } else {
          return ""; // No icon
        }
      }

    const runButton = document.querySelector(".run");

// Add an event listener to the runButton
const cardElements = document.querySelectorAll(".card");

  cardElements.forEach(cardElement => {
    // Get the target date from the card's target date element
    const targetDateElement = cardElement.querySelector(".target-date");
    const targetDate = targetDateElement.textContent; // Extract the target date value

    const dueDateStatus = checkDueDate(targetDate);
    const reminderIcon = document.querySelectorAll("reminder");
    const delayedIcon = document.querySelectorAll("delayed");
    

    if (dueDateStatus === "reminder") {
     

      const reminderIcon = document.createElement("img");
      reminderIcon.src = "reminder.png"; 
      reminderIcon.className = "reminder"; 

      cardElement.appendChild(reminderIcon);

      reminderIcon.style.display = "block";
    } else if (dueDateStatus === "delayed") {

      
      const delayedIcon = document.createElement("img");
      delayedIcon.src = "delayed.png"; 
      delayedIcon.className = "delayed";

      cardElement.appendChild(delayedIcon);
      delayedIcon.style.display = "block";
    } 
  });
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
    const targetDateInput = document.getElementById("targetDate");
    const saveCardBtn = document.getElementById("saveCardBtn");

    cardPopup.style.display = "flex";

    saveCardBtn.addEventListener("click", () => {
    const cardName = cardNameInput.value;
    const targetDate = targetDateInput.value;
    if (cardName) {
      const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
    if (selectedProject) {
      const card = {
        cardName: cardName,
        targetDate: targetDate,
        boardName: boardName,
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
      targetDateInput.value = ""; 

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
    <h2>${cardName}</h2>
    <div class="checklist">
      <button id="addChecklistBtn">+ Checklist</button>
    </div>
    <div class="comments">
      <button id="addCommentBtn">+ Comment</button>
    </div>
    <div class="attachments"></div>
      <button id="addAttachmentsBtn">+ Attachment</button>
  `;

  const closeCardDetailsPopup = document.getElementById("closeCardDetailsPopup");
  const cardPopup = document.getElementById("cardPopup");
  if (closeCardDetailsPopup) {
    closeCardDetailsPopup.addEventListener("click", () => {
      const cardDetailsPopup = document.getElementById("cardDetailsPopup");
      cardDetailsPopup.style.display = "none";
      cardPopup.style.display = "none";
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
          textField.value = ""; 
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
  
    const changeDateElement = document.createElement("span");
    changeDateElement.classList.add("change-date");
    

    item.appendChild(newCheckbox);
    item.appendChild(newText);
    
  
    return item;
  }
  
  function saveChecklistToLocalStorage(container) {
    const checklistItems = Array.from(container.querySelectorAll(".checklist-item")).map(item => {
      const checkbox = item.querySelector(".checkbox");
      const textElement = item.querySelector(".text"); // Use the correct class name
      const text = textElement ? textElement.textContent : "";
      return { isChecked: checkbox.checked, text: text };
    });
  
    localStorage.setItem("checklistItems", JSON.stringify(checklistItems));
  }
  
  // Load checklist items from local storage and display on page load
  const checklistContainer = cardDetailsContent.querySelector(".checklist");
  const savedChecklistItems = JSON.parse(localStorage.getItem("checklistItems")) || [];
  
  savedChecklistItems.forEach(item => {
    const newItem = createChecklistItem(item.text);
    const checkbox = newItem.querySelector(".checkbox");
    checkbox.checked = item.isChecked;
    checklistContainer.appendChild(newItem);
  });

  checklistContainer.addEventListener("change", (event) => {
    const clickedCheckbox = event.target;
    if (clickedCheckbox.classList.contains("checkbox")) {
      updateChecklistItemStatus(clickedCheckbox);
      saveChecklistToLocalStorage(checklistContainer);
      updateChangeDate(clickedCheckbox);
    }
  });
  
  function updateChecklistItemStatus(checkbox) {
    const checklistItem = checkbox.closest(".checklist-item");
    const textElement = checklistItem.querySelector(".text");
    
    // Find the index of the checklist item in the savedChecklistItems array
    const index = Array.from(checklistContainer.querySelectorAll(".checklist-item")).indexOf(checklistItem);
    
    if (index !== -1 && textElement) {
      savedChecklistItems[index].isChecked = checkbox.checked;
    }
  }
  
  function updateChangeDate(checkbox) {
    const checklistItem = checkbox.closest(".checklist-item");
    const changeDateElement = checklistItem.querySelector(".change-date");
    
    if (changeDateElement) {
      const index = Array.from(checklistContainer.querySelectorAll(".checklist-item")).indexOf(checklistItem);
      if (index !== -1) {
        savedChecklistItems[index].changeDate = new Date().toLocaleDateString();
        changeDateElement.textContent = savedChecklistItems[index].changeDate;
      }
    }
  }
  
  

  // Handle adding comment
  const addCommentBtn = cardDetailsContent.querySelector("#addCommentBtn");
  if (addCommentBtn) {
    addCommentBtn.addEventListener("click", () => {
      const commentsContainer = cardDetailsContent.querySelector(".comments");
  
      const commentInput = document.createElement("input");
      commentInput.type = "text";
      commentInput.placeholder = "Enter comment";
      commentInput.classList.add("text-field");
  
      const saveCommentBtn = document.createElement("button");
      saveCommentBtn.textContent = "Save Comment";
  
      saveCommentBtn.addEventListener("click", () => {
        const trimmedValue = commentInput.value.trim();
        if (trimmedValue !== "") {
          const saveDate = new Date().toISOString(); 
          const newComment = createCommentItem(trimmedValue, saveDate);
          commentsContainer.appendChild(newComment);
          saveCommentToLocalStorage(commentsContainer, trimmedValue, saveDate);
          commentInput.value = "";
        }
      });
  
      commentsContainer.appendChild(commentInput);
      commentsContainer.appendChild(saveCommentBtn);
    });
  }
  
  function createCommentItem(commentText, saveDate) {
    const commentItem = document.createElement("div");
    commentItem.classList.add("comment-item");
  
    const commentTextElement = document.createElement("span");
    commentTextElement.classList.add("comment-text");
    commentTextElement.textContent = commentText;
  
    const saveDateElement = document.createElement("span");
    saveDateElement.classList.add("comment-date");
    saveDateElement.textContent = new Date(saveDate).toLocaleString(); // Convert save date to a readable format
  
    commentItem.appendChild(saveDateElement);
    commentItem.appendChild(commentTextElement);
    
    return commentItem;
  }
  
  function saveCommentToLocalStorage(container, commentText, saveDate) {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    const newComment = { text: commentText, date: saveDate };
    comments.push(newComment);
    localStorage.setItem("comments", JSON.stringify(comments));
  }

  function displaySavedComments() {
    const commentsContainer = cardDetailsContent.querySelector(".comments");
    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  
    savedComments.forEach(comment => {
      const commentItem = createCommentItem(comment.text, comment.date);
      commentsContainer.appendChild(commentItem);
    });
  }
  
  // Call the function to display saved comments when the page loads
  displaySavedComments();


  const addAttachmentsBtn = cardDetailsContent.querySelector("#addAttachmentsBtn");
  if (addAttachmentsBtn) {
    addAttachmentsBtn.addEventListener("click", () => {
      // Create an input element for file upload
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*, .pdf, .doc, .docx"; // You can specify accepted file types
  
      // Listen for file selection
      fileInput.addEventListener("change", () => {
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
          // Save the file to localStorage
          saveAttachmentToLocalStorage(selectedFile);
  
          // Display the saved file
          displaySavedAttachments(cardDetailsContent);
        }
      });
  
      // Trigger the file input click event
      fileInput.click();
    });

  }

  
  
  // Function to save attachment to localStorage
  function saveAttachmentToLocalStorage(file) {
    const attachments = JSON.parse(localStorage.getItem("attachments")) || [];
    attachments.push(file.name); // You can save the file name or other relevant information
    localStorage.setItem("attachments", JSON.stringify(attachments));
  
     // localStorage.setItem(file.name, file);
  }
  
  
  // Function to display saved attachments
  function displaySavedAttachments(container) {
    const attachmentsContainer = container.querySelector(".attachments");
    attachmentsContainer.innerHTML = ""; // Clear the container
  
    const attachments = JSON.parse(localStorage.getItem("attachments")) || [];
    attachments.forEach(attachmentName => {
      const attachmentItem = document.createElement("div");
      attachmentItem.classList.add("attachment-item");
  
      const attachmentLink = document.createElement("a");
      attachmentLink.href = attachmentName; // You can set the correct link based on your needs
      attachmentLink.textContent = attachmentName;
      attachmentLink.target = "_blank"; // Open link in a new tab
  
      attachmentItem.appendChild(attachmentLink);
      attachmentsContainer.appendChild(attachmentItem);
    });
  }
  
  
  // Call the displaySavedAttachments function on page load to display saved attachments
  displaySavedAttachments(cardDetailsContent);
}
});