/* Create matrix n*n and randomly fills it with numbers from 1 to n.
    Matrix consists of n js arrays */
class Latin {
    constructor(size = 3) {
        this.size = size;
        //numbers to fill (Ex. if matrix 3x3 contain num from 1 to 3)
        this.mst = [...Array(this.size)].map((v, i) => i + 1);
        // square is array which contains zeros
        this.square = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
        this.create(0, 0)
    }

    create(c, r) {
        const d = [...this.mst];
        let s;
        while (true) {
            do {
                s = d.splice(Math.floor(Math.random() * d.length), 1)[0];
                if (!s) return false;
            } while (this.check(s, c, r));

            this.square[c][r] = s;
            if (++c >= this.size) {
                c = 0;
                if (++r >= this.size) {
                    return true;
                }
            }
            if (this.create(c, r)) return true;
            if (--c < 0) {
                c = this.size - 1;
                if (--r < 0) {
                    return false;
                }
            }
        }
    }

    check(d, c, r) {
        for (let a = 0; a < this.size; a++) {
            if (c - a > -1) {
                if (this.square[c - a][r] === d)
                    return true;
            }
            if (r - a > -1) {
                if (this.square[c][r - a] === d)
                    return true;
            }
        }
        return false;
    }
}