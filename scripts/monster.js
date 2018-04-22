


class Monster {
    constructor(options) {

        this.name = randomName()
        this.id = Math.random()

        this.power = randint(1,100)
        this.health = randint(1,100)
        this.attacks = []
        this.elements = []

        for (let i=0;i<5;i++) { this.attacks.push(new Attack())}
        for (let i=0;i < randint(1,3);i++) { this.elements.push(choice(ELEMENTS))}


        this.setupDiv()

        
    }// constructor

    setupDiv() {
        this.div = createDiv('','monster-wrapper') // document.createElement('div')
        this.divs = {
            elements: createDiv('','elements'),
            name: createDiv(this.name ,'name'),
            img: createImg('images/'+choice(IMAGES),'img'),
            bar1: createDiv('HP','bar hp'),
            bar2: createDiv('Mana','bar mana'),
            attacks: createDiv('','attacks'),
        }

        this.div.appendChild(this.divs.elements)
        this.div.appendChild(this.divs.name)
        this.div.appendChild(this.divs.img)
        this.div.appendChild(this.divs.bar1)
        this.div.appendChild(this.divs.bar2)
        this.div.appendChild(this.divs.attacks)
        

        for (let e of this.elements) {
            let d = createDiv('', 'element ' + e)
            this.divs.elements.appendChild(d)
        }


        for (let a of this.attacks) {
            let div = createDiv(a.name, 'attack')
            div.onclick = a.run

            this.divs[a.name] = div
            this.divs.attacks.appendChild(div)
        }
    }

    removeDiv() { this.div.parentNode.removeChild(this.div) }
    updateHealth() {

    }
    
}