export const API_BASE_URL = 'https://localhost:7074';

export const getImageUrl = (imagePath: string) => {
    return `${API_BASE_URL}${imagePath}`;
}; 