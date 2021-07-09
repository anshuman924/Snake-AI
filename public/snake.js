class Snake {
    constructor() {

        this.body_length = 4;
        this.body = [];
        this.dir = createVector(-GRID_SIZE, 0);
        this.isAlive = 1;
        this.lifeLeft = 200;
        this.lifeTime = 0;
        this.brain = new NeuralNet(24, 18, 4);
        this.score = 0;

        for (let i = 0; i < this.body_length; i++) {
            this.body.push(createVector(Width / 2 + i * GRID_SIZE, Height / 2));
        }

        this.food = this.createFood();
    }

    copy() {
        let clone = new Snake();

        clone.brain = this.brain.copy();
        return clone;
    }

    createFood() {
        let p = createVector(GRID_SIZE * int(random(0, Width / GRID_SIZE)), GRID_SIZE * int(random(0, Height / GRID_SIZE)));

        for (let i = 0; i < this.body_length; i++) {
            if (p.equals(this.body[i])) return this.createFood();
        }

        return p;
    }

    checkDead() {
        if (this.lifeLeft < 0) return true;

        if (this.body[0].x < 0 || this.body[0].x > Width - GRID_SIZE || this.body[0].y < 0 || this.body[0].y > Height - GRID_SIZE) {
            return true;
        }

        for (let i = 1; i < this.body_length; i++) {
            if (this.body[0].equals(this.body[i])) return true;
        }

        return false;
    }

    change_dir(dir) {
        if (dir === "up" /*&& this.dir.y !== GRID_SIZE*/) {
            this.dir.x = 0;
            this.dir.y = -GRID_SIZE;
        }

        if (dir === "down" /*&& this.dir.y !== -GRID_SIZE*/) {
            this.dir.x = 0;
            this.dir.y = GRID_SIZE;
        }

        if (dir === "left" /*&& this.dir.x !== GRID_SIZE*/) {
            this.dir.x = -GRID_SIZE;
            this.dir.y = 0;
        }

        if (dir === "right" /*&& this.dir.x !== -GRID_SIZE*/) {
            this.dir.x = GRID_SIZE;
            this.dir.y = 0;
        }
    }

    move() {

        // run brain for new direction
        this.brain_output();

        // update tail
        for (let i = this.body_length - 1; i > 0; i--) {
            this.body[i] = this.body[i - 1].copy();
        }

        // update head
        this.body[0].add(this.dir);

        // check for gameover
        if (this.checkDead()) {
            this.isAlive = 0;
        }

        // life vitals
        this.lifeTime++;
        this.lifeLeft--;

        // if food => eat
        if (this.body[0].equals(this.food)) this.eat();
    }

    eat() {

        this.score++;

        // increase life
        this.lifeLeft += 100;

        // add new snake part
        this.body.push(createVector(this.body[0].x, this.body[0].y));
        this.body_length++;

        // new food
        this.food = this.createFood();
    }

    isOnTail(pos) {
        for (let i = 1; i < this.body_length; i++) {
            if (pos.equals(this.body[i])) {
                return true;
            }
        }

        return false;
    }

    getVision() {
        let vision = [];

        // up
        let temp = this.visionInDirection(createVector(0, -GRID_SIZE));
        vision.push(temp[0]);
        vision.push(temp[1]);
        vision.push(temp[2]);

        // up + right
        temp = this.visionInDirection(createVector(GRID_SIZE, -GRID_SIZE));
        vision.push(temp[0]);
        vision.push(temp[1]);
        vision.push(temp[2]);

        // right
        temp = this.visionInDirection(createVector(GRID_SIZE, 0));
        vision.push(temp[0]);
        vision.push(temp[1]);
        vision.push(temp[2]);

        // down + right
        temp = this.visionInDirection(createVector(GRID_SIZE, GRID_SIZE));
        vision.push(temp[0]);
        vision.push(temp[1]);
        vision.push(temp[2]);

        //down
        temp = this.visionInDirection(createVector(0, GRID_SIZE));
        vision.push(temp[0]);
        vision.push(temp[1]);
        vision.push(temp[2]);

        // down + left
        temp = this.visionInDirection(createVector(-GRID_SIZE, GRID_SIZE));
        vision.push(temp[0]);
        vision.push(temp[1]);
        vision.push(temp[2]);

        // left
        temp = this.visionInDirection(createVector(-GRID_SIZE, 0));
        vision.push(temp[0]);
        vision.push(temp[1]);
        vision.push(temp[2]);

        // left + up
        temp = this.visionInDirection(createVector(-GRID_SIZE, -GRID_SIZE));
        vision.push(temp[0]);
        vision.push(temp[1]);
        vision.push(temp[2]);

        return vision;
    }

    visionInDirection(direction) {
        let pos = this.body[0].copy();

        let distance = 0;
        let foodFound = false;
        let tailFound = false;
        let out = [0, 0, 0]; // [foodFound, 1/tailDist, 1/wallDist]

        while (pos.x >= 0 && pos.x < Width && pos.y >= 0 && pos.y < Height) {
            if (!foodFound && pos.equals(this.food)) {
                foodFound = true;
                out[0] = 1;
            }

            if (!tailFound && this.isOnTail(pos)) {
                tailFound = true;
                out[1] = 1 / distance;
            }

            distance++;
            pos.add(direction);
        }

        out[2] = 1 / distance;

        return out;
    }

    brain_output() {
        let v = this.getVision();
        let out = this.brain.run(v);

        // console.log(v);
        // console.log(out);

        let m = -1, M = -1;
        for (let i = 0; i < 4; i++) {
            if (out[i] > M) {
                M = out[i];
                m = i;
            }
        }

        if (m === 0) this.change_dir("up");
        if (m === 1) this.change_dir("down");
        if (m === 2) this.change_dir("left");
        if (m === 3) this.change_dir("right");
    }



    calcFitness() {
        // lifetime for survival, length for eating food;
        let fitness = this.lifeTime * this.body_length;

        return fitness;
    }

    crossover(other) {
        let child = new Snake();
        child.brain = this.brain.crossover(other.brain);

        return child;
    }

    mutate(mutationRate) {
        this.brain.mutate(mutationRate);
    }

    saveSnake(name) {
        return this.brain.saveToJSON(name);
    }

    draw_vision_lines() {
        for (let i = 0; i < 360; i += 45) {
            let v = p5.Vector.fromAngle(radians(i), 600);

            push();
            translate(this.body[0].x + GRID_SIZE / 2, this.body[0].y + GRID_SIZE / 2);
            stroke(240, 0, 0);
            line(0, 0, v.x, v.y);
            pop();
        }
    }

    draw() {
        // draw snake
        stroke(0);
        fill('white');
        for (let i = 0; i < this.body_length; i++) {
            rect(this.body[i].x, this.body[i].y, GRID_SIZE, GRID_SIZE);
        }

        // draw food
        fill('#66DE93');
        rect(this.food.x, this.food.y, GRID_SIZE, GRID_SIZE);

        // this.draw_vision_lines();
    }
}