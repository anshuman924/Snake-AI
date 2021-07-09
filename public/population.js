class Population {

    constructor(size) {
        this.size = size;
        this.snakes = [];
        this.fitness = [];
        this.bestSnake;
        this.mutationRate = 0.2;
        this.generation = 1;

        for (let i = 0; i < size; i++) {
            this.snakes.push(new Snake());
            this.fitness.push(0);
        }
    }

    play() {
        for (let i = 0; i < this.size; i++) {
            console.log(`Playing gen = ${this.generation} snake = ${i + 1}`);

            while (this.snakes[i].isAlive) {
                this.snakes[i].move();
            }

            this.fitness[i] = this.snakes[i].calcFitness();
        }

        this.setBestSnake();
    }

    naturalSelection() {
        let newPop = [];

        newPop.push(this.bestSnake.copy());

        for (let i = 1; i < this.size; i++) {
            let parent1 = this.selectSnake();
            let parent2 = this.selectSnake();

            let child = parent1.crossover(parent2);
            child.mutate(this.mutationRate);

            newPop.push(child);
        }

        for (let i = 0; i < this.size; i++) {
            this.snakes[i] = newPop[i].copy();
        }

        this.generation++;
    }

    setBestSnake() {
        let m = -1, pos = -1;
        for (let i = 0; i < this.size; i++) {
            if (this.fitness[i] > m) {
                m = this.fitness[i];
                pos = i;
            }
        }

        this.bestSnake = this.snakes[pos].copy();
    }

    selectSnake() {
        let fitness_sum = this.fitness.reduce((a, b) => a + b, 0);
        let rand = int(random(fitness_sum));
        let runningSum = 0;
        // console.log(`rand is: ${rand}`);
        for (let i = 0; i < this.size; i++) {
            runningSum += this.fitness[i];
            // console.log(runningSum);
            if (runningSum > rand) {
                return this.snakes[i].copy();
            }
        }
    }

    saveBestSnake() {
        let fileName = `gen_${this.generation}`;
        socket.emit('data', this.bestSnake.saveSnake(fileName));
    }

    getBestSnake() {
        return this.bestSnake.copy();
    }
}