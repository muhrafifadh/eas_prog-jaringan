class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static fromPolar(r, theta) {
        return new Vector(r * Math.cos(theta), r * Math.sin(theta));
    }
    static zero() {
        return new Vector(0, 0);
    }
    static one() {
        return new Vector(1, 1);
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    get mag() {
        return Math.sqrt(this.mag);
    }
    get mag2() {
        return (Math.pow(this.x, 2)) + (Math.pow(this.y, 2));
    }
    get neg() {
        return new Vector(-this.x, -this.y);
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    static scale(v, c) {
        return new Vector(v.x * c, v.y * c);
    }
    scale(c) {
        this.x *= c;
        this.y *= c;
        return this;
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
}
export default Vector;
