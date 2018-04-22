

let NUM_MONSTERS = 100
let IMAGES = ['3witches.jpg','bird.jpg','ghost.jpg','mage.jpg','mystic.jpg','shaman1.jpg','shaman2.jpg','shaman3.jpg','shaman4.jpg','spirit.jpg','void.jpg','witch1.jpg','warrior.jpg','witch2.jpg','witch3.jpg']
let ELEMENTS = ['fire','water','wind','earth','metal']


let o = 1.5
let x = 0.7

let MATRIX = [  [1, o, x, o, x],
                [x, 1, o, x, o],
                [o, x, 1, o, x],
                [x, o, x, 1, o],
                [o, x, o, x, 1]]

function eleFactor(atk, elements) {
    let f = 1
    let idx = ELEMENTS.indexOf(atk.element)
    for(let e of elements) {
        let idx2 = ELEMENTS.indexOf(e)
        f *= MATRIX[idx][idx2]
    }

    return f
}

function coin() { return choice([true,false]) }
function choice(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function createDiv(text, className, id) {
    let div = document.createElement('div')
    div.className = className
    div.id = id
    div.innerHTML = text

    return div
}


function createImg(src, className, id) {
    let img = document.createElement('img')
    img.src = src
    img.className = className
    img.id = id

    return img
}


function randomName() {

    let list = ['SCA','MUR','KO','XI','LO','OT','ME','RO','XOT','RI','LA']
    return choice(list) + choice(list)
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }
 