var GAME = null

window.onload = function() {
    GAME = new Game()
}


class Game {
    constructor (options) {

        this.fightWrapper = document.querySelector('.fight-wrapper')
        this.figthBtn = document.querySelector('.item.fight')

        this.figthBtn.onclick = this.fight.bind(this)

        this.monsters = []
        for (let i=0; i<100; i++) { this.monsters.push( new Monster() ) }


        this.m1 = null
        this.m2 = null
        this.fight()

    } // constructor

    fight() {

        if (this.m1 != null) { this.m1.removeDiv() }
        if (this.m2 != null) { this.m2.removeDiv() }


        this.m1 = choice(this.monsters)
        this.m2 = this.m1
        while (this.m2.id == this.m1.id) { this.m2 = choice(this.monsters) }

        this.fightWrapper.appendChild(this.m1.div)
        this.fightWrapper.appendChild(this.m2.div)

        this.m1.divs.img.style.transform = 'scaleX(1)'
        this.m2.divs.img.style.transform = 'scaleX(-1)'


        // combat

        // while (this.m1.health > 0 && this.m2.health > 0) {
        //     //wait(1000)
        //     console.log(this.m1.name+' attacks')
        //     //wait(1000)
        //     console.log(this.m2.name+' attacks')
        // }

    }


}