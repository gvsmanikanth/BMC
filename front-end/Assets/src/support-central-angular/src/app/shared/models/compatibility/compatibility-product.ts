import { CompatibilityVersion } from "./compatibility-version";

export interface CompatibilityProduct {
    smartNumber: string,
    productName: string,
    versionCompatibility: CompatibilityVersion[];
}