const inventoryTable = document.getElementById("inventory");
if (inventoryTable) {
    let html = "<tr>";
    for (let col = 0; col < 6; col++) {
        html += "<td>";
        for (let row = 0; row < 10; row++) {
            const slot = col * 10 + row;
            html += `<button id="slot${slot}"></button>`;
        }
        html += "</td>";
    }
    html += "</tr>";
    inventoryTable.innerHTML = html;
}