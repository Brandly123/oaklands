let time = 0;
let maxTime = 10;
let htmlThings = [
    `You see a forest of oak trees up ahead. There's a large poplar tree covering a bridge to get there.
    There's a small mound of dirt here and a few balsa trees. You'll need to get an axe to chop anything down.<br><br>

    <div>
    <button onclick="digDirt()">Dig the mound</button>
    <button onclick="digDirt()">Chop a balsa tree</button>
    <button onclick="digDirt()">Chop the large poplar tree</button></div>`,

    `There's just a small forest. There's a man chopping wood here.<br>
    <button onclick="alert('You dig into the ferest and find nothing!')">Dig</button>
    <button onclick="fightFarmer()" class="fight">Attack!</button>`,
], inventory = [];
for(var i=0; i<60; i++) inventory.push(["empty", 0]);

function fightFarmer() {
    if(document.getElementById('slot1').innerHTML == "1 gold") {
        alert("The farmer looks like he's already dead.");
        return;
    } else {
        document.getElementById('slot1').innerHTML = `1 gold`;
        alert("The farmer has one gold on him! You take it.");
    }
}
function updateInventory() {
    for(let i=0; i<60; i++) {
        const slot = document.getElementById(`slot${i}`);
        console.log(inventory[i]);
        
        if(inventory[i][0] === "empty") {
            slot.innerHTML = "";
        } else {
            slot.innerHTML = `${inventory[i][1]} ${inventory[i][0]}`;
        }
    }
}

function digDirt() {
    let gain = Math.ceil(Math.random() * 3);
    let slot = inventory.find(item => item[0] === "dirt");
console.log(slot);

    if(slot) {
        //alert(`You dig into the mound.. and find ${gain} dirt!`);
        slot[1] += gain;
    } else {
        let empty = inventory.findIndex(item => item[0] === "empty")
        
        if (empty !== null) {
            //alert(`You dig into the mound.. and find ${gain+1} dirt!`);
            inventory[empty] = ["dirt", gain+1];
        }// else alert('You find some dirt, but your inventory is full.');
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
setInterval(() => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000; // seconds elapsed
    previousTime = currentTime;

    if(progress >= 1) {
        time = 0;
        digDirt();
    }

    setProgress(progress);
    time += deltaTime;
    progress = time/maxTime;
    if (progress > 1) clearInterval(interval);
}, 50);