let draggedSlot = null;

for (let i = 0; i < 54; i++) {
    const btn = document.getElementById(`slot${i}`);
    if (!btn) continue;

    btn.addEventListener('dragstart', function (e) {
        draggedSlot = i;
        e.dataTransfer.effectAllowed = "move";
    });

    btn.addEventListener('dragend', function () {
        draggedSlot = null;
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
}

const container = document.getElementById('mainContainer');

container.addEventListener('dragover', function (e) {
    if (e.target.classList.contains('tempslot')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }
});

container.addEventListener('drop', function (e) {
    if (!e.target.classList.contains('tempslot') ||draggedSlot === null) return;
    e.preventDefault();

    let slotId = e.target.querySelector(".tempslotid");
    if (!slotId) return;

    slotId.textContent = draggedSlot;
    draggedSlot = null;
    updateInventory();
});
