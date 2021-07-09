class Matrix {
    constructor(r, c) {
        this.r = r;
        this.c = c;

        this.matrix = [];
        for (let i = 0; i < r; i++) {

            let v = [];
            for (let j = 0; j < c; j++) {
                v.push(random(1));
            }
            this.matrix.push(v);
        }
    }

    zeros() {
        for(let i = 0; i < this.r; i++)
            for(let j = 0; j < this.c; j++) 
                this.matrix[i][j] = 0;
    }

    copy() {
        let clone = new Matrix(this.r, this.c);

        for (let i = 0; i < this.r; i++) {
            for (let j = 0; j < this.c; j++) {
                clone.matrix[i][j] = this.matrix[i][j];
            }
        }

        return clone;
    }

    add(other) {
        if (this.r === other.r && this.c === other.c) {
            let child = new Matrix(this.r, this.c);

            for (let i = 0; i < this.r; i++) {
                for (let j = 0; j < this.c; j++) {
                    child.matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
                }
            }

            return child;
        }
        else throw 'Mismatch Dimensions';
    }

    dot(other) {
        if (this.c === other.r) {
            let child = new Matrix(this.r, other.c);

            for (let i = 0; i < this.r; i++) {
                for (let j = 0; j < other.c; j++) {
                    child.matrix[i][j] = 0;
                    for (let k = 0; k < this.c; k++) {
                        child.matrix[i][j] += this.matrix[i][k] * other.matrix[k][j];
                    }
                }
            }

            return child;
        }
        else throw 'Mismatch Dimensions';
    }

    activate() {
        let child = new Matrix(this.r, this.c);
        for (let i = 0; i < this.r; i++) {
            for (let j = 0; j < this.c; j++) {
                child.matrix[i][j] = this.sigmoid(this.matrix[i][j]);
            }
        }

        return child;
    }

    sigmoid(x) {
        return 1 / (1 + Math.pow(Math.E, -x));
    }

    mutate(mutationRate) {
        for (let i = 0; i < this.r; i++) {
            for (let j = 0; j < this.c; j++) {
                let r = random(1);
                if (r < mutationRate) this.matrix[i][j] += randomGaussian() / 5;

                if (this.matrix[i][j] > 1) this.matrix[i][j] = 1;
                if (this.matrix[i][j] < -1) this.matrix[i][j] = -1;
            }
        }
    }

    crossover(other) {
        let randR = int(random(this.r));
        let randC = int(random(this.c));

        let child = new Matrix(this.r, this.c);

        for (let i = 0; i < this.r; i++) {
            for (let j = 0; j < this.c; j++) {
                if (i < randR || (i === randR && j <= randC)) child.matrix[i][j] = this.matrix[i][j];
                else child.matrix[i][j] = other.matrix[i][j];
            }
        }

        return child;
    }

    setElement(x, y, ele) {
        if (x < this.r && y < this.c) {
            this.matrix[x][y] = ele;
        }
        else throw 'Out of Bounds';
    }

    // returns 1D array of this matrix
    toArray() {
        let out = [];

        for (let i = 0; i < this.r; i++) {
            for (let j = 0; j < this.c; j++) {
                out.push(this.matrix[i][j]);
            }
        }

        return out;
    }

    // returns 2D matrix(r,c) from 1D array arr
    static toMatrix(arr, r, c) {
        let out = new Matrix(r, c);

        for (let i = 0; i < r; i++) {
            for (let j = 0; j < c; j++) {
                out.matrix[i][j] = arr[i*c + j];
            }
        }

        return out;
    }
}