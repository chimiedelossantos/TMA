function projStartUp() {
  popup.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  projStartUp();

  const projectNameElement = document.getElementById("projectName");
  const projectDescriptionElement = document.getElementById("projectDescription");

  const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
  if (selectedProject) {
    projectNameElement.textContent = selectedProject.name;
    projectDescriptionElement.textContent = selectedProject.description;
  
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
      boardDiv.draggable = true; // Enable draggable
      boardDiv.innerHTML = `
        <h3>${board.name}</h3>
      `;
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
    });

    boardContainer.addEventListener("drop", (event) => {
      event.preventDefault();
      if (draggedBoard) {
        const draggedIndex = Array.from(boardContainer.children).indexOf(draggedBoard);
        const dropIndex = Array.from(boardContainer.children).indexOf(event.target);
        const tempBoard = savedBoards[draggedIndex];
        savedBoards[draggedIndex] = savedBoards[dropIndex];
        savedBoards[dropIndex] = tempBoard;
        boardContainer.insertBefore(draggedBoard, event.target);
        localStorage.setItem("boards", JSON.stringify(savedBoards)); // Save updated order
      }
    });

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
        `;
        boardContainer.appendChild(boardDiv);

        boardNameInput.value = "";
        boardColorInput.value = "";

        popup.style.display = "none";
      }
    });
  } else {
    projectNameElement.textContent = "No project selected.";
    projectDescriptionElement.textContent = "";
  }
});
