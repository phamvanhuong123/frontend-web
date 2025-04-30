import axios from "./axios.customize";
import {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "~/types/review";

const url = "api/v1/ecommerce/reviews";

export const reviewApi = {
  getAll() {
    return axios.get<Review[]>(url).then((res) => res.data);
  },

  getById(id: string) {
    return axios.get<Review>(`${url}/${id}`).then((res) => res.data);
  },

  getByProductId(productId: string) {
    return axios
      .get<Review[]>(`${url}/product/${productId}`)
      .then((res) => res.data);
  },

  getByUserId(userId: string) {
    return axios.get<Review[]>(`${url}/user/${userId}`).then((res) => res.data);
  },

  hasUserReviewedProduct(userId: string, productId: string) {
    return axios
      .get<boolean>(`${url}/user/${userId}/product/${productId}/has-reviewed`)
      .then((res) => res.data);
  },

  isOrderCompletedForProduct(userId: string, productId: string) {
    return axios
      .get<boolean>(
        `${url}/user/${userId}/product/${productId}/order-completed`
      )
      .then((res) => res.data);
  },

  create(formData: FormData) {
    return axios
      .post<Review>(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  },

  update(id: string, review: UpdateReviewRequest) {
    return axios.put<Review>(`${url}/${id}`, review).then((res) => res.data);
  },

  delete(id: string) {
    return axios.delete<boolean>(`${url}/${id}`).then((res) => res.data);
  },

  getAverageRatingByProductId(productId: string) {
    return axios
      .get<number>(`${url}/product/${productId}/average-rating`)
      .then((res) => res.data);
  },

  getTotalReviewsByProductId(productId: string) {
    return axios
      .get<number>(`${url}/product/${productId}/total`)
      .then((res) => res.data);
  },
};
