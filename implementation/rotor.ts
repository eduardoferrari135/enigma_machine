import { ALPHABET, ALPHABET_MAP, mod } from "./utils";

export enum RotorType {
    I = "I",
    II = "II",
    III = "III",
    IV = "IV",
    V = "V"
}

const ROTOR_CONFIGS: Record<RotorType, [string, string]> = {
    [RotorType.I]: ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q"],
    [RotorType.II]: ["AJDKSIRUXBLHWTMCQGZNPYFVOE", "E"],
    [RotorType.III]: ["BDFHJLCPRTXVZNYEIWGAKMUSQO", "V"],
    [RotorType.IV]: ["ESOVPZJAYQUIRHXLNFTGKDCMWB", "J"],
    [RotorType.V]: ["VZBRGITYUPSDNHLXAWMJQOFECK", "Z"],
};

export class Rotor {
    public position: number;
    private wiringForward: string;
    private wiringBackward: string;
    public notchIndex: number;

    constructor(type: RotorType, position: string | number) {
        const [wiring, notchChar] = ROTOR_CONFIGS[type];
        this.wiringForward = wiring;
        this.notchIndex = ALPHABET_MAP[notchChar];

        this.position = typeof position === "string" ?
            ALPHABET_MAP[position.toUpperCase()] :
            mod(position, 26);

        const inverseArr = new Array(26);
        for (let i = 0; i < 26; i++) {
            const char = wiring[i];
            const targetIndex = ALPHABET_MAP[char];
            inverseArr[targetIndex] = ALPHABET[i];
        }
        this.wiringBackward = inverseArr.join("");
    }

    step(): boolean {
        const atNotch = this.position === this.notchIndex;
        this.position = (this.position + 1) % 26;
        return atNotch;
    }

    forward(charIndex: number): number {
        const shift = this.position;
        const indexEntered = mod(charIndex + shift, 26);
        const charMapped = this.wiringForward[indexEntered];
        const indexMapped = ALPHABET_MAP[charMapped];
        return mod(indexMapped - shift, 26);
    }

    backward(charIndex: number): number {
        const shift = this.position;
        const indexEntered = mod(charIndex + shift, 26);
        const charMapped = this.wiringBackward[indexEntered];
        const indexMapped = ALPHABET_MAP[charMapped];
        return mod(indexMapped - shift, 26);
    }
}
