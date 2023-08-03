function projStartUp(){
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
   boardDiv.innerHTML = `
     <h3>${board.name}</h3>
   `;
   boardContainer.appendChild(boardDiv);
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
     // Process board creation or saving here
     const board = { name: boardName, color: boardColor, projectName: projectName };
     savedBoards.push(board);
     localStorage.setItem("boards", JSON.stringify(savedBoards));

     const boardDiv = document.createElement("div");
     boardDiv.classList.add("board");
     boardDiv.style.setProperty("--board-color", boardColor);
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