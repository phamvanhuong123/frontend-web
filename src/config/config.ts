export const API_BASE_URL = 'http://localhost:5000';

export const getImageUrl = (imagePath: string) => {
    return `${API_BASE_URL}${imagePath}`;
}; 