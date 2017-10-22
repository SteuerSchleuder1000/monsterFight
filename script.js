

const githubLink = 'https://vicioussyndicate.github.io/mulliganWebApp'

const DBF_IMAGES_LINK = 'https://raw.githubusercontent.com/schmich/hearthstone-card-images/master/images.json'
const HSCARDS_LINK = 'https://api.hearthstonejson.com/v1/21517/enUS/cards.collectible.json'
var HSCARDS
var DBF_IMAGES

var PLAYER


window.onload = function() {
    console.log('hello World')
    loadImages(DBF_IMAGES_LINK)
    //loadCards(HSCARDS_LINK)
    document.querySelector('#submitDeck').onclick = submitDeckCode
}




function submitDeckCode() {
    var btn = document.querySelector('#deckinput')
    var value = btn.value
    if (!value) {value = 'AAECAZ8FBJG8Ary9ArnBApziAg1G8gGnBdQF9QXPBu4GrwfZrgK6vQLrwgLjywKVzgIA'}
    getDeck(value)
}





function loadImages (url) {
    fetch(url)
    .then(res => res.json())
    .then((out) => {
      DBF_IMAGES = out
    })
    .catch(err => { throw err });
}

function loadCards (url) {
    fetch(url)
    .then(res => res.json())
    .then((out) => {
      HSCARDS = out
    })
    .catch(err => { throw err });
}

function find_dbfId(dbfId) {
    for (var i=0;i<DBF_IMAGES.length;i++) {
        if (DBF_IMAGES[i].dbfId === dbfId) {return DBF_IMAGES[i]}
    }
    console.log('Image not found',dbfId)
    return false
}

function find_card(dbfId) {
    for (var i=0;i<HSCARDS.length;i++) {
        if (HSCARDS[i].dbfId === dbfId) {return HSCARDS[i]}
    }
    console.log('Card not found',dbfId)
    return false
}

function addImageFromId(dbfId) {
    var dbfItem = find_dbfId(dbfId)
    if (dbfItem) { addImage(dbfItem.url,dbfId) }
}


function addImage(url,dbfId) {
    var img = document.createElement('img')
    img.src = url
    img.id = dbfId
    img.style.height = '500px'
    document.querySelector('.hand').appendChild(img)
}


function my64(b64Data) {
    const binary = atob(b64Data);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i)
    }
    return buffer;
}





function read(buf, offset) {
    var MSB = 0x80
    , REST = 0x7F

    var res    = 0
    , offset = offset || 0
    , shift  = 0
    , counter = offset
    , b
    , l = buf.length

    do {
        if (counter >= l) {
            read.bytes = 0
            throw new RangeError('Could not decode varint')
        }
        b = buf[counter++]
        res += shift < 28
            ? (b & REST) << shift
            : (b & REST) * Math.pow(2, shift)
        shift += 7
    } while (b >= MSB)

    read.bytes = counter - offset

    return {res: res, offset: shift/7-1}
}

function getDeck(br) {
    var buf = my64(br)
    var res = []
    for (var i=0; i<buf.length;i++) {
        var r = read(buf,i)
        res.push(r.res)
        i += r.offset
    }

    console.log('result:',res)

    var spare =     res[0]
    var version =   res[1]
    var hsFormat =  res[2]
    var hsHero =    res[4]
    var x1 =        res[5]
    var x2 =        res[6+x1]

    console.log('hsformat:',hsFormat,'hero:',hsHero,'x1:',x1,'x2:',x2)

    var cards_x1 =  []
    for (var i=6;i<6+x1;i++) { cards_x1.push(res[i]) }

    var cards_x2 =  []
    for (var i=7+x1; i<7+x2; i++) { cards_x2.push(res[i]) }

    PLAYER = new Player(hsFormat,hsHero,cards_x1,cards_x2)
}


class Player {
    constructor(hsFormat,hsHero,cards_x1,cards_x2) {
        this.hsFormat = hsFormat
        this.hsHero = hsHero
        this.cards_x1 = cards_x1
        this.cards_x2 = cards_x2
        this.coin = true
        this.deck = []
        this.hand = []
        for (var c of this.cards_x1) {this.deck.push(c)}
        for (var c of this.cards_x2) {this.deck.push(c);this.deck.push(c)}
        this.shuffle()
        this.coinFlip()
        this.draw(this.coin?3:4)
        this.display()
    }

    coinFlip() {
        if (randInt(0,1)==0) {this.coin = false}
    }

    draw(nr) {
        for (var i=0;i<nr;i++) {
            var c = this.deck.pop()
            this.hand.push(c)
        }
    }

    display() {
        document.querySelector('.hand').innerHTML = ''
        addImageFromId(this.hsHero)
        for (var c of this.hand) {
            addImageFromId(c)
            //console.log(find_card(c))
        }
    }

    shuffle() { shuffle(this.deck) }
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