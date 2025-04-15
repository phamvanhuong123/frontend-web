import  { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { Flip, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { productApi } from "~/services/axios.product";

const categories = ["Điện thoại","Laptop"];
const manufacturers = ["Apple", "Samsung", "Nokia", "Acer", "Asus"];

function CreateProduct(){
    const [product,setProduct] = useState({});
    

    const navigate = useNavigate();
      //Sử kiện thay đổi dữ liệu
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name] : value
        })
      };
      // Sự kiện submit
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted:", product);
        // TODO: Gửi dữ liệu lên server hoặc xử lý thêm
        const fetchApi = async()=>{
         try{
          const res = await productApi.CreateProduct(product)
          console.log(res);

          toast.success("Thêm sản phẩm thành công",{
            autoClose : 1000,
            transition : Flip,
          })
          navigate("/admin/products")
         }catch(error){
          console.log(error)
         }
        }
        fetchApi();
        
      };


    useEffect(()=>{

    })
    console.log(product)
    return <>
     <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Thêm sản phẩm mới
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} gap={3}>
           
              <TextField
                fullWidth
                label="Tên sản phẩm"
                name="name"
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
              
                onChange={handleChange}
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Giá"
                name="price"
                onChange={handleChange}
                required
                type="number"
              />
              <TextField
                //Sau này có select thì bỏ comment ở dưới
                // select
                fullWidth
                label="Danh mục"
                name="categoryId"
                onChange={handleChange}
                required
              >
                {/* {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))} */}
              </TextField>
              <TextField
                //Sau này select thì bỏ comment cái ở dưới 
                // select
                fullWidth
                label="Nhà Sản xuất"
                name="manufacturerId"
                onChange={handleChange}
                required
              >
                
                {/* {manufacturers.map((mfg) => (
                  <MenuItem key={mfg} value={mfg}>
                    {mfg}
                  </MenuItem>
                ))} */}
              </TextField>
              <Button type="submit" variant="contained">
                Thêm sản phẩm
              </Button>
            </Grid>
            

           
           
        
        </form>
      </CardContent>
    </Card>
    </>
}
export default CreateProduct