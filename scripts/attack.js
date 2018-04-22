class Attack {
    constructor(options) {
        
        this.speed = Math.random()
        this.power = Math.random()
        this.mana = Math.random()
        this.element = choice(ELEMENTS)
        this.name = 'attack P: '+ this.power.toFixed(2)+' S: '+this.speed.toFixed(2)
    }

    run() {
        console.log('run attack')
    }

    highlight() {
        this.name = '➤ ' + this.name
    }
    
}