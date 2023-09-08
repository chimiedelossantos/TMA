const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
const savedCards = JSON.parse(localStorage.getItem("cards")) || [];

// Projects Report
function projectReport(data, filename) {
    const csvData = convertProjectsToCSV(data);
    downloadCSV(csvData, filename);
    alert("Project report downloaded");
}

// Boards Report
function boardReport(data, filename) {
    const csvData = convertBoardsToCSV(data);
    downloadCSV(csvData, filename);
    alert("Boards report downloaded");
}

// Cards Report
function cardReport(data, filename) {
    const csvData = convertCardsToCSV(data);
    downloadCSV(csvData, filename);
    alert("Cards report downloaded");
}

function downloadCSV(csvData, filename) {
    const csvBlob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(csvBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
}

function convertProjectsToCSV(data) {
    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data.map(item => Object.values(item).join(",")).join("\n");
    return header + rows;
}

function convertBoardsToCSV(data) {
    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data.map(item => Object.values(item).join(",")).join("\n");
    return header + rows;
}

function convertCardsToCSV(data) {
    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data.map(item => Object.values(item).join(",")).join("\n");
    return header + rows;
}

const projectReportBtn = document.getElementById("projectReport");
projectReportBtn.addEventListener("click", () => {
    projectReport(savedProjects, "project_data.csv");
});

const boardReportBtn = document.getElementById("boardReport");
boardReportBtn.addEventListener("click", () => {
    boardReport(savedBoards, "board_data.csv");
});

const cardReportBtn = document.getElementById("cardReport");
cardReportBtn.addEventListener("click", () => {
    cardReport(savedCards, "card_data.csv");
});

document.body.appendChild(projectReportBtn);
document.body.appendChild(boardReportBtn);
document.body.appendChild(cardReportBtn);


const deleteDataBtn = document.getElementById("deleteData");

deleteDataBtn.addEventListener("click", () => {
    console.log("Button clicked!");
    deleteAllLocalStorage();
});      

function deleteAllLocalStorage() {
    localStorage.clear();
    console.log("All data in local storage has been deleted.");
    alert("All data in local storage has been deleted.")
}