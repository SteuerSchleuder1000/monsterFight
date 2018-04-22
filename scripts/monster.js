


class Monster {
    constructor(options) {

        this.name = randomName()
        this.id = Math.random()
        this.generation = 0

        

        this.stats_init = {
            power: Math.random(),
            health: Math.random(),
            speed: Math.random(),
        }

        this.stats = {}
        let statSum = 0
        for (let a in this.stats_init) { statSum += this.stats_init[a] }
        for (let a in this.stats_init) { this.stats_init[a] *= 300/statSum}
        this.stats_init.health *= 3
        for (let a in this.stats_init) { this.stats[a] = this.stats_init[a] }

        this.attacks = []
        this.elements = []

        for (let i=0;i<3;i++) { this.attacks.push(new Attack())}
        for (let i=0;i < randint(1,3);i++) { this.elements.push(choice(ELEMENTS))}


        this.setupDiv()

        this.games = 0
        this.losses = 0

        
    }// constructor

    setupDiv() {
        this.div = createDiv('','monster-wrapper') // document.createElement('div')
        this.divs = {
            elements: createDiv('','elements'),
            name: createDiv(this.name ,'name'),
            img: createImg('images/'+choice(IMAGES),'img'),
            hpBar: createDiv('HP','bar hp'),
            manaBar: createDiv('Mana','bar mana'),
            attacks: createDiv('','attacks'),
        }

        this.div.appendChild(this.divs.elements)
        this.div.appendChild(this.divs.name)
        this.div.appendChild(this.divs.img)
        this.div.appendChild(this.divs.hpBar)
        this.div.appendChild(this.divs.manaBar)
        this.div.appendChild(this.divs.attacks)
        

        for (let e of this.elements) {
            let d = createDiv('', 'element ' + e)
            this.divs.elements.appendChild(d)
        }


        for (let a of this.attacks) {
            let div_a = createDiv(a.name, 'attack')
            div_a.onclick = a.run

            this.divs[a.name] = div_a
            this.divs.attacks.appendChild(div_a)

            let e = a.element
            let div_e = createDiv('', 'element ' + e)
            div_a.appendChild(div_e)
        }
    }

    removeDiv() { this.div.parentNode.removeChild(this.div) }

    takeDamage(damage) { 
        this.stats['health'] -= damage
        this.updateHealth()
        if (this.stats.health <= 0) { 
            this.die()
            return false
        }
        return true
    }

    updateHealth() {
        let ratio = this.stats['health'] / this.stats_init['health']*19
        this.divs.hpBar.style.width = ratio+'rem'
        this.divs.hpBar.innerHTML = 'HP ( '+this.stats.health.toFixed(1)+' )'
    }
    
    die() { 
        //console.log(this.name+' dies',this.stats.health.toFixed(2))
        this.losses += 1
        //GAME.removeMonster(this)
        //GAME.addMonster()
    }

    newFight() {
        this.games += 1
        for (let a in this.stats_init) { this.stats[a] = this.stats_init[a] }
        this.updateHealth()
    }

    winrate() {
        if (this.games > 0) { return (this.games-this.losses)/this.games }
        return 0
    }
}