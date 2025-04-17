interface Manufacturer {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface CreateAManufacture {
    name: string;
    description: string;
    isActive: boolean;
}

export default Manufacturer;