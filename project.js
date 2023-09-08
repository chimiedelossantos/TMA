function projStartUp() {
  popup.style.display = "none";
  cardPopup.style.display = "none";
  //localStorage.clear();
  teamMemberPopup.style.display = "none";
  editPopup.style.display = "none";
  editCardPopup.style.display = "none";
}

//Display of progress bar
const loadedSavedCardsCount = localStorage.getItem("savedCardsCount");
const loadedCompletedCardCount = localStorage.getItem("completedCardsCount");
        


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
    const teamMembersImg = document.getElementById("teamMembers");
    const teamMemberPopup = document.getElementById("teamMemberPopup");
    const closeTeamMemberPopup = document.getElementById("closeTeamMemberPopup");
    const saveTeamMemberBtn = document.getElementById("saveTeamMemberBtn");
    const editPopup = document.getElementById("editPopup");
    

    function completionStatusReport(){
              
      const progressBarReport = document.getElementById("progressBarReport");
      const loadedCompletionPercentage = localStorage.getItem(`${selectedProject.name}_completionPercentage`);
      console.log(loadedCompletionPercentage);
              
      progressBarReport.style.width = `${loadedCompletionPercentage}%`;
      progressBarReport.textContent = `${loadedCompletionPercentage}% Complete`;             
  }
  
  completionStatusReport();

    teamMembersImg.addEventListener("click", () => {
      const selectedProjectName = document.getElementById("projectName").textContent;
      // Store the selected project name in a data attribute of the popup
      teamMemberPopup.setAttribute("data-project-name", selectedProjectName);
    
      // Clear the existing list of team members
      const teamMembersList = document.getElementById("teamMembersList");
      teamMembersList.innerHTML = "";
    
      // Load saved team members from local storage
      const savedTeamMembers = JSON.parse(localStorage.getItem(`${selectedProjectName}_teamMembers`)) || [];
    
      // Display saved team members in the list
      savedTeamMembers.forEach(member => {
        const memberItem = document.createElement("li");
        memberItem.textContent = `${member.name} - ${member.role}`;
        teamMembersList.appendChild(memberItem);
      });
    
      teamMemberPopup.style.display = "flex";
    });

    closeTeamMemberPopup.addEventListener("click", () => {
      teamMemberPopup.style.display = "none";
    });
    
    saveTeamMemberBtn.addEventListener("click", () => {
      const teamMemberName = document.getElementById("teamMemberName").value;
      const teamMemberEmail = document.getElementById("teamMemberEmail").value;
      const teamMemberRole = document.getElementById("teamMemberRole").value;
    
      const selectedProjectName = teamMemberPopup.getAttribute("data-project-name");
    
      if (teamMemberName && teamMemberEmail && teamMemberRole && selectedProjectName) {
        const newTeamMember = {
          name: teamMemberName,
          email: teamMemberEmail,
          role: teamMemberRole
        };
    
        // Get existing team members from local storage or create an empty array
        const savedTeamMembers = JSON.parse(localStorage.getItem(`${selectedProjectName}_teamMembers`)) || [];
        
        // Add the new team member to the array
        savedTeamMembers.push(newTeamMember);
    
        // Save the updated array to local storage
        localStorage.setItem(`${selectedProjectName}_teamMembers`, JSON.stringify(savedTeamMembers));
    
        // Clear input fields
        document.getElementById("teamMemberName").value = "";
        document.getElementById("teamMemberEmail").value = "";
    
        // Close the popup
        teamMemberPopup.style.display = "none";
      } else {
        alert("Please fill in all fields.");
      }
    });


    // Load saved boards from localStorage
    savedBoards = JSON.parse(localStorage.getItem("boards")) || [];

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
      <img class="editBoard" src="edit.png" alt="edit">
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
      
      const updatedStatus = card.status === "Complete" ? "Complete" : "";


      // Display card name and target date together
      cardDiv.innerHTML = `
      <div class = "cardSummary ">
        <span class="card-name" >${card.cardName}</span>
        <span class="assigned-member">${card.assignedMemberName ? card.assignedMemberName : 'No assigned member'}</span>
        <span class="target-date">${card.targetDate}</span>
      </div>
      <div class = "cardSummary1">
      <span>
      <img class="editCardSummary" src="edit.png" alt="Edit Other Card">
      ${updatedStatus === "Complete" ? '<img class="complete" src="complete.png">' : ''}
      ${dueDateStatus === "reminder" ? '<img class="reminder" src="reminder.png">' : ''}
      ${dueDateStatus === "delayed" ? '<img class="delayed" src="delayed.png">' : ''}
      </span>
      </div>
      `;
  
      cardDiv.setAttribute("data-card-id", card.cardId);

      cardDiv.addEventListener("click", () => {
           eachCardDetails(selectedProject, board.name, card.cardName, card.cardId);
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



const cardElements = document.querySelectorAll(".card");

  cardElements.forEach(cardElement => {
    // Get the target date from the card's target date element
    const targetDateElement = cardElement.querySelector(".target-date");
    const targetDate = targetDateElement.textContent; // Extract the target date value
    
    const dueDateStatus = checkDueDate(targetDate);
    const reminderIcon = document.querySelectorAll("reminder");
    const delayedIcon = document.querySelectorAll("delayed");
    console.log();
    const statusCheckbox = document.querySelectorAll("#status");
    const updatedStatus = statusCheckbox.checked ? "Complete" : "Incomplete";
    const completeIcon = document.querySelectorAll("complete");

    if (updatedStatus === "Complete") {
      const completeIcon = document.createElement("img");
      completeIcon.src = "complete.png"; 
      completeIcon.className = "complete";
    
      cardElement.appendChild(completeIcon);
      completeIcon.style.display = "block";

    } 
  });
  });// check if I should close here


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


  const editBoardBtns = document.querySelectorAll(".editBoard");
  let selectedBoardDetails = {
    name: "",
    color: ""
  };
  

  editBoardBtns.forEach(editBoardBtn => {
    editBoardBtn.addEventListener("click", () => {
      const boardDiv = editBoardBtn.closest(".board");
      selectedBoardDetails.name = boardDiv.querySelector("h3").textContent;
      selectedBoardDetails.color = boardDiv.style.getPropertyValue("--board-color");
  
      cardPopup.style.display = "none";
      editPopup.style.display = "flex";

      editBoardNameInput.value = selectedBoardDetails.name;
      editBoardColorInput.value = selectedBoardDetails.color;

      const saveEditBtn = document.getElementById("saveEditBtn");
      savedCards = JSON.parse(localStorage.getItem("cards")) || [];

      saveEditBtn.addEventListener("click", () => {
        const updatedBoards = savedBoards.map(board => {
          if (board.name === selectedBoardDetails.name) {
            return {
              name: editBoardNameInput.value,
              color: editBoardColorInput.value,
              projectName: board.projectName
            };
          } else {
            return board;
          }
        });
  
        // Update the localStorage with the updated boards
        localStorage.setItem("boards", JSON.stringify(updatedBoards));

        const updatedCards = savedCards.map(card => {
          if (card.boardName === selectedBoardDetails.name) {
            return {
              ...card,
              boardName: editBoardNameInput.value
            };
          } else {
            return card;
          }
        });
      
        // Update the localStorage with the updated card details
        localStorage.setItem("cards", JSON.stringify(updatedCards));
        // Close the edit popup
        editPopup.style.display = "none";
        cardPopup.style.display = "none";
        window.location.reload();
      })
      const cancelEditBtn = document.getElementById("cancelEditBtn");

      cancelEditBtn.addEventListener("click", () => {
        editPopup.style.display = "none";
        cardPopup.style.display = "none";
      })
      //deletion of Board
      const deleteBoardBtn = document.getElementById("deleteBoardBtn");

      deleteBoardBtn.addEventListener("click", () => {
        const confirmDelete = confirm(
          "Are you sure you want to delete the current board and all its cards? This action cannot be undone."
        );
  
        if (confirmDelete) {
          // Remove the board and its cards from savedBoards and savedCards
          const updatedBoards = savedBoards.filter(board => board.name !== selectedBoardDetails.name);
          const updatedCards = savedCards.filter(card => card.boardName !== selectedBoardDetails.name);
  
          // Update the localStorage with the updated boards and cards
          localStorage.setItem("boards", JSON.stringify(updatedBoards));
          localStorage.setItem("cards", JSON.stringify(updatedCards));
  
          editPopup.style.display = "none";
          cardPopup.style.display = "none";
          window.location.reload();

        }
      });
    });
  });

  
  function showCardPopup(boardName) {
    const selectedProjectName = document.getElementById("projectName").textContent;
    const teamMembersList = JSON.parse(localStorage.getItem(`${selectedProjectName}_teamMembers`)) || [];
    const assignedMemberDropdown = document.getElementById("assignedMember");
    const cardPopup = document.getElementById("cardPopup");
    const closeCardPopup = document.getElementById("closeCardPopup");
    const cardNameInput = document.getElementById("cardName");
    const targetDateInput = document.getElementById("targetDate");
    const saveCardBtn = document.getElementById("saveCardBtn");
  
    assignedMemberDropdown.innerHTML = "";
    teamMembersList.forEach(member => {
      const option = document.createElement("option");
      option.value = member.email; 
      option.textContent = member.name;
      assignedMemberDropdown.appendChild(option);
    });

    cardPopup.style.display = "flex";

    let completedCardsCount = 0;

    saveCardBtn.addEventListener("click", () => {
    const cardName = cardNameInput.value;
    const targetDate = targetDateInput.value;
    const assignedMemberEmail = assignedMemberDropdown.value;
    const assignedMemberName = assignedMemberDropdown.value;

    function generateUniqueId() {
      return Math.random().toString(36).substr(2, 9);
    }

    if (cardName) {
      const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
    if (selectedProject) {
      const newCardId = generateUniqueId(); // Generate a new unique cardId for the new card
      console.log(newCardId);
      const card = {
        cardId: newCardId,  
        cardName: cardName,
        targetDate: targetDate,
        boardName: boardName,
        projectName: selectedProject.name,
        assignedMemberName: assignedMemberName,
        assignedMemberEmail: assignedMemberEmail
      };



     // Clear the dropdown and add options
      assignedMemberDropdown.innerHTML = "";
      teamMembersList.forEach(member => {
        const option = document.createElement("option");
        option.value = member.email; 
        option.textContent = member.name;
        assignedMemberDropdown.appendChild(option);
      });


      // Save the card details to localStorage or perform other actions
      savedCards = JSON.parse(localStorage.getItem("cards")) || [];
      savedCards.push(card);
      localStorage.setItem("cards", JSON.stringify(savedCards));
      console.log(cardId);

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

      const savedCardsCount = savedCards.filter(card => card.projectName === selectedProject.name).length;
      
         
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
  const cardId = event.target.getAttribute("data-card-id");
  console.log(cardId);
  event.dataTransfer.setData("text/plain", cardId);
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
    console.log("Target Board Element:", targetBoard); 
    if (targetBoard) {
      const targetBoardName = targetBoard.querySelector("h3").textContent;
      console.log("Updating board:", targetBoardName);
      // Update the card's boardName in localStorage
      const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
      const updatedCards = savedCards.map(card => {
        if (card.cardId === cardId) {
          
          card.boardName = targetBoardName;
        }
        return card;
      });
      console.log("Updated Cards:", updatedCards);
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

function eachCardDetails(selectedProject, boardName, cardName) {
  const eachCardPopupId = `cardPopup_${boardName}_${cardName}`;
  let eachCardPopup = document.getElementById(eachCardPopupId);

  if (!eachCardPopup) {
    eachCardPopup = document.createElement("div");
    eachCardPopup.classList.add("popup");
    eachCardPopup.id = eachCardPopupId;

    // Retrieve the current status from local storage
    
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];

    const card = savedCards.find(
      c =>
        c.projectName === selectedProject.name &&
        c.boardName === boardName &&
        c.cardName === cardName
    );
    const status = card ? card.status : "Incomplete";

    eachCardPopup.innerHTML = `
      <div class="popup-content">
        <span class="close-popup" id="closeEachCardPopup">&times;</span>
        <h2>${cardName}</h2>
        <label for="status">Status:</label>
        <input type="checkbox" id="status" name="status" ${
          status === "Complete" ? "checked" : ""
        }>
        <button id="eachCardSaveBtn">Save</button>
  
        <div class="checklist-container" id="checklistContainer">
          <div class="button-container">
            <button id="addChecklistBtn">+ Checklist</button>
          </div>
          <!-- Checklist items will be dynamically added here -->
        </div>
        <div class="comment-container" id="commentContainer">
          <div class="comments" id="commentsList">
            <!-- Existing comment items will be dynamically added here -->
          </div>
            <input type="text" id="commentInput" placeholder="Add a comment">
            <button id="addCommentBtn">+ Comment</button>
        </div>
        <div class="attachment-container" id="attachmentContainer">
        <button id="addAttachmentBtn">+ Attachment</button>
        <div class="attachments">  
        </div>
        </div>
      </div>
    `;


  // Define addChecklistBtn variable within the eachCardDetails function
  const addChecklistBtn = eachCardPopup.querySelector("#addChecklistBtn");
  const checklistContainer = eachCardPopup.querySelector("#checklistContainer");
  
  // Add event listener for "Add Checklist" button
  addChecklistBtn.addEventListener("click", () => {
    const checklistItemDiv = document.createElement("div");
    checklistItemDiv.classList.add("checklist-item");

    const checklistItemCheckbox = document.createElement("input");
    checklistItemCheckbox.type = "checkbox";

    const checklistItemInput = document.createElement("input");
    checklistItemInput.type = "text";
    checklistItemInput.placeholder = "Add checklist item";

    checklistItemDiv.appendChild(checklistItemCheckbox);
    checklistItemDiv.appendChild(checklistItemInput);

    checklistContainer.appendChild(checklistItemDiv);
  });

    const closeEachCardPopup = eachCardPopup.querySelector(
      "#closeEachCardPopup"
    );
    closeEachCardPopup.addEventListener("click", () => {
      document.body.removeChild(eachCardPopup);
      cardPopup.style.display = "none";
    });

  
    const cardIndex = savedCards.findIndex(c => c.projectName === selectedProject.name && c.boardName === boardName && c.cardName === cardName);
    if (cardIndex !== -1 && savedCards[cardIndex].checklist) {
      const checklistItems = savedCards[cardIndex].checklist;
      checklistItems.forEach(checklistItem => {
        const checklistItemDiv = document.createElement("div");
        checklistItemDiv.classList.add("checklist-item");
  
        const checklistItemCheckbox = document.createElement("input");
        checklistItemCheckbox.type = "checkbox";
        checklistItemCheckbox.checked = checklistItem.checked;
  
        const checklistItemInput = document.createElement("input");
        checklistItemInput.type = "text";
        checklistItemInput.value = checklistItem.text;
  
        checklistItemDiv.appendChild(checklistItemCheckbox);
        checklistItemDiv.appendChild(checklistItemInput);
  
        checklistContainer.appendChild(checklistItemDiv);
      });
    }
    
//Comments Container
const addCommentBtn = eachCardPopup.querySelector("#addCommentBtn");
const commentInput = eachCardPopup.querySelector("#commentInput");
const commentsList = eachCardPopup.querySelector("#commentsList"); 

addCommentBtn.addEventListener("click", () => {
  const commentText = commentInput.value.trim();
  if (commentText !== "") {
    const comment = {
      text: commentText,
      timestamp: new Date().toISOString(),
    };

    if (!card.comments) {
      card.comments = [];
    }
    card.comments.push(comment);

    // Update local storage
    localStorage.setItem("cards", JSON.stringify(savedCards));

    // Clear and update comments list
    commentsList.innerHTML = ""; 
    card.comments.forEach(comment => {
      const commentItem = document.createElement("div");
      commentItem.textContent = `${comment.text} - ${formatCommentTimestamp(comment.timestamp)}`;
      commentItem.classList.add("comment-item");
      commentsList.appendChild(commentItem);
    });

    // Clear comment input field
    commentInput.value = "";
  }
});

function formatCommentTimestamp(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString(); 
  return formattedDate;
}

commentsList.innerHTML = "";

if (card && card.comments) {
  card.comments.forEach(comment => {
    const commentItem = document.createElement("div");
    commentItem.textContent = `${comment.text} - ${formatCommentTimestamp(
      comment.timestamp
    )}`;
    commentItem.classList.add("comment-item");
    commentsList.appendChild(commentItem);
  });
}


    const eachCardSaveBtn = eachCardPopup.querySelector("#eachCardSaveBtn");
    eachCardSaveBtn.addEventListener("click", () => {
      // Handle save button click, e.g., update status in local storage
      const statusCheckbox = eachCardPopup.querySelector("#status");
      const updatedStatus = statusCheckbox.checked ? "Complete" : "Incomplete";
      console.log("Updated Status:", updatedStatus);
  
      // Update the status in local storage and save checklist items
      const cardIndex = savedCards.findIndex(c => c.projectName === selectedProject.name && c.boardName === boardName && c.cardName === cardName);
      if (cardIndex !== -1) {
        savedCards[cardIndex].status = updatedStatus;
  
        const checklistItems = [];
        const checklistItemDivs = checklistContainer.querySelectorAll(".checklist-item");
        checklistItemDivs.forEach(checklistItemDiv => {
          const checkbox = checklistItemDiv.querySelector("input[type='checkbox']");
          const input = checklistItemDiv.querySelector("input[type='text']");
          checklistItems.push({
            text: input.value,
            checked: checkbox.checked,
          });
        });
          savedCards[cardIndex].checklist = checklistItems; 
          savedCards[cardIndex].comments = card.comments;
        localStorage.setItem("cards", JSON.stringify(savedCards));

        if (card && card.comments) {
          card.comments.forEach(comment => {
            const commentItem = document.createElement("div");
            commentItem.classList.add("comment-item");
            commentItem.textContent = `${comment.text} - ${formatCommentTimestamp(comment.timestamp)}`;
            commentsList.appendChild(commentItem);
          });
        }

        const completedCardsCount = savedCards.filter(card => card.projectName === selectedProject.name && card.status === "Complete").length;
        console.log("Completed Cards Count for Selected Project:", completedCardsCount);
        
        const savedCardsCount = savedCards.filter(card => card.projectName === selectedProject.name).length;
        console.log("Saved Cards Count for Selected Project:", savedCardsCount);

        const completionPercentage = (completedCardsCount / savedCardsCount) * 100;

        // Save the completion percentage to localStorage
        localStorage.setItem(`${selectedProject.name}_completionPercentage`, completionPercentage.toFixed(2));
       
      }



        function sendEmail(){

          //window.location.reload();

          if (card.assignedMemberEmail !== ""){
            console.log(card.assignedMemberEmail);
            const templateParams = {

              to_email: (card.assignedMemberEmail),
              message: 'There is an update on the card assigned to you. Please check Task Manager Application.',
            };
            
            emailjs.send('xxxx', 'xxx', templateParams)
              .then(function(response) {
                console.log('Email sent successfully:', response);
                alert("Email has been sent to the assigned team member.")
              }, function(error) {
                console.log('Email sending failed:', error);
              });
 
          } else {
            let assignedMemberEmail = "chimiedelossantos@yahoo.com";
            const templateParams = {
              to_email: assignedMemberEmail,
              message: 'There is an update on the card assigned to you. Please check Task Manager Application.',
            };
            
            emailjs.send('service_7cn5jlr', 'template_y2sw0if', templateParams)
              .then(function(response) {
                console.log('Email sent successfully:', response);
              }, function(error) {
                console.log('Email sending failed:', error);
              });
          }
        }

        sendEmail();
         
        cardPopup.style.display="none";

      // Close the popup
      document.body.removeChild(eachCardPopup);

    });
  
  

    document.body.appendChild(eachCardPopup);

  

    const addAttachmentBtn = eachCardPopup.querySelector("#addAttachmentBtn");
    if (addAttachmentBtn) {
      addAttachmentBtn.addEventListener("click", () => {
        // Create an input element for file upload
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*, .pdf, .doc, .docx"; // You can specify accepted file types
  
        // Listen for file selection
        fileInput.addEventListener("change", () => {
          const selectedFile = fileInput.files[0];
          if (selectedFile) {
            // Find the card in the savedCards array
            const cardIndex = savedCards.findIndex(
              c =>
                c.projectName === selectedProject.name &&
                c.boardName === boardName &&
                c.cardName === cardName
            );
  
            if (cardIndex !== -1) {
              // Update the card's attachments array
              if (!savedCards[cardIndex].attachments) {
                savedCards[cardIndex].attachments = [selectedFile.name];
              } else {
                savedCards[cardIndex].attachments.push(selectedFile.name);
              }
  
              // Update the local storage
              localStorage.setItem("cards", JSON.stringify(savedCards));
  
              // Save the file to local storage
              saveAttachmentToLocalStorage(selectedFile, savedCards[cardIndex]);
  
              // Display the saved file
              displaySavedAttachments(eachCardPopup, savedCards[cardIndex]);
            }
          }
        });
  
        // Trigger the file input click event
        fileInput.click();
      });
    }
  
    
    
    // Function to save attachment to localStorage
    function saveAttachmentToLocalStorage(file, card) {
      const attachments = JSON.parse(localStorage.getItem(`${card.cardId}_attachments`)) || [];
      attachments.push(file.name); // You can save the file name or other relevant information
      localStorage.setItem(`${card.cardId}_attachments`, JSON.stringify(attachments));
      localStorage.setItem(file.name, file);
    }

    
    
    // Function to display saved attachments
    function displaySavedAttachments(container, card) {
      const attachmentsContainer = container.querySelector(".attachments");
      attachmentsContainer.innerHTML = ""; // Clear the container
    
      const attachments = JSON.parse(localStorage.getItem(`${card.cardId}_attachments`)) || [];
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
    displaySavedAttachments(eachCardPopup, card);
   

    //editting of cards

    const editCardSummaryBtns = document.querySelectorAll(".editCardSummary");
    const cardDivs = document.querySelectorAll(".card");
    
    const editCardPopup = document.getElementById("editCardPopup");
    const editCardNameInput = document.getElementById("editCardNameInput");
    const editTargetDateInput = document.getElementById("editTargetDateInput");
    const editAssignedMemberDropdown = document.getElementById("editAssignedMember");
    const saveEditCardBtn = document.getElementById("saveEditCardBtn");
    const cancelCardEditBtn = document.getElementById("cancelCardEditBtn");
    const deleteCardBtn = document.getElementById("deleteCardBtn");
    const cardsContainer = document.querySelector(".cards-container");
    const selectedProjectName = document.getElementById("projectName").textContent;
    const teamMembersList = JSON.parse(localStorage.getItem(`${selectedProjectName}_teamMembers`)) || [];
    
    editCardSummaryBtns.forEach((editCardSummaryBtn) => {
      editCardSummaryBtn.addEventListener("click", () => {
        event.stopPropagation();
        const cardDiv = editCardSummaryBtn.closest(".card");
        const cardId = cardDiv.getAttribute("data-card-id");
        console.log("cardId: ", cardId);
        const selectedCard = savedCards.find(card => card.cardId === cardId);
        console.log("selectedCard: ", selectedCard);
        if (selectedCard) {
          eachCardPopup.style.display = "none";
          // Declare the constants inside the event listener
          const editCardPopup = document.getElementById("editCardPopup");
          const editCardNameInput = document.getElementById("editCardNameInput");
          const editTargetDateInput = document.getElementById("editTargetDateInput");
          const editAssignedMemberDropdown = document.getElementById("editAssignedMember");
    
          editCardNameInput.value = selectedCard.cardName;
          editTargetDateInput.value = selectedCard.targetDate;
    
          // Populate the assigned team member dropdown
          editAssignedMemberDropdown.innerHTML = "";
          console.log(teamMembersList);
          teamMembersList.forEach(member => {
            const option = document.createElement("option");
            option.value = member.email;
            option.textContent = member.name;
            editAssignedMemberDropdown.appendChild(option);
          });
          editAssignedMemberDropdown.value = selectedCard.assignedMemberEmail;
    
          
          editCardPopup.style.display = "flex";

          saveEditCardBtn.addEventListener("click", () => {
            // Update the card details and save to localStorage
            selectedCard.cardName = editCardNameInput.value;
            selectedCard.targetDate = editTargetDateInput.value;
    
            // Update the card in savedCards array
            const cardIndex = savedCards.findIndex(card => card.cardId === cardId);
            if (cardIndex !== -1) {
              savedCards[cardIndex] = selectedCard;
              localStorage.setItem("cards", JSON.stringify(savedCards));
            }
    
            // Close the edit card popup
            window.location.reload();
            editCardPopup.style.display = "none";
            eachCardPopup.display = "none";
    
            // You might want to update the UI here to reflect the changes
          });
    
         cancelCardEditBtn.addEventListener("click", () => {
            
            window.location.reload();
            editCardPopup.style.display = "none";
            eachCardPopup.display = "none";
          });
          const deleteCardBtn = document.getElementById("deleteCardBtn");

          deleteCardBtn.addEventListener("click", () => {
            const confirmDelete = confirm(
              "Are you sure you want to delete the current card and all its details? This action cannot be undone."
            );
      
            if (confirmDelete) {

              const cardIndex = savedCards.findIndex(card => card.cardId === cardId);
    
              if (cardIndex !== -1) {
                savedCards.splice(cardIndex, 1); 
                localStorage.setItem("cards", JSON.stringify(savedCards)); 
                
              editCardPopup.style.display = "none";
              cardPopup.style.display = "none";
              window.location.reload();
    
            }
          }});
        }
      });

});
}
}});



