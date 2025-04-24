export const API_BASE_URL = 'http://localhost:5000';

export const getImageUrl = (imagePath: string) => {
    return `${API_BASE_URL}${imagePath}`;
}; 

export const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.2790822484896!2d109.2336356!3d13.7732306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f6c62ab22f27f%3A0x8d8575ae4469cfdf!2zQ-G7rWEgSMOgbmcgWeG7h24gU8Ogbw==!5e0!3m2!1sen!2s!4v1713941454823!5m2!1sen!2s";
