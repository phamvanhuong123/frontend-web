interface Product {
    id: string,
    name: string,
    description: string,
    price: number,
    isActive: boolean,
    categoryName: string,
    manufacturerName: string,
    discountName: string,
    quantity: number,
    storeName: string,
    images: {
        id: string,
        productId: string,
        url: string
    }[]
}

export interface ProductQueryParameters {
    pageIndex?: number;
    pageSize?: number;
    sort?: string;
    category?: string;
    priceFrom?: number;
    priceTo?: number;
    searchTerm?: string;
}

export interface CreateAProduct {
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
    categoryId: string;
    manufacturerId: string;
    discountId?: string;
    quantity: number;
    storeId: string;
    images?: {
        id: string,
        productId: string,
        url: string
    }[]
}

export interface DetailAProduct {
    id: string;
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
    categoryName: string;         
    manufacturerName: string;
    discountName: string;
    images: {
        id: string;
        productId: string;
        url: string;
    }[];
}

export default Product