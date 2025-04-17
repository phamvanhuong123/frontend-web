export interface Post {
    id: string;
    title: string;
    content?: string;
    uri: string;
    startTime?: string;
    endTime?: string;
    isPublished: boolean;
    productPosts: ProductPost[];
}

export interface CreatePost {
    title: string;
    content?: string;
    uri: string;
    startTime?: string;
    endTime?: string;
    isPublished: boolean;
}

export interface ProductPost {
    postId: string;
    productId: string;
} 