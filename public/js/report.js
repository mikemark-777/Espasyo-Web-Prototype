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
    tabPanels[panelIndex].style.backgroundColor = "white";
    tabPanels[panelIndex].style.color = "black";


    if (panelIndex == 0) {
        showPropertyList();
    } else if (panelIndex == 1) {
        showLandlordList();
    }

}

// show property list
function showPropertyList() {
    fetchPropertyListInDatabase();
}

function showLandlordList() {
    //window.alert("showing landlord list");
}

// for rendering the list of properties into the table ===============================

var tbody = document.getElementById('property-list-body');

function renderAllPropertiesToTable(properties) {
    tbody.innerHTML = "";
    var count = 0;
    properties.forEach(property => {
        count = count + 1;
        renderPropertyToTable(count, property.name, property.address, property.propertyType);
    })
}

function renderPropertyToTable(count, name, address, type) {

    let trow = document.createElement("tr");
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');


    td1.innerHTML = count;
    td2.innerHTML = name;
    td3.innerHTML = address;
    td4.innerHTML = type;
    td5.innerHTML = "landlord";
    td6.innerHTML = "07-01-2022";

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);
    tbody.append(trow);
}

//for rendering the landlord list in the table==============================
