let time = 0;
let maxTime = 1;
let action = null;
let actionDescription = "";
let htmlThings = [
    `There's a couple of poplar logs here. Up ahead seems to be a bridge over a small stream, but it's blocked by a single large poplar tree.
    There's also a large rocky mound and some berry bushes. You'll probably need an axe to chop anything down.<br><br>

    <div>
    <button onclick="switchAction('dirt','mining', 0.8)" id="digMound">Dig the mound <span class='skill'>(Mining)</span></button>
    <button onclick="switchAction('dirt2','mining', 80)" id="digMound">Dig the huge mound <span class='skill'>(Mining)</span></button>
    <button onclick="switchAction('balsa log','woodcutting', 3)">Chop a balsa tree <span class='skill'>(Woodcutting)</span></button>
    <button onclick="switchAction('berry','gathering', 2)">Gather some berries <span class='skill'>(Gathering)</span></button>
        <br><br>
    <button onclick="switchAction('big poplar log','woodcutting',10,5)">Chop the large poplar tree <span class='skill'>(Woodcutting 5)</span></button>
    </div>
    `,

    `You enter a forest-looking place. You find a farmer sitting on the ground nearby one of the trees. It'll probably be a good idea to leave him.
    The forest trees seem to be poplar trees and there's also some rocks here, some with ores. You'll probably need a pickaxe to break any rocks, though.
    <br><br>

    <div>
    <button onclick="switchAction('poplar log','woodcutting',4,4)">Chop a poplar tree <span class='skill'>(Woodcutting 4)</span></button>
    <button onclick="switchAction('mine','mining',4)">Mine some stone <span class='skill'>(Mining)</span></button></div>
    <button onclick="switchAction('tin ore','mining',6,8)">Mine some tin ore <span class='skill'>(Mining 8)</span></button></div>
    <button onclick="switchAction('iron ore','mining',10,20)">Mine some iron ore <span class='skill'>(Mining 20)</span></button></div>
    <br><br>

    <button onclick="switchAction('dirt','temporary',2)">(Placeholder Button) Repair the bridge <span class='skill'>(undefined)</span></button>
    <br><br>

    <button onclick="fightFarmer()" class="fight">Attack!</button>
    </div>1.1
    `,
    `
    New template slot:<br>
    <button class="tempslot" id="enhanceSlot">
        <span class="tempslotcontent"></span>
        <span class="tempslotid">null</span>
    </button>
    <button id="enhance" onclick="enhance()">
        Enhance for the cost of <span id="enhancePrice">1 dirt ball</span><br>
        Success rate: <span id="enhanceChance">0</span>%
    </button>
    `,
    `Nothing here yet, except for a basic saving system<br><br>
    <button onclick="exports()">Export</button>
    <button onclick="imports()">Import</button><br>
    <textarea id="importArea" style="width:400px; height: 200px;"></textarea>
    `
], tooltips = {
    //Tool
    "stone pickaxe":"<span class='skill'>Tool</span><br>A simple stone pickaxe, useful to chop stone and ores.",
    "tin axe":      "<span class='skill'>Tool</span><br>A flimsy tin axe, useful to chop wood.<br>30% faster than a stone axe.",
    "iron axe":      "<span class='skill'>Tool</span><br>A soft tin axe, useful to chop wood.<br>60% faster than a stone axe.",
    "stone axe":    "<span class='skill'>Tool</span><br>A simple stone axe, useful to chop wood.",
    "tin pickaxe":  "<span class='skill'>Tool</span><br>A flimsy tin pickaxe, useful to chop stone and ores.<br>30% faster than a stone pickaxe.",
    "iron pickaxe": "<span class='skill'>Tool</span><br>A soft iron pickaxe, useful to chop stone and ores.<br>60% faster than a stone pickaxe.",

    //Miscellaneous
    "coin":     "<span class='skill'>Miscellaneous</span><br><em>This coin appears unusually observant...</em>",
},inventory = [],
consumableList = [
    "red berry",
    "blue berry",
    "vanilla wafer",
    "chocolate wafer",
],tools = [
    "stone pickaxe",
    "tin pickaxe",
    "iron pickaxe",
    "stone axe",
    "tin axe",
    "iron axe",
],
exp = {"woodcutting":151, "mining":151, "crafting":151, "forging": 151, "gathering": 151},
prevSwitch = ['dirt','mining',1,0];
for(var i=0; i<54; i++) inventory.push(["empty", 0, 0]);
inventory[0] = ["stone axe", 1, 0];

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
        Math.log10((experience)/150) / 0.0607
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
            item = getBestItem("shear");
            break;
        case "crafting":
            item = getBestItem("chisel")
            if(item[0] === "empty") item = ['chisel', 0.8];
            break;
        default:
            item = ["chisel", 0.8];
    }
 
    if((item[0] == 'empty') && (act !== "dirt")) return alert(`You need a tool that can do ${type} to do this action.`);
    prevSwitch = [act,type,timed,minLevel]

    action = act;
    actionDescription =  " ~ " + act.charAt(0).toUpperCase() + act.slice(1) + " (" + type + ")";
    time = 0;

    let expMult = 1;
    if(exp[type] && exp[type] >= 100){
        expMult = (calculateLevel(exp[type])**1.4)/150+1;
    }
    //calculateLevel(exp[type]) < minLevel

    maxTime = timed / item[1] / expMult;
    if(maxTime < 1){
        if(type === "crafting"){
            maxTime = maxTime ** 1
        } else {
            maxTime = maxTime**0.8
        }
    }
}

function fightFarmer() {
    alert("you fight very hard.. and get injured, and ran. But you pickpocketed him while you ran away.");
    addItem("coin", rand(2,5), 0)
}
const order = [
    ["iron",1.6],
    ["tin",1.3],
    ["stone",1.0]
];

function getBestItem(type) {
    for (let tool of order) {
        let found = inventory.find(item => item[0] === (tool[0] + " " + type) && item[1] > 0);
        if (found) {
            let enchantBuff = ((found[2] || 0) * 0.1 + 1)**1.5;
            let totalSpeed = tool[1] * enchantBuff;
            return [tool[0], totalSpeed];
        }
    }
    return ["empty", 0.6];
}

function updateExpBar(type) {
    var max = calculateLevel(exp[type]);
    var o = 1.15**(max-1)*150;
    var n = 1.15**max*150;

    document.querySelector(`#exp${type} .expBar`).style.width = Math.min(1, (exp[type]-o)/(n-o)) * 100 + '%';
    document.querySelector(`#exp${type} .expBarText`).innerHTML = type + " " + max;
}
function updateInventory() {
    //Updates every inventory slot
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
            amount.innerHTML = Math.floor(inventory[i][1]);
            tooltip.innerHTML = `<span class='big'>${inventory[i][0].charAt(0).toUpperCase() + inventory[i][0].slice(1)} +${inventory[i][2]}</span> <br> ${tooltips[inventory[i][0]] || ""}`;
            tooltip.style.visibility = 'visible';
        }
    }

    //Updates every EXP bar
    updateExpBar("woodcutting");
    updateExpBar("mining");
    updateExpBar("crafting");
    updateExpBar("forging");
    updateExpBar("gathering");

    //Updates every temporary slot
    const slots = document.querySelectorAll(".tempslot")
    for(var i=0;i<slots.length;i++){
          //ok echo or brandly or someone ik this sucks but dont question it, ok?
        const temp = document.querySelectorAll(".tempslot")[0].querySelector(".tempslotid").innerHTML;
        const content = document.querySelectorAll(".tempslot")[0].querySelector(".tempslotcontent");
        if( !inventory[temp] ) return;
        
        content.innerHTML = `${inventory[temp][0]} (*${temp}) x${inventory[temp][1]}`
    }

    const enhanceButton = document.getElementById("enhance");
    if(!enhanceButton) return;
    const enhanceSlotId = document.querySelector("#enhanceSlot .tempslotid").innerHTML;
    if(!enhanceSlotId) return;
    const chance = Math.pow(0.825,inventory[enhanceSlotId][2])
    const price = Math.floor(Math.pow(inventory[enhanceSlotId][2]+1,1.2)/4+1)

    document.getElementById("enhanceChance").innerHTML = (chance * 100).toFixed(2);
    document.getElementById("enhancePrice").innerHTML = price + " dirt ball(s)";
}
function addItem(type, amount, xp=0, acttype="mining") {
    if(amount === 0) return;
    let slot = inventory.find(item => item[0] === type);

    if(slot) {
        slot[1] += amount;
        if(slot[1] < 0){
            slot[1] -= amount;
            return "no item"
        }
    } else {
        if(amount <0) return "no item"
        let empty = inventory.findIndex(item => item[0] === "empty")
        
        if (empty !== null) inventory[empty] = [type, amount, 0];
    }

    if(exp[acttype] !== undefined && amount > 0) {
            exp[acttype] += xp;
    }
    updateInventory();
}
function enhance(){
    const enhanceButton = document.getElementById("enhance");
    if(!enhanceButton) return;
    const enhanceSlotId = document.querySelector("#enhanceSlot .tempslotid").innerHTML;
    if(!enhanceSlotId) return;
    const chance = Math.pow(0.825,inventory[enhanceSlotId][2])
    const price = Math.floor(Math.pow(inventory[enhanceSlotId][2]+1,1.2)/4+1)

    if(addItem("dirt ball", -price) !== "no item")
        if(Math.random() <= chance) 
            inventory[enhanceSlotId][2]++
    
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
            addItem("dirt", rand(1,2.5),4);
            addItem("stone", rand(0,0.8), 2);
            break;
        case "dirt2":
            addItem("dirt", 40,4);
            addItem("dirt ball", rand(10,25),2);
            addItem("stone", rand(0,50), 2);
            break;

        case "stone shear":
            addItem("stone shear", 1,4);
            break;

        case "balsa log":
            addItem("balsa log", rand(1,2),7.5,"woodcutting"); break;

        case "berry":
            addItem("red berry", rand(1,2),10,"gathering"); break;

        case "poplar log":
            addItem("poplar log", rand(1,2),15,"woodcutting"); break;

        case "big poplar log":
            addItem("poplar log", rand(4,6),30,"woodcutting");
            document.getElementById("woods").style.visibility = "visible";
            break;

        case "mine":
            addItem("stone", rand(1.8,3.8),35); break;

        case "tin ore":
            addItem("stone", rand(1.8,3.8),60);
            addItem("tin ore", rand(0,2.2), 10);
            break;

        case "iron ore":
            addItem("stone", rand(1.8,3.8),80);
            addItem("iron ore", rand(0,1.6),30);
            break;

        case "stone pickaxe":
            if(findItemAmount("stone") >= 6 && findItemAmount("balsa log") >= 3) {
                addItem("stone pickaxe", 1, 40, "crafting");
                inventory.find(item => item[0] === "stone")[1] -= 6;
                inventory.find(item => item[0] === "balsa log")[1] -= 3;
            }
            break;
        case "stone chisel":
            addItem("stone chisel", 1, 40, "crafting");
            break;

        case "tin pickaxe":
            if(findItemAmount("tin bar") >= 8 && findItemAmount("poplar log") >= 5 && findItemAmount("stone pickaxe") >= 1) {
                addItem("tin pickaxe", 1, 300, "crafting");
                inventory.find(item => item[0] === "stone pickaxe")[1] -= 1;
                inventory.find(item => item[0] === "tin bar")[1] -= 8;
                inventory.find(item => item[0] === "poplar log")[1] -= 5;
            }
            break;

        case "iron pickaxe":
            if(findItemAmount("iron bar") >= 12 && findItemAmount("poplar log") >= 5 && findItemAmount("tin pickaxe") >= 1) {
                addItem("iron pickaxe", 1, 800, "crafting");
                inventory.find(item => item[0] === "tin pickaxe")[1] -= 1;
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

        case "tin axe":
            if(findItemAmount("tin bar") >= 8 && findItemAmount("poplar log") >= 5 && findItemAmount("stone axe") >= 1) {
                addItem("tin axe", 1, 300, "crafting");
                inventory.find(item => item[0] === "stone axe")[1] -= 1;
                inventory.find(item => item[0] === "tin bar")[1] -= 8;
                inventory.find(item => item[0] === "poplar log")[1] -= 5;
            }
            break;

        case "iron axe":
            if(findItemAmount("iron bar") >= 12 && findItemAmount("poplar log") >= 5 && findItemAmount("iron axe") >= 1) {
                addItem("iron axe", 1, 800, "crafting");
                inventory.find(item => item[0] === "iron axe")[1] -= 1;
                inventory.find(item => item[0] === "iron bar")[1] -= 12;
                inventory.find(item => item[0] === "poplar log")[1] -= 5;
            }
            break;

        case "tin bar":
            if(findItemAmount("tin ore") >= 3 && findItemAmount("poplar log") >= 2) {
                addItem("tin bar", 2, 60, "forging");
                inventory.find(item => item[0] === "tin ore")[1] -= 3;
                inventory.find(item => item[0] === "poplar log")[1] -= 2;
            }
            break;
        case "iron bar":
            if(findItemAmount("iron ore") >= 4 && findItemAmount("poplar log") >= 2) {
                addItem("iron bar", 2, 100, "forging");
                inventory.find(item => item[0] === "iron ore")[1] -= 4;
                inventory.find(item => item[0] === "poplar log")[1] -= 2;
            }
            break;
        case "dirt ball":
            if(findItemAmount("dirt") >= 12){
                addItem("dirt ball", 1, 6, "crafting");
                inventory.find(item => item[0] === "dirt")[1] -= 12;
            }
            break;

        default:
            alert("Game bugged: " + btoa(type)); break;
    }

    updateInventory();
    switchAction(prevSwitch[0],prevSwitch[1],prevSwitch[2],prevSwitch[3])
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

