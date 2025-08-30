let time = 0;
let maxTime = 1;
let action = null;
let actionDescription = "";
let htmlThings = [
    `You see a forest of poplar trees up ahead. There's a large poplar tree covering a bridge to get there.
    There's a small, rocky mound and a few balsa trees. You'll need to get an axe to chop anything down.<br><br>

    <div>
    <button onclick="switchAction('dirt','mining',1)">Dig the mound</button>
    <button onclick="switchAction('chop','woodcutting',2.5)">Chop a balsa tree</button>
        <br><br>
    <button onclick="switchAction('chop3','woodcutting',8,2)">Chop the large poplar tree (lvl 2 woodcutting required)</button>
    `,

    `This seems to be a forest. Looking around, you see some poplar trees and stone. There's a strange farmer-looking person sitting on the ground.
    There's also a stream with what seems to be a small town up ahead, but the bridge seems to be broken.<br><br>
    <button onclick="switchAction('chop2','woodcutting',3,2)">Chop a poplar tree (lvl 2 woodcutting required)</button>
    <button onclick="switchAction('mine','mining',7)">Mine some stone</button></div>
    <button onclick="switchAction('tin ore','mining',15,3)">Mine some tin ore (lvl 3 mining required)</button></div>
    <button onclick="switchAction('iron ore','mining',20,10)">Mine some iron ore (lvl 10 mining required)</button></div>
        <br><br>
    <button onclick="switchAction('dirt','temporary',2)">(Placeholder Button) Repair the bridge</button>
        <br><br>
    <button onclick="fightFarmer()" class="fight">Attack!</button>`,
    `Nothing here yet, except for a basic saving system<br><br>
    <button onclick="exports()">Export Inventory</button>
    <button onclick="imports()">Import Inventory</button> <textarea id="importArea" style="width:300px;"></textarea>
    `
], tooltips = {
    "stone axe": "A simple stone axe, useful to chop wood.",
    "stone pickaxe": "A simple stone pickaxe, useful to chop stone and ores.",
    "tin axe": "A flimsy tin axe, useful to chop wood.<br>30% faster than a stone axe.",
    "tin pickaxe": "A flimsy tin pickaxeaxe, useful to chop stone and ores.<br>30% faster than a stone pickaxe.",
    "iron pickaxe": "A soft iron pickaxeaxe, useful to chop stone and ores.<br>70% faster than a stone pickaxe.",

    "coin": "<em>This coin appears unusually observant...</em>",
    "dirt ball": "<em>A bit of dirt, molded into a ball</em>",
},inventory = [],
exp = {"woodcutting":0, "mining":0, "crafting":0, "forging": 0};
for(var i=0; i<54; i++) inventory.push(["empty", 0]);
inventory[0] = ["stone axe", 1];

function exports() {
    document.getElementById("importArea").innerHTML = (btoa(JSON.stringify([inventory,exp])))
}
function imports() {
    const inputs = document.getElementById("importArea").value;
    if(!inputs) return;

    const imported = JSON.parse(atob(inputs));
    inventory = imported[0];
    exp = imported[1]
    updateInventory();
}

function calculateLevel(experience) {
    return Math.max(0, Math.ceil(
        Math.log10(experience/100) / 0.0607
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
    ["iron",1.7],
    ["tin",1.3],
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
    var o = 1.15**(max-1)*100;
    var n = 1.15**max*100;
    
    if(max <= 0) {
        o = 0;
        n = 100;
    }

    document.querySelector(`#exp${type} .expBar`).style.width = Math.min(1, (exp[type]-o)/(n-o)) * 100 + '%';
    document.querySelector(`#exp${type} .expBarText`).innerHTML = type + " " + max;
}
function updateInventory() {
    for(let i=0; i<54; i++) {
        const img = document.querySelector(`#slot${i} .inventory-img`);
        const amount = document.querySelector(`#slot${i} .inventory-amount`);
        const tooltip = document.querySelector(`#slot${i} .label`);
        
        if(inventory[i][0] === "empty") {
            img.src = ``;
            amount.innerHTML = ``;
            tooltip.style.visibility = 'hidden';
        } else {
            img.src = `assets/${inventory[i][0]}.png`
            amount.innerHTML = inventory[i][1];
            tooltip.innerHTML = `<span class='big'>${inventory[i][0].charAt(0).toUpperCase() + inventory[i][0].slice(1)}</span> <br> ${tooltips[inventory[i][0]] || ""}`;
            tooltip.style.visibility = 'visible';
        }
    }

    updateExpBar("woodcutting");
    updateExpBar("mining");
    updateExpBar("crafting");
    updateExpBar("forging");
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
            addItem("stone", rand(2,5),30); break;

        case "tin ore":
            addItem("tin ore", rand(1,2),55); break;

        case "iron ore":
            addItem("iron ore", rand(1,1.2),105); break;

        case "stone pickaxe":
            if(findItemAmount("stone") >= 6 && findItemAmount("balsa log") >= 3) {
                addItem("stone pickaxe", 1, 40, "crafting");
                inventory.find(item => item[0] === "stone")[1] -= 6;
                inventory.find(item => item[0] === "balsa log")[1] -= 3;
            }
            break;

        case "tin pickaxe":
            if(findItemAmount("tin bar") >= 8 && findItemAmount("poplar log") >= 5) {
                addItem("tin pickaxe", 1, 65, "crafting");
                inventory.find(item => item[0] === "tin bar")[1] -= 8;
                inventory.find(item => item[0] === "poplar log")[1] -= 5;
            }
            break;

        case "iron pickaxe":
            if(findItemAmount("iron bar") >= 12 && findItemAmount("poplar log") >= 5) {
                addItem("iron pickaxe", 1, 65, "crafting");
                inventory.find(item => item[0] === "iron bar")[1] -= 12;
                inventory.find(item => item[0] === "poplar log")[1] -= 5;
            }
            break;

        case "stone axe":
            if(findItemAmount("stone") >= 5 && findItemAmount("balsa log") >= 4) {
                addItem("stone axe", 1, 40, "crafting");
                inventory.find(item => item[0] === "stone")[1] -= 5;
                inventory.find(item => item[0] === "balsa log")[1] -= 4;
            }
            break;

        case "tin bar":
            if(findItemAmount("tin ore") >= 3 && findItemAmount("poplar log") >= 2) {
                addItem("tin bar", 2, 30, "forging");
                inventory.find(item => item[0] === "tin ore")[1] -= 3;
                inventory.find(item => item[0] === "poplar log")[1] -= 2;
            }
            break;
        case "iron bar":
            if(findItemAmount("iron ore") >= 4 && findItemAmount("poplar log") >= 2) {
                addItem("iron bar", 2, 50, "forging");
                inventory.find(item => item[0] === "iron ore")[1] -= 4;
                inventory.find(item => item[0] === "poplar log")[1] -= 2;
            }
            break;
        case "dirt ball":
            if(findItemAmount("dirt") >= 12){
                addItem("dirt ball", 1, 12, "crafting");
                inventory.find(item => item[0] === "dirt")[1] -= 12;
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

