// src/types/product.types.ts

export interface ProductPrice {
    min: number;
    max: number;
    currency: string;
}

export interface ProductCategory {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    name: string;
    nameAr?: string;
    nameFr?: string;
    slug: string;
    description?: string;
    image?: string;
    price: ProductPrice;
    moq: number;
    orders: number; // total orders
    isFeatured: boolean;
    isActive: boolean;
    category?: ProductCategory;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductPayload {
    name: string;
    nameAr?: string;
    nameFr?: string;
    description?: string;
    imageUrl?: string;
    priceMin?: number;
    priceMax?: number;
    currency?: string;
    moq?: number;
    categoryId?: string;
    isFeatured?: boolean;
    isActive?: boolean;
}

export interface UpdateProductPayload {
    name?: string;
    nameAr?: string;
    nameFr?: string;
    description?: string;
    imageUrl?: string;
    priceMin?: number;
    priceMax?: number;
    currency?: string;
    moq?: number;
    categoryId?: string;
    isFeatured?: boolean;
    isActive?: boolean;
}

export interface PaginatedProductsResponse {
    products: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
