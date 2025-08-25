let time = 0;
let maxTime = 1;
let action = null;
let htmlThings = [
    `You see a forest of oak trees up ahead. There's a large poplar tree covering a bridge to get there.
    There's a small mound of dirt here and a few balsa trees. You'll need to get an axe to chop anything down.<br><br>

    <div>
    <button onclick="switchAction('dirt',1)">Dig the mound</button>
    <button onclick="switchAction('chop',4)">Chop a balsa tree</button>
    <button onclick="switchAction('chop',7)">Chop the large poplar tree</button>
    <button onclick="switchAction('mine',1200)">Mine some stone (with fists)</button></div>`,

    `There's just a small forest. There's a man chopping wood here.<br>
    <button onclick="switchAction('dirt',2)">Dig</button>
    <button onclick="switchAction('chop',3)">Chop the poplar tree</button>
    <button onclick="fightFarmer()" class="fight">Attack!</button>`,
], inventory = [];
for(var i=0; i<60; i++) inventory.push(["empty", 0]);

function switchAction(type,timed=1) {
    action = type;
    time = 0;
    maxTime = timed;
}

function fightFarmer() {
    alert("you fight very hard.. and get injured, and ran. But you pickpocketed him while you ran away.");
    addItem("coin", 1)
}
function updateInventory() {
    for(let i=0; i<60; i++) {
        const slot = document.getElementById(`slot${i}`);
        console.log(inventory[i]);
        
        if(inventory[i][0] === "empty") {
            slot.innerHTML = "";
        } else {
            slot.innerHTML = "";
            // Create an img element
            const img = document.createElement('img');
            img.src = `assets/${inventory[i][0]}.png`; 
            img.alt = inventory[i][0];
            img.width = 32;
            slot.appendChild(img);

            const text = document.createTextNode(inventory[i][1]);
            slot.appendChild(text);
        }
    }
}

function addItem(type, amount) {
    let slot = inventory.find(item => item[0] === type);

    if(slot) {
        slot[1] += amount;
    } else {
        let empty = inventory.findIndex(item => item[0] === "empty")
        
        if (empty !== null) inventory[empty] = [type, amount];
    }

    updateInventory();
}
function digDirt() {
    let gain = Math.ceil(Math.random() * 3);
    addItem("dirt", gain);

    updateInventory();
}
function chop() {
    let gain = Math.ceil(Math.random() * 2);
    addItem("log", gain);

    updateInventory();
}
function mine() {
    let gain = 9999;
    addItem("stone", gain);

    updateInventory();
}
function doAction(type) {
    switch(type) {
        case "dirt":
            digDirt();
            break;
        case "chop":
            chop();
            break;
        case "mine":
            mine();
            break;
        default:
            alert("Buggy buggy! Report this to the devs!");
            break;
    }
}

function tabButtonPressed(id) {
    mainContainer.innerHTML = htmlThings[id];
}


document.querySelectorAll('#tabContainer button').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('#tabContainer button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});


function setProgress(value) {
    if (value <= 0) value = 0;
    if (value >= 1) value = 1;
    const bar = document.getElementById("progress");
    bar.style.width = value * 100 + '%';
}

let previousTime = performance.now();


let progress = 0;
setInterval(() => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000; // seconds elapsed
    previousTime = currentTime;

    if(action === null) return;

    if(progress >= 1) {
        time = 0;
        doAction(action);
    }

    setProgress(progress);
    time += deltaTime;
    progress = time/maxTime;
    if (progress > 1) clearInterval(interval);
}, 50)