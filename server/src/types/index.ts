export interface IProduct {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    image: string;
    weight?: string;
}

export interface ICartItem {
    productId: number;
    count: number;
}

export interface IUser {
    id: number;
    email: string;
    name: string;
    phone: string;
    password: string; 
    cart: ICartItem[];
}