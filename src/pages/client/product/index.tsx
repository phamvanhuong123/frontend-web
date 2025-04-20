import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ViewDetail from "../../../layout/client/Product/ViewDetail";
import {  productApi } from "../../../services/axios.product";

const ProductPage = () => {
    const [dataProduct, setDataProduct] = useState<any>(null);
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const id = params?.get("id");

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (id: string) => {
        try {
            const res = await productApi.callFetchProductById(id);
            if (res && res.data) {
                const raw = res.data;
                // Process data
                raw.items = getImages(raw);
                setDataProduct(raw);
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
        }
    };

    const getImages = (raw: any) => {
        const images = [];
        if (raw.thumbnail) {
            images.push({
                original: `${import.meta.env.VITE_BACKEND_URL}/images/product/${raw.thumbnail}`,
                thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/product/${raw.thumbnail}`,
                originalClass: "original-image",
                thumbnailClass: "thumbnail-image",
            });
        }
        if (raw.slider) {
            raw.slider.forEach((item: string) => {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/product/${item}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/product/${item}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image",
                });
            });
        }
        return images;
    };

    return (
        <>
            {dataProduct ? (
                <ViewDetail dataProduct={dataProduct} />
            ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <p>Đang tải sản phẩm...</p>
                </div>
            )}
        </>
    );
};

export default ProductPage;