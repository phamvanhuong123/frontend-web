export interface Review {
  id: string;
  productId: string;
  userId: string;
  stars: number;
  comment?: string;
  imageUrl?: string;
  videoUrl?: string;
  // Additional properties for display
  productName?: string;
  userName?: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  userId: string;
  productId: string;
  stars: number;
  comment?: string;
  imageFile?: File;
  videoFile?: File;
}

export interface UpdateReviewRequest {
  stars: number;
  comment?: string;
  imageUrl?: string;
  videoUrl?: string;
}
