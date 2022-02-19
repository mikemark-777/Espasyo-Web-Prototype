//for tab manipulation =================================

var tabButtons = document.querySelectorAll(".tabContainer .buttonContainer button");
var tabPanels = document.querySelectorAll(".tabContainer  .tabPanel");

function showPanel(panelIndex) {
    tabButtons.forEach(function (node) {
        node.style.backgroundColor = "white";
        node.style.borderBottom = "";
        node.style.color = "#3E6565";
        node.style.fontWeight = "normal";
    });
    tabButtons[panelIndex].style.backgroundColor = "white";
    tabButtons[panelIndex].style.borderBottom = "5px solid #FF751F";
    tabButtons[panelIndex].style.color = "#273F3F";
    tabButtons[panelIndex].style.fontWeight = "bold";
    tabPanels.forEach(function (node) {
        node.style.display = "none";
    });
    tabPanels[panelIndex].style.display = "block";
    tabPanels[panelIndex].style.backgroundColor = "#C0D8D8";
    tabPanels[panelIndex].style.color = "black";


    if (panelIndex == 0) {
        showPropertyList();
    } else if (panelIndex == 1) {
        showLandlordList();
    }

}

// show property list
function showPropertyList() {

}

function showLandlordList() {
    //window.alert("showing landlord list");
}

function renderAllPropertiesToTable(properties) {
    tbody.innerHTML = "";
    admins.forEach(admin => {
        renderAdminToTable(admin.adminID, admin.firstName, admin.lastName, admin.email, admin.password);
    })
}