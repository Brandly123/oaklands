let time = 0;
let maxTime = 1;
let action = null;
let actionDescription = "";
let htmlThings = [
    `You see a forest of poplar trees up ahead. There's a large poplar tree covering a bridge to get there.
    There's a small, rocky mound and a few balsa trees. You'll need to get an axe to chop anything down.<br><br>

    <div>
    <button onclick="switchAction('dirt','mining',1)">Dig the mound</button>
    <button onclick="switchAction('chop','woodcutting',4)">Chop a balsa tree</button>
        <br><br>
    <button onclick="switchAction('chop3','woodcutting',13,5)">Chop the large poplar tree (lvl 5 woodcutting required)</button>
    `,

    `This seems to be a forest. Looking around, you see some poplar trees and stone. There's a strange farmer-looking person sitting on the ground.
    There's also a stream with what seems to be a small town up ahead, but the bridge seems to be broken.<br><br>
    <button onclick="switchAction('chop2','woodcutting',4,5)">Chop a poplar tree (lvl 5 woodcutting required)</button>
    <button onclick="switchAction('mine','mining',7)">Mine some stone</button></div>
    <button onclick="switchAction('tin ore','mining',15,6)">Mine some tin ore (lvl 6 mining required)</button></div>
        <br><br>
    <button onclick="switchAction('dirt','temporary',2)">(Placeholder Button) Repair the bridge</button>
        <br><br>
    <button onclick="fightFarmer()" class="fight">Attack!</button>`,
    `Nothing here yet, except for a basic saving system<br><br>
    <button onclick="exports()">Export Inventory</button>
    <button onclick="imports()">Import Inventory</button> <textarea id="importArea" style="width:300px;"></textarea>
    `
], inventory = [],
exp = {"woodcutting":0, "mining":0, "woodworking":0};
for(var i=0; i<54; i++) inventory.push(["empty", 0]);
inventory[0] = ["stone axe", 1];

function exports() {
    document.getElementById("mainContainer").innerHTML = (btoa(JSON.stringify(inventory)))
}
function imports() {
    inventory = JSON.parse(atob(document.getElementById("importArea").value));
    updateInventory();
}

function calculateLevel(experience) {
    return Math.max(0, Math.ceil(
        Math.log10(experience/40) / 0.0607
    ));
}

function switchAction(act,type,timed=1,minLevel=0) {
    if(calculateLevel(exp[type]) < minLevel) return alert(`You need level ${minLevel} ${type} to do this action.`);
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
            item = ["chisel", 0.8];
    }
 
    if((item[0] == 'empty') && (act !== "dirt")) return alert(`You need a tool that can do ${type} to do this action.`);

    action = act;
    actionDescription =  " ~ " + act.charAt(0).toUpperCase() + act.slice(1) + " (" + type + ")";
    time = 0;

    let expMult = 1;
    if(exp[type] && exp[type] >= 100){
        expMult = (calculateLevel(exp[type])**1.4)/150+1;
    }
    //calculateLevel(exp[type]) < minLevel

    maxTime = timed / item[1] / expMult;
}

function fightFarmer() {
    alert("you fight very hard.. and get injured, and ran. But you pickpocketed him while you ran away.");
    addItem("coin", rand(2,5), 0)
}

const order = [
    ["tin",1.25],
    ["stone",1.0]
];

function getBestItem(type) {
    for (let tool of order) {
        if (inventory.some(item => item[0] === (tool[0] + " " + type) && item[1] > 0)) {
            return tool;
        }
    }

    return ["empty", 0.6];
}

function updateExpBar(type) {
    var max = calculateLevel(exp[type]);
    var o = 1.15**(max-1)*40;
    var n = 1.15**max*40;
    
    if(max <= 0) {
        o = 0;
        n = 40;
    }

    document.querySelector(`#exp${type} .expBar`).style.width = Math.min(1, (exp[type]-o)/(n-o)) * 100 + '%';
    document.querySelector(`#exp${type} .expBarText`).innerHTML = type + " " + max;
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

    updateExpBar("woodcutting");
    updateExpBar("woodworking");
    updateExpBar("mining");
}

function addItem(type, amount, xp=10, acttype="mining") {
    if(amount <= 0) return;
    let slot = inventory.find(item => item[0] === type);

    if(slot) {
        slot[1] += amount;
    } else {
        let empty = inventory.findIndex(item => item[0] === "empty")
        
        if (empty !== null) inventory[empty] = [type, amount];
    }

    if(exp[acttype] !== undefined) {
            exp[acttype] += xp;
    }
    updateInventory();
}
function rand(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function findItemAmount(type){
    if(inventory.find(item => item[0] === type)) return inventory.find(item => item[0] === type)[1];
    return 0;
}

function doAction(type) {
    switch(type) {
        case "dirt":
            addItem("dirt", rand(1,3),4);
            addItem("stone", rand(0,1.5),0);
            break;

        case "chop":
            addItem("balsa log", rand(1,2),5,"woodcutting"); break;

        case "chop2":
            addItem("poplar log", rand(1,2),10,"woodcutting"); break;

        case "chop3":
            addItem("poplar log", rand(3,6),20,"woodcutting");
            document.getElementById("woods").style.visibility = "visible";
            break;

        case "mine":
            addItem("stone", rand(2,5),22); break;

        case "tin ore":
            addItem("tin ore", rand(1,2),40); break;

        case "stone pickaxe":
            if(findItemAmount("stone") >= 6 && findItemAmount("balsa log") >= 3) {
                addItem("stone pickaxe", 1, 40, "woodworking");
                inventory.find(item => item[0] === "stone")[1] -= 6;
                inventory.find(item => item[0] === "balsa log")[1] -= 3;
            }
            break;

        case "tin pickaxe":
            if(findItemAmount("tin bar") >= 8 && findItemAmount("poplar log") >= 5) {
                addItem("tin pickaxe", 1, 65, "woodworking");
                inventory.find(item => item[0] === "tin bar")[1] -= 8;
                inventory.find(item => item[0] === "poplar log")[1] -= 5;
            }
            break;

        case "stone axe":
            if(findItemAmount("stone") >= 5 && findItemAmount("balsa log") >= 4) {
                addItem("stone axe", 1, 40, "woodworking");
                inventory.find(item => item[0] === "stone")[1] -= 5;
                inventory.find(item => item[0] === "balsa log")[1] -= 4;
            }
            break;

        case "tin bar":
            if(findItemAmount("tin ore") >= 3 && findItemAmount("poplar log") >= 2) {
                addItem("tin bar", 2, 30, "woodworking");
                inventory.find(item => item[0] === "tin ore")[1] -= 3;
                inventory.find(item => item[0] === "poplar log")[1] -= 2;
            }
            break;

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

