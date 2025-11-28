export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const ALPHABET_MAP: Record<string, number> = {};
for (let i = 0; i < ALPHABET.length; i++) {
    ALPHABET_MAP[ALPHABET[i]] = i;
}

export const mod = (n: number, m: number): number => {
    return ((n % m) + m) % m;
};
