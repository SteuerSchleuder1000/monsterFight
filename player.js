



class Player {

    constructor(options) {
        this.hand = []
        this.deck = []
        this.grave = []
        this.hero
    }


    newDeck(deckObj) {
        this.reset()
        this.deck = []
        this.hero = {name: '', dbfId: deckObj.hsHero}

        let cards_x1 = deckObj.cards_x1
        let cards_x2 = deckObj.cards_x2

        for (let c of cards_x1) { this.deck.push({name:'',dbfId:c, crossed: false, img:null}) }
        for (let c of cards_x2) { 
            this.deck.push({name:'',dbfId:c, crossed: false, img: null})
            this.deck.push({name:'',dbfId:c, crossed: false, img: null}) 
        }
    }

    initialDraw(nr) {
        // Check for quest crads:
        this.shuffle()
        let count = 0
        for (let i=0;i<this.deck.length;i++) {

            let c = this.deck[i]

            if (QUESTCARDS_dbfId.indexOf(c.dbfId) != -1) {
                this.deck.splice(i,1)
                this.hand.push(c)
                count += 1
            }
            if (count >= nr) { break }
        }
        this.draw(nr-count)
    }

    draw(nr) {
        this.shuffle()
        if (nr > this.deck.length) {
            console.log('Error: Not nough cards in deck to draw, nr: ',nr)
            nr = this.deck.length
        }

        for (let i=0;i<nr;i++) {
            let c = this.deck.pop()
            c.crossed = false
            this.hand.push(c)
        }
    }

    shuffle() { shuffle(this.deck) }

    reshuffle(card) {
        let idx = this.hand.indexOf(card)
        if (idx == -1) {return}
        let c = this.hand[idx]
        c.crossed = false
        this.hand.splice(idx,1)
        this.deck.push(c)
        this.shuffle()
    }

    reset() {
        for (let c of this.hand) {this.deck.push(c)}
        for (let c of this.grave) {this.deck.push(c)}
        for (let c of this.deck) { c.crossed = false }
        this.hand = []
        this.grave = []
    }
}
