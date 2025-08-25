let time = 0;
let maxTime = 1;
let action = null;
let htmlThings = [
    `You see a forest of oak trees up ahead. There's a large poplar tree covering a bridge to get there.
    There's a small mound of dirt here and a few balsa trees. You'll need to get an axe to chop anything down.<br><br>

    <div>
    <button onclick="switchAction('dirt','mining',1)">Dig the mound</button>
    <button onclick="switchAction('chop','woodcutting',4)">Chop a balsa tree</button>
    <button onclick="switchAction('chop2','woodcutting',7)">Chop the large poplar tree</button>
    <button onclick="switchAction('mine','mining',12)">Mine some stone</button></div>`,

    `There's just a small forest. There's a man chopping wood here.<br>
    <button onclick="switchAction('chop2','woodcutting',4)">Chop the poplar tree</button>
<br>
    <button onclick="switchAction('pickaxe','none',2)">Buy a pickaxe for free</button>
    <button onclick="switchAction('axe','none',2)">Buy a pickaxe for free</button>

    <button onclick="fightFarmer()" class="fight">Attack!</button>`,
], inventory = [];
for(var i=0; i<60; i++) inventory.push(["empty", 0]);
//inventory[0] = ["stone axe", 1];

function switchAction(act,type,timed=1) {
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
        default:
            item = ["empty",1];
    }

    if(!item) return alert(`You need a tool that can do ${type} to do this action.`);

    action = act;
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
    for(let i=0; i<60; i++) {
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
function digDirt() {
    let gain = Math.ceil(Math.random() * 3);
    addItem("dirt", gain);
    addItem("stone", Math.floor(Math.random() * 1.1));

    updateInventory();
}
function chop() {
    let gain = Math.ceil(Math.random() * 2);
    addItem("balsa log", gain);

    updateInventory();
}
function chop2() {
    let gain = Math.ceil(Math.random() * 2);
    addItem("poplar log", gain);

    updateInventory();
}
function mine() {
    let gain = Math.ceil(Math.random() * 4);
    addItem("stone", gain);

    updateInventory();
}
function pickaxe() {
    let gain = 1;
    addItem("stone pickaxe", gain);

    updateInventory();
}
function axe() {
    let gain = 1;
    addItem("stone axe", gain);

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
        case "chop2":
            chop2();
            break;
        case "mine":
            mine();
            break;
        case "pickaxe":
            pickaxe();
            break;
        case "axe":
            axe();
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
tabButtonPressed(0);
updateInventory();
setInterval(() => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000;
    previousTime = currentTime;

    if(action === null) return;

    if(progress >= 1) {
        time -= maxTime;
        doAction(action);
    }

    setProgress(progress);
    time += deltaTime;
    progress = time/maxTime;
}, 50)