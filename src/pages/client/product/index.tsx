import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ViewDetail from "../../../layout/client/Product/ViewDetail";
import { productApi } from "../../../services/axios.product";

const ProductPage = () => {
  const [dataProduct, setDataProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { slug } = useParams(); // slug có thể là ID hoặc slug SEO-friendly
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Lấy ID từ query parameter hoặc từ slug
  const queryId = params.get("id");
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        if (!slug) {
          console.error("Không tìm thấy slug sản phẩm");
          setLoading(false);
          return;
        }
        
        console.log("Fetching product with slug:", slug);
        const res = await productApi.callFetchProductBySlug(slug);
        
        if (res && res.data) {
          const raw = res.data;
          raw.items = getImages(raw);
          setDataProduct(raw);
        } else {
          console.error("Không tìm thấy sản phẩm với slug:", slug);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug]); // Chỉ phụ thuộc vào slug

  const getImages = (raw: any) => {
    const images = [];
    if (raw.thumbnail) {
      images.push({
        original: `getImageUrl/${raw.thumbnail}`,
        thumbnail: `getImageUrl/${raw.thumbnail}`,
        originalClass: "original-image",
        thumbnailClass: "thumbnail-image",
      });
    }
    if (raw.slider && Array.isArray(raw.slider)) {
      raw.slider.forEach((item: string) => {
        images.push({
          original: `getImageUrl/${item}`,
          thumbnail: `getImageUrl/${item}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      });
    }
    return images;
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : dataProduct ? (
        <ViewDetail dataProduct={dataProduct} />
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Không tìm thấy sản phẩm</p>
        </div>
      )}
    </>
  );
};

export default ProductPage;
