export declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    static zero(): Vector3;
    add(other: Vector3): Vector3;
    subtract(other: Vector3): Vector3;
    multiply(scalar: number): Vector3;
    distanceTo(other: Vector3): number;
    floor(): Vector3;
    clone(): Vector3;
    toString(): string;
}
//# sourceMappingURL=Vec3.d.ts.map