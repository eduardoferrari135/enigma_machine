export class PlugBoard {
    private plugMap: Map<string, string>;

    constructor() {
        this.plugMap = new Map();
    }

    plugWire(first: string, second: string) {
        const a = first.toUpperCase();
        const b = second.toUpperCase();

        if (a.length !== 1 || b.length !== 1) throw new Error("Single chars only");
        if (a === b) throw new Error("Cannot plug letter to itself");
        if (this.plugMap.has(a) || this.plugMap.has(b)) {
            throw new Error("Letter already plugged");
        }

        this.plugMap.set(a, b);
        this.plugMap.set(b, a);
    }

    deleteLetter(letter: string) {
        const c = letter.toUpperCase();
        const other = this.plugMap.get(c);

        if (other) {
            this.plugMap.delete(c);
            this.plugMap.delete(other);
        }
    }

    process(letter: string) {
        return this.plugMap.get(letter.toUpperCase()) || letter.toUpperCase();
    }
}
