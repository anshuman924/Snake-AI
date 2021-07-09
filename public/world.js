// const { socket } = require("socket.io");

class World {
    constructor() {
        this.population = new Population(2048);
        this.totalGenerations = 64;
    }

    run() {        
        for (let gen = 1; gen <= this.totalGenerations; gen++) {
            this.population.play();
            this.population.saveBestSnake();
            this.population.naturalSelection();
        }

        return this.population.getBestSnake();
    }

    returnFitnessData(gen) {
        let data = this.population.getFitness();

        let obj = {'fileName' : 'fitnessData'};
        for(let i = 0; i < data.length; i++) {
            let key = `gen ${gen} snake ${i+1}`;
            obj[key] = data[i];
        }

        socket.emit('fitness_data', obj);
    }
}