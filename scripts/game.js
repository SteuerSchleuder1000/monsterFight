var GAME = null
var interval = 0
var interval_sel = 1000
var combatLog = false

window.onload = function() {
    GAME = new Game()
    setInterval(GAME.tick.bind(GAME), 0.1);
}


class Game {
    constructor (options) {

        this.paused = false
        this.generation = 0
        this.fights = 0
        
        this.fightWrapper = document.querySelector('.fight-wrapper')
        this.figthBtn = document.querySelector('.item.fight')
        this.pauseBtn = document.querySelector('.item.pause')

        this.figthBtn.onclick = this.newFight.bind(this)
        this.pauseBtn.onclick = this.pause.bind(this)

        this.monsters = []
        for (let i=0; i<50; i++) { this.addMonster() }


        this.m1 = null
        this.m2 = null
        this.newFight()
       
        

        this.mode = 'fight' // menu, fight

    } // constructor

    

    pause() { this.paused = !this.paused }


    tick() {
        if (this.paused) { return }
        if (!this.time) { 
            this.time = 1
            this.nextTurn = 0
        }
        this.time += 1


        if (this.time % interval_sel == 0 && this.time > 0) { this.selection() }

        if (this.mode == 'fight') {
            
            if (this.time >= this.nextTurn ) { this.fightTurn() }
        }
    }

    fightTurn() {

        //console.log('new round')
        
        let atk1 = this.m1.attacks[0]
        let f1 = eleFactor(atk1, this.m2.elements)
        let speed1 = this.m1.stats.speed * atk1.speed
        let power1 = this.m1.stats.power * atk1.power * f1

        let atk2 = this.m2.attacks[0]
        let f2 = eleFactor(atk2, this.m1.elements)
        let speed2 = this.m2.stats.speed * atk2.speed
        let power2 = this.m2.stats.power * atk2.power * f2


        let monsters = [ this.m1, this.m2]
        let attacks = [atk1, atk2]
        let powers = [power1, power2]
        let speeds = [speed1, speed2]

        let idx = (speed1 >= speed2) ? 0 : 1
        
        if (combatLog) {
            console.log( monsters[idx].name+' hits for '+ powers[idx].toFixed(2)+' damage with speed '+speeds[idx].toFixed(2))
            console.log( monsters[1-idx].name+' hits for '+ powers[1-idx].toFixed(2)+' damage with speed '+speeds[1-idx].toFixed(2))
        }

        if ( monsters[1-idx].takeDamage(powers[idx]) ) { monsters[idx].takeDamage(powers[1-idx]) }


        if (this.m1.stats.health <= 0 || this.m2.stats.health <= 0) { this.newFight(); return }
        if (!this.time) { this.time = 1 }
        this.nextTurn = this.time + interval
    }
     
    

    newFight() {

        this.fights += 1
        if (this.m1 != null) { this.m1.removeDiv() }
        if (this.m2 != null) { this.m2.removeDiv() }


        this.m1 = choice(this.monsters)
        this.m2 = this.m1
        while (this.m2.id == this.m1.id) { this.m2 = choice(this.monsters) }

        this.fightWrapper.appendChild(this.m1.div)
        this.fightWrapper.appendChild(this.m2.div)

        this.m1.divs.img.style.transform = 'scaleX(1)'
        this.m2.divs.img.style.transform = 'scaleX(-1)'

        this.m1.newFight()
        this.m2.newFight()

        this.nextTurn = this.time + interval
    }

    selection () {
        this.generation += 1
        console.log('generation '+this.generation,' fights: '+this.fights)
        this.monsters.sort( function(a, b) { return a.winrate() - b.winrate() } )
        //console.log(this.monsters)
        let numDel = (0.25*this.monsters.length).toFixed(0)
        for (let i =0; i<numDel; i++) { 
            let m1 = choice(this.monsters.slice(this.monsters.length-numDel, this.monsters.length))
            let m2 = choice(this.monsters.slice(this.monsters.length-numDel, this.monsters.length))
            this.monsters[i] = this.offspring(m1,m2)
        }
    }

    offspring(m1, m2) {
        let m = new Monster()
        m.generation = this.generation
        if (Math.random()>0.05) { m.elements = coin() ? m1.elements : m2.elements }
        for (let a in m.stats_init) { 
            if (Math.random() < 0.05) { continue }
            m.stats_init[a] = coin() ? m1.stats_init[a] : m2.stats_init[a] 
        }
        m.normalizeStats()

        for (let i in m.attacks) { 
            if (Math.random() < 0.05) { continue }
            m.attacks[i] = coin() ? m1.attacks[i] : m2.attacks[i] 
        }
        //console.log(m)
        return m
    }

    removeMonster(monster) {
        var index = this.monsters.indexOf(monster);
        if (index > -1) { this.monsters.splice(index, 1) }
    }

    addMonster() { this.monsters.push(new Monster() )}

}