interface Manufacturer {
    id: string;
    name: string;
    phoneNumber: string | null;
    address: string | null;
}

export interface CreateAManufacture {
    name: string;
    phoneNumber?: string;
    address?: string;
}

export default Manufacturer;