



class Simulation {

    constructor() {

        this.setupUI()

        this.cardWrappers = []
        this.coin = false
        this.rank = 5
        this.defaultDeckcode = 'AAECAZICApG8AuTCAg73A+YF5QfBqwK2swLNuwLRuwKGwQKvwgLrwgKbzQKHzgKmzgKR0AIA'

        this.dbf = new DBF_Handler()
        this.dbf.loadImages()
        this.dbf.loadCards()
        this.player = new Player()
        this.opponent = this.newOpponent()

    }

    setupUI() {

        this.submitBtn = document.querySelector('#submitDeck')
        this.deckInput = document.querySelector('#deckinput')
        this.rankSlider = document.querySelector('#rankSlider')
        this.rankInfo = document.querySelector('.rankValue')
        this.bottomDiv = document.querySelector('.bottom')

        this.mulliganBtn = document.querySelector('#mulligan')
        this.newGameBtn = document.querySelector('#newGame')
        this.oppDiv = document.querySelector('.opponent')
        this.heroDiv = document.querySelector('.hero')
        this.deckDiv  =document.querySelector('.deck')
        this.handDiv = document.querySelector('.hand')


        this.submitBtn.onclick = this.submitDeck.bind(this)
        this.mulliganBtn.onclick = this.mulligan.bind(this)
        this.newGameBtn.onclick = this.newGame.bind(this)
        this.rankSlider.oninput = this.updateSlider.bind(this)
        this.deckDiv.onclick = this.deckClick.bind(this)
    }

    updateSlider() { this.rankInfo.innerHTML = 'Rank '+this.rankSlider.value; this.rank = this.rankSlider.value }

    deckClick() { this.player.draw(1); this.displayHand() }




    submitDeck() {
        let value = this.deckInput.value
        if(!value) { 
            value = this.defaultDeckcode;
            this.deckInput.value = this.defaultDeckcode
            console.log('Error: No input value > default deck')}
        let deck = this.dbf.deckcode_to_dbfId(value)
        this.player.newDeck(deck)
        this.newGame()
    }


    newGame() {
        this.newOpponent()
        this.player.reset()
        this.flipCoin()
        this.player.initialDraw(this.coin ? 4:3)
        this.display()
        this.loadAllDeckImages()
        this.bottomDiv.style.display = 'flex'
    }

    newOpponent() { this.opponent = choice(HEROES) }

    flipCoin() { this.coin = randInt(0,1); console.log(this.coin ? 'You got the coin':'Your opponent got the coin') }







    display() {
        this.displayHand()
        this.displayHero()
        this.displayOpp()
    }

    displayHand() {
        this.handDiv.innerHTML = ''
        this.cardWrappers = []

        for (let c of this.player.hand) {
            let cardWrapper = document.createElement('div')
            cardWrapper.className = 'card-wrapper'

            let img
            let idx = this.player.hand.indexOf(c)
            let crossImg = this.getCrossImg(idx)

            if ( !c.img ) { this.loadCardImage(c) }
            img = c.img
            img.id = idx

            cardWrapper.appendChild(img)
            cardWrapper.appendChild(crossImg)

            this.cardWrappers.push(cardWrapper)
            this.handDiv.appendChild(cardWrapper)
        }
    }

    loadCardImage(c) {
        let img = document.createElement('img')
        let imgUrl = this.dbf.match_dbfId_to_imgUrl(c.dbfId).url
        if (!imgUrl) {console.log('Error: img Url not found:',c)}
        img.src = imgUrl
        img.className = 'card'
        img.onclick = this.imageClick.bind(this)
        c.img = img
    }

    loadAllDeckImages() {
        for (let c of this.player.deck) {
            if (!c.img) { this.loadCardImage(c) }
        }
    }

    displayHero() {
        let heroUrl = this.dbf.match_dbfId_to_imgUrl(this.player.hero.dbfId).url
        this.heroDiv.src = heroUrl
    }

    displayOpp() {
        let oppUrl = this.dbf.match_dbfId_to_imgUrl(this.opponent.dbfId).url
        this.oppDiv.src = oppUrl
    }


    updateHand() {
        let hand = this.player.hand
        for (let i=0;i<hand.length;i++) {
            let c = hand[i]
            let nodes = this.cardWrappers[i].childNodes
            for (let n of nodes) {
                if (n.classList.contains('cross')) {
                    n.style.display = c.crossed ? 'inline':'none'
                    break
                }
            }
        }
    }


    getCrossImg(imgId) {
        let img = document.createElement('img')
        img.src = 'Sources/cross.png'
        img.className = 'cross hidden'
        img.id = imgId
        img.onclick = this.imageClick.bind(this)
        return img
    }

    imageClick(e) {
        let imgId = e.target.id
        let hand = this.player.hand
        hand[imgId].crossed = !hand[imgId].crossed
        this.updateHand()
    }


    mulligan() {
        let hand = this.player.hand
        
        for (let c of hand) { if (c.crossed) { this.player.draw(1); c.crossed = false; this.player.reshuffle(c) } }
        //for (let c of hand) { if (c.crossed) { c.crossed = false; this.player.reshuffle(c)} }
        for (let c of hand) { c.crossed = false }

        //this.player.draw(count)
        this.displayHand()
    }
}
