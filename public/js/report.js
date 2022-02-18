var tabButtons = document.querySelectorAll(".tabContainer .buttonContainer button");
var tabPanels = document.querySelectorAll(".tabContainer  .tabPanel");

function showPanel(panelIndex, colorCode) {
    tabButtons.forEach(function (node) {
        node.style.backgroundColor = "";
        node.style.borderBottom = "";
        node.style.color = "";
    });
    tabButtons[panelIndex].style.backgroundColor = "white";
    tabButtons[panelIndex].style.borderBottom = "5px solid red";
    tabButtons[panelIndex].style.color = "black";
    tabPanels.forEach(function (node) {
        node.style.display = "none";
    });
    tabPanels[panelIndex].style.display = "block";
    tabPanels[panelIndex].style.backgroundColor = "#638A9B";
}