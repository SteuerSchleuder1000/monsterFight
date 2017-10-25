

const githubLink = 'https://vicioussyndicate.github.io/mulliganWebApp'



var SIMULATION


const HEROES = [
    {hsClass:'Warrior',name:'',dbfId:7},
    {hsClass:'Shaman',name:'',dbfId:40183},
    {hsClass:'Rogue',name:'',dbfId:930},
    {hsClass:'Paladin',name:'',dbfId:671},
    {hsClass:'Hunter',name:'',dbfId:31},
    {hsClass:'Druid',name:'',dbfId:274},
    {hsClass:'Warlock',name:'',dbfId:893},
    {hsClass:'Mage',name:'',dbfId:637},
    {hsClass:'Priest',name:'',dbfId:813},
]

const QUESTCARDS_dbfId = [41168,41222,41099,41856,41368,41427,41494,41499,41868]





window.onload = function() {
    SIMULATION = new Simulation()
}




function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function rand (min, max) {
    return Math.random() * (max - min) + min;
}

function randInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(arr) { return arr[Math.floor(Math.random()*arr.length)]; }