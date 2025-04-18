interface Product {
    id: string,
    name: string,
    description: string,
    price: number,
    isActive: boolean,
    categoryName: string,
    manufacturerName: string,
    discountName: string,
    images: {
        id: string,
        productId: string,
        url: string
    }[]
}

export interface CreateAProduct {
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
    categoryId: string;
    manufacturerId: string;
    discountId?: string;
    images?: {
        id: string,
        productId: string,
        url: string
    }[]
}
export default Product