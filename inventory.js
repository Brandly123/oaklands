const inventoryTable = document.getElementById("inventory");
if (inventoryTable) {
    let html = "<tr>";
    for (let col = 0; col < 6; col++) {
        html += "<td>";
        for (let row = 0; row < 9; row++) {
            const slot = col * 9 + row;
            html += `<button id="slot${slot}" draggable="true"></button>`;
        }
        html += "</td>";
    }
    html += "</tr>";
    inventoryTable.innerHTML = html;
}



function switchInventoryTab(tabName) {
    document.querySelectorAll('.inventoryTab').forEach(div => {
        div.style.visibility = `hidden`;
        div.style.display = `none`;
    });

    
    document.querySelectorAll('#inventoryTabs button').forEach(btn => {
        btn.classList.remove('active');
    });

    const tabDiv = document.getElementById(tabName);
    tabDiv.style.visibility = 'visible';
    tabDiv.style.display = 'block';

    document.querySelectorAll('#inventoryTabs button').forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${tabName}'`)) {
            btn.classList.add('active');
        }
    });
}
switchInventoryTab('inventory');