export class Alphabet {
    public static readonly CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    public static toInt(c: string): number {
      return this.CHARS.indexOf(c);
    }
  
    public static toChar(i: number): string {
      return this.CHARS[(i + 26) % 26];
    }
  
    public static contains(c: string): boolean {
      return this.CHARS.includes(c);
    }
  
    public static get list(): string[] {
      return this.CHARS.split('');
    }
  }
  
  export interface WiringSpec {
    wiring: string;
    notch: string;
  }
  
  export class MachineLibrary {
    private static readonly ROTORS: Record<string, WiringSpec> = {
      I:   { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" },
      II:  { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" },
      III: { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" },
      IV:  { wiring: "ESOVPZJAYQUIRHXLNFTGKDCMWB", notch: "J" },
      V:   { wiring: "VZBRGITYUPSDNHLXAWMJQOFECK", notch: "Z" },
    };
  
    private static readonly REFLECTORS: Record<string, string> = {
      B: "YRUHQSLDPXNGOKMIEBFZCWVJAT",
      C: "FVPJIAOYEDRZXWGCTKUQSBNMHL",
    };
  
    public static getRotorSpec(type: string): WiringSpec {
      return this.ROTORS[type];
    }
  
    public static getReflectorWiring(type: string): string {
      return this.REFLECTORS[type];
    }
  
    public static get availableRotors(): string[] {
      return Object.keys(this.ROTORS);
    }
  
    public static get availableReflectors(): string[] {
      return Object.keys(this.REFLECTORS);
    }
  }
  
  export class Plugboard {
    private wiring: Map<string, string>;
  
    constructor(pairs: string[]) {
      this.wiring = new Map();
      for (const char of Alphabet.list) {
        this.wiring.set(char, char);
      }
      for (const pair of pairs) {
        if (pair.length === 2) {
          const [a, b] = pair.split('');
          this.connect(a, b);
        }
      }
    }
  
    private connect(a: string, b: string): void {
      this.wiring.set(a, b);
      this.wiring.set(b, a);
    }
  
    public process(char: string): string {
      return this.wiring.get(char) || char;
    }
  }
  
  export class Reflector {
    private readonly map: string;
  
    constructor(wiring: string) {
      this.map = wiring;
    }
  
    public reflect(char: string): string {
      const idx = Alphabet.toInt(char);
      return this.map[idx];
    }
  }
  
  export class Rotor {
    private readonly wiring: string;
    private readonly notch: string;
    
    private _position: number = 0;
    private _ringSetting: number = 0;
  
    constructor(wiring: string, notch: string) {
      this.wiring = wiring;
      this.notch = notch;
    }
  
    public get position(): number { return this._position; }
    public set position(p: number) { this._position = p; }
  
    public get ringSetting(): number { return this._ringSetting; }
    public set ringSetting(s: number) { this._ringSetting = s; }
  
    public get currentLetter(): string {
      return Alphabet.toChar(this._position);
    }
  
    public rotate(): void {
      this._position = (this._position + 1) % 26;
    }
  
    public isAtNotch(): boolean {
      return Alphabet.toChar(this._position) === this.notch;
    }
  
    public forward(char: string): string {
      const idx = Alphabet.toInt(char);
      const offset = (this._position - this._ringSetting + 26) % 26;
      
      const inputIdx = (idx + offset) % 26;
      const wiringChar = this.wiring[inputIdx];
      const wiringIdx = Alphabet.toInt(wiringChar);
      
      const finalIdx = (wiringIdx - offset + 26) % 26;
      return Alphabet.toChar(finalIdx);
    }
  
    public backward(char: string): string {
      const idx = Alphabet.toInt(char);
      const offset = (this._position - this._ringSetting + 26) % 26;
      
      const inputIdx = (idx + offset) % 26;
      const inputChar = Alphabet.toChar(inputIdx);
      const wiringIdx = this.wiring.indexOf(inputChar);
      
      const finalIdx = (wiringIdx - offset + 26) % 26;
      return Alphabet.toChar(finalIdx);
    }
  }
  
  export class EnigmaMachine {
    private reflector: Reflector;
    private rotors: [Rotor, Rotor, Rotor]; 
    private plugboard: Plugboard;
  
    constructor(reflector: Reflector, left: Rotor, mid: Rotor, right: Rotor, plugboard: Plugboard) {
      this.reflector = reflector;
      this.rotors = [left, mid, right];
      this.plugboard = plugboard;
    }
  
    public configureSettings(rings: number[], positions: number[]): void {
      this.rotors.forEach((rotor, i) => {
        rotor.ringSetting = rings[i];
        rotor.position = positions[i];
      });
    }
  
    private stepMechanism(): void {
      const [left, mid, right] = this.rotors;
      const rightNotch = right.isAtNotch();
      const midNotch = mid.isAtNotch();
  
      if (midNotch) {
        mid.rotate();
        left.rotate();
      } else if (rightNotch) {
        mid.rotate();
      }
      right.rotate();
    }
  
    public encipher(char: string): string {
      if (!Alphabet.contains(char)) return char;
  
      this.stepMechanism();
  
      let signal = this.plugboard.process(char);
  
      signal = this.rotors[2].forward(signal);
      signal = this.rotors[1].forward(signal);
      signal = this.rotors[0].forward(signal);
  
      signal = this.reflector.reflect(signal);
  
      signal = this.rotors[0].backward(signal);
      signal = this.rotors[1].backward(signal);
      signal = this.rotors[2].backward(signal);
  
      signal = this.plugboard.process(signal);
  
      return signal;
    }
  
    public getDisplayPositions(): string[] {
      return this.rotors.map(r => r.currentLetter);
    }
  }
  
  export class EnigmaFactory {
    public static createMachine(config: {
      rotors: string[];
      reflector: string;
      rings: number[];
      positions: number[];
      plugs: string[];
    }): EnigmaMachine {
      
      const pb = new Plugboard(config.plugs);
      const refData = MachineLibrary.getReflectorWiring(config.reflector);
      const ref = new Reflector(refData);
  
      const rotors = config.rotors.map(type => {
        const spec = MachineLibrary.getRotorSpec(type);
        return new Rotor(spec.wiring, spec.notch);
      });
  
      const machine = new EnigmaMachine(
        ref,
        rotors[0],
        rotors[1],
        rotors[2],
        pb
      );
  
      machine.configureSettings(config.rings, config.positions);
      return machine;
    }
  }