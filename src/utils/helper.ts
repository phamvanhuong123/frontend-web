export const getImageUrl = (imagePath: string): string => {
    return `${import.meta.env.VITE_BACKEND_URL}/images/product/${imagePath}`;
}; 