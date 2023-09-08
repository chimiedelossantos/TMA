const addProjectBtn = document.getElementById("addProjectBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const projectNameInput = document.getElementById("projectName");
const projectDescriptionInput = document.getElementById("projectDescription");
const saveBtn = document.getElementById("saveBtn");
const projectContainer = document.getElementById("projectContainer");
const membersList = document.getElementById("membersList");
const addMemberBtn = document.getElementById("addMemberBtn");
const memberRoleDropdown = document.getElementById("memberRoleDropdown");
const memberNameInput = document.getElementById("memberNameInput");
const memberEmailInput = document.getElementById("memberEmailInput");
const memberRoleInput = document.getElementById("memberRoleInput");
const confirmAddMemberBtn = document.getElementById("confirmAddMemberBtn");



function startUp(){
  popup.style.display = "none";
}

//localStorage.clear();

addProjectBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

const addedMembers = [];


closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Load saved projects from localStorage
savedProjects = JSON.parse(localStorage.getItem("projects")) || [];

// Display saved projects on page load
savedProjects.forEach(project => {
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project");
  projectDiv.innerHTML = `
    <h3>${project.name}</h3>
    
  `;
  projectContainer.appendChild(projectDiv);
});

saveBtn.addEventListener("click", () => {
  const projectName = projectNameInput.value;
  const projectDescription = projectDescriptionInput.value;

  if (projectName) {
    const project = {
      name: projectName,
      description: projectDescription,

    };
    savedProjects.push(project);
    localStorage.setItem("projects", JSON.stringify(savedProjects));

    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");
    projectDiv.innerHTML = `
      <h3>${projectName}</h3>
      <p>${projectDescription}</p>
    `;
    projectContainer.appendChild(projectDiv);

    addedMembers.length = 0;

    projectNameInput.value = "";
    projectDescriptionInput.value = "";
    popup.style.display = "none";

    window.location.reload();
  }
});


const projectBoxes = document.querySelectorAll(".project");
projectBoxes.forEach((projectBox, index) => {
  projectBox.addEventListener("click", () => {
    const project = savedProjects[index];
    if (project) {
      localStorage.setItem("selectedProject", JSON.stringify(project));
      window.location.href = "project.html";
    }
  });
});

