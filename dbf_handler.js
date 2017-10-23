

class DBF_Handler {

    
    constructor(options) {

        this.imgJson_url = 'https://raw.githubusercontent.com/schmich/hearthstone-card-images/master/images.json'
        this.cardJson_url = 'https://api.hearthstonejson.com/v1/21517/enUS/cards.collectible.json'
        this.imgJson
        this.cardJson
    }

    loadImages(callback) {
        fetch(this.imgJson_url)
        .then(res => res.json())
        .then((out) => {
            this.imgJson = out
            if (callback) { callback() }
        })
        .catch(err => { throw err });
    }

    loadCards(callback) {
        fetch(this.cardJson_url)
        .then(res => res.json())
        .then((out) => {
            this.cardJson = out
            if (callback) { callback() }
        })
        .catch(err => { throw err });
    }

    match_dbfId_to_imgUrl(dbfId) {
        if (!this.imgJson) {console.log('Error: Image Json not loaded'); return 0}
        for (var img of this.imgJson) { if (img.dbfId == dbfId) {return img} }
        console.log('Error: Image not found, dbfId: ',dbfId)
        return 0
    }

    match_dbfId_to_card(dbfId) {
        if (!this.cardJson) {console.log('Error: Card Json not loaded'); return 0}
        for (var card of this.cardJson) { if (card.dbfId == dbfId) {return card} }
        console.log('Error: Card not found, dbfId: ',dbfId)
        return 0
    }



    b64ToBuffer(b64Data) {
        const binary = atob(b64Data);
        const buffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            buffer[i] = binary.charCodeAt(i)
        }
        return buffer;
    }

    decodeBuffer(buf, offset) {
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
                this.decodeBuffer.bytes = 0
                throw new RangeError('Could not decode varint')
            }
            b = buf[counter++]
            res += shift < 28
                ? (b & REST) << shift
                : (b & REST) * Math.pow(2, shift)
            shift += 7
        } while (b >= MSB)

        this.decodeBuffer.bytes = counter - offset

        return {res: res, shift: shift}
    }

    deckcode_to_dbfId(deckcode) {
        var buf = this.b64ToBuffer(deckcode)
        var res = []
        for (var i=0; i<buf.length;i++) {
            var r = this.decodeBuffer(buf,i)
            res.push(r.res)
            i += r.shift/7-1
        }

        var spare =     res[0]
        var version =   res[1]
        var hsFormat =  res[2]
        var hsHero =    res[4]
        var x1 =        res[5]
        var x2 =        res[6+x1]

        var cards_x1 =  []
        var cards_x2 =  []

        for (var i=6;i<6+x1;i++) { cards_x1.push(res[i]) }
        for (var i=7+x1; i<7+x2; i++) { cards_x2.push(res[i]) }

        return {spare: spare, version: version, hsFormat: hsFormat, hsHero: hsHero, x1: x1, x2: x2, cards_x1: cards_x1, cards_x2: cards_x2}
    }

    countWordsExpansion() {
        let expansions = []
        let count = []
        for (let c of this.cardJson) {
            let idx = expansions.indexOf(c.set)
            if (idx == -1) {
                let text = c.text
                if (!text) {text = ''}
                expansions.push(c.set)
                count.push({expansion:c.set, count: 1, textLength: text.length})
                idx = expansions.length-1
            } else { 
                let text = c.text
                if (!text) {text = ''}
                count[idx].count += 1
                count[idx].textLength += text.length
            }
        }

        for (var e of count) { if (e.count) {e.textLength/=e.count} }
        console.log('expansions',count)
    }
    
}