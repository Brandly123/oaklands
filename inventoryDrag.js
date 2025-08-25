let draggedSlot = null;

for (let i = 0; i < 60; i++) {
    const btn = document.getElementById(`slot${i}`);
    if (!btn) continue;

    btn.addEventListener('dragstart', function (e) {
        draggedSlot = i;
        e.dataTransfer.effectAllowed = "move";
    });

    btn.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });

    btn.addEventListener('drop', function (e) {
        e.preventDefault();
        if (draggedSlot === null || draggedSlot === i) return;
        
        const temp = inventory[draggedSlot];
        
        inventory[draggedSlot] = inventory[i];
        inventory[i] = temp;
        updateInventory();
        draggedSlot = null;
    });

    btn.addEventListener('dragend', function () {
        draggedSlot = null;
    });
}