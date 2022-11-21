export function randomBetween(a: number, b: number) {
    const distanceFromA = Math.floor(Math.random() * (b-a));
    return a + distanceFromA;
}