class NeuralNet {
    constructor(input, hidden, output) {

        this.input = input;
        this.hidden = hidden;
        this.output = output;

        // weights
        this.wi = new Matrix(this.hidden, this.input); // input to hidden1
        this.wh = new Matrix(this.hidden, this.hidden); // hidden1 to hidden2
        this.wo = new Matrix(this.output, this.hidden); // hidden2 to output

        // biases
        this.bi = new Matrix(this.hidden, 1); // input to hidden1
        this.bh = new Matrix(this.hidden, 1); // hidden1 to hidden2
        this.bo = new Matrix(this.output, 1); // hidden2 to output

        this.bi.zeros();
        this.bh.zeros();
        this.bo.zeros();

    }

    copy() {
        let clone = new NeuralNet(this.input, this.hidden, this.output);

        clone.wi = this.wi.copy();
        clone.wh = this.wh.copy();
        clone.wo = this.wo.copy();
        clone.bi = this.bi.copy();
        clone.bh = this.bh.copy();
        clone.bo = this.bo.copy();

        return clone;
    }

    run(inputs) {

        let a1 = Matrix.toMatrix(inputs, inputs.length, 1);
        let a2 = this.wi.dot(a1).add(this.bi).activate(); // a2 = sigmoid(w1*a1 + b1)
        let a3 = this.wh.dot(a2).add(this.bh).activate(); // a3 = sigmoid(w2*a2 + b2)
        let a4 = this.wo.dot(a3).add(this.bo).activate(); // a4 = sigmoid(w3*a3 + b3)

        return a4.toArray();
    }

    mutate(mutationRate) {

        this.wi.mutate(mutationRate);
        this.wh.mutate(mutationRate);
        this.wo.mutate(mutationRate);
        this.bi.mutate(mutationRate);
        this.bh.mutate(mutationRate);
        this.bo.mutate(mutationRate);
    }

    crossover(other) {
        let child = new NeuralNet(this.input, this.hidden, this.output);

        child.wi = this.wi.crossover(other.wi);
        child.wh = this.wh.crossover(other.wh);
        child.wo = this.wo.crossover(other.wo);
        child.bi = this.bi.crossover(other.bi);
        child.bh = this.bh.crossover(other.bh);
        child.bo = this.bo.crossover(other.bo);

        return child;
    }

    // save this neural network to a table
    saveToJSON(name) {

        let data = {
            fileName: name,
            wi: this.wi.toArray(),
            wh: this.wh.toArray(),
            wo: this.wo.toArray(),
            bi: this.bi.toArray(),
            bh: this.bh.toArray(),
            bo: this.bo.toArray()
        }

        return data;
    }

    // overwrite this NN from the given table
    loadFromJSON(data) {
        this.wi = Matrix.toMatrix(data.wi, this.wi.r, this.wi.c);
        this.wh = Matrix.toMatrix(data.wh, this.wh.r, this.wh.c);
        this.wo = Matrix.toMatrix(data.wo, this.wo.r, this.wo.c);
        this.bi = Matrix.toMatrix(data.bi, this.bi.r, this.bi.c);
        this.bh = Matrix.toMatrix(data.bh, this.bh.r, this.bh.c);
        this.bo = Matrix.toMatrix(data.bo, this.bo.r, this.bo.c);
    }
}