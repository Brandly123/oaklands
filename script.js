let time = 0;
let maxTime = 1;
let action = null;
let actionDescription = "";
let htmlThings = [
    `You see a forest of poplar trees up ahead. There's a large poplar tree covering a bridge to get there.
    There's a small, rocky mound and a few balsa trees. You'll need to get an axe to chop anything down.<br><br>

    <div>
    <button onclick="switchAction('dirt','mining',0.01)">Dig the mound</button>
    <button onclick="switchAction('chop','woodcutting',4)">Chop a balsa tree</button>
        <br><br>
    <button onclick="switchAction('chop2','woodcutting',7)">Chop the large poplar tree</button>
    `,

    `This seems to be a forest. Looking around, you see some poplar trees and stone. There's a strange farmer-looking person sitting on the ground.
    There's a sign near the farmer that says 'FREE PICKAXE HERE' (Placeholder). There's also a stream with what seems to be a small town up ahead,
    but the bridge seems to be broken.<br><br>
    <button onclick="switchAction('chop2','woodcutting',4)">Chop the poplar tree</button>
    <button onclick="switchAction('mine','mining',12)">Mine some stone</button></div>
        <br><br>
    <button onclick="switchAction('pickaxe',null,2)">Buy a pickaxe for free</button>
    <button onclick="switchAction('axe',null,2)">Buy a pickaxe for free</button>
        <br><br>
    <button onclick="switchAction('dirt','temporary',2)">(Placeholder Button) Repair the bridge</button>
        <br><br>
    <button onclick="fightFarmer()" class="fight">Attack!</button>`,
    `Nothing here yet, except for a basic saving system<br><br>
    <button onclick="exports()">Export Inventory</button>
    <button onclick="imports()">Import Inventory</button> <textarea id="importArea" style="width:300px;"></textarea>
    `
], inventory = [];
for(var i=0; i<54; i++) inventory.push(["empty", 0]);
//inventory[0] = ["stone axe", 1];

function exports() {
    document.getElementById("mainContainer").innerHTML = (btoa(JSON.stringify(inventory)))
}
function imports() {
    inventory = JSON.parse(atob(document.getElementById("importArea").value));
    updateInventory();
}

function switchAction(act,type,timed=1,actionDesc) {
    let item;
    switch(type) {
        case "woodcutting":
            item = getBestItem("axe");
            break;
        case "mining":
            item = getBestItem("pickaxe");
            break;
        case "gathering":
            item = getBestItem("shears");
            break;
        case "temporary":
            break;
        default:
            item = ["empty",0.6];
    }

    if(!item && act != "dirt") return alert(`You need a tool that can do ${type} to do this action.`);

    action = act;
    if(actionDesc) actionDescription = actionDesc;
    else actionDescription =  " ~ " + act.charAt(0).toUpperCase() + act.slice(1) + " (" + type + ")";
    time = 0;
    maxTime = timed / item[1];
}

function fightFarmer() {
    alert("you fight very hard.. and get injured, and ran. But you pickpocketed him while you ran away.");
    addItem("coin", 1)
}

const order = [
    ["iron",1.2],
    ["stone",1.0]
];

function getBestItem(type) {
    for (let axe of order) {
        if (inventory.some(item => item[0] === (axe[0] + " " + type) && item[1] > 0)) {
            return axe;
        }
    }
    return null;
}

function updateInventory() {
    for(let i=0; i<54; i++) {
        const slot = document.getElementById(`slot${i}`);
        
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
            slot.appendChild(document.createElement('br'));

            const text = document.createTextNode(+ inventory[i][1]);
            slot.appendChild(text);
        }
    }
}

function addItem(type, amount) {
    if(amount <= 0) return;
    let slot = inventory.find(item => item[0] === type);

    if(slot) {
        slot[1] += amount;
    } else {
        let empty = inventory.findIndex(item => item[0] === "empty")
        
        if (empty !== null) inventory[empty] = [type, amount];
    }

    updateInventory();
}
function rand(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function doAction(type) {
    switch(type) {
        case "dirt":
            addItem("dirt", rand(1,3));
            addItem("stone", rand(0,0.4));
            break;

        case "chop":
            addItem("balsa log", rand(1,2)); break;

        case "chop2":
            addItem("poplar log", rand(1,2)); break;

        case "mine":
            addItem("stone", rand(2,5)); break;

        case "pickaxe":
            addItem("stone pickaxe", 1); break;

        case "axe":
            addItem("stone axe", 1); break;

        default:
            alert("Game bugged: " + btoa(type)); break;
    }

    updateInventory();
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
tabButtonPressed(0);
updateInventory();

function addInfoText(text) {
    const info = document.getElementById('infoContainer');
    if (!info) return;
    info.innerHTML = text + "<br>" + info.innerHTML;
    if(info.innerHTML.length >= 500) info.innerHTML = info.innerHTML.slice(0, 500) + "...";
}

setInterval(() => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000;
    document.getElementById("progressText").innerText = actionDescription;
    previousTime = currentTime;

    if(action === null) return;

    if(progress >= 1) {
        for(var i=0; i<100; i++){
            if(time/maxTime <= 1) break;

            addInfoText("You completed doing " + actionDescription);
            time -= maxTime;
            doAction(action);
        }
    }

    setProgress(progress);
    time += deltaTime;
    progress = time/maxTime;
}, 50)