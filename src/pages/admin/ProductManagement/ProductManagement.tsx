import {FormControl, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import ListProducts from './ListProducts/ListProducts.tsx';
import { useState } from "react";

import { useNavigate } from "react-router-dom";

function ProductManagement(){
    const [status, setStatus] = useState('allStatus');
    const navigate = useNavigate();
  const handleChange = (event: SelectChangeEvent) => {

    setStatus(event.target.value);
  };
  return (
    <>
      <Box
        sx={{
          p: 2,
        }}
      
      >
        <Box sx={{ bgcolor : '#FFFFFF',p : 3,borderRadius : 4}}>
          <Box sx={{
            display : 'flex',
            alignItems : 'center',
            justifyContent : 'space-between',
            marginBottom : 2
            
          }}>
            {/* Search */}
            <Box>
              <TextField
                size="small"
                id="filled-search"
                label="Search"
                type="search"
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <SearchIcon sx={{ fontSize: 18, marginRight: 1 }} />
                    ),
                  },
                }}
                sx={{
                
                  "& input": { px: 0 },
                  "&:hover label": { color: "rgb(105, 177, 255)" },
                  ".MuiOutlinedInput-root": {
                    px: 1,
                    "&:hover fieldset": { borderColor: "rgb(105, 177, 255)" },
                    '&.Mui-focused fieldset' : { borderColor: "rgb(105, 177, 255)" },
                    
                  },
                }}
              />
            </Box>

            <Box sx={{
                display : 'flex',
                alignItems : 'center',
                gap : 1
            }}>
              <FormControl sx={{
                m: 1,
                minWidth: 120,
                ".MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "rgb(105, 177, 255)" },
                    '&.Mui-focused fieldset' : { borderColor: "rgb(105, 177, 255)" },
                  },
                
                }}
                 size="small" >
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={status}
                  
                  onChange={handleChange}
                  
                >
                  <MenuItem value={'allStatus'}>All Status</MenuItem>
                  <MenuItem value={'active'}>Active</MenuItem>
                  <MenuItem value={'inactive'}>Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button startIcon={<AddIcon/>} variant="contained" onClick={()=>{navigate('create')}}>Add Product</Button>
              <Button  variant="outlined">Reload</Button>
            </Box>
          </Box>


          {/* List Product */}
          
          <ListProducts />
        </Box>
      </Box>
    </>
  );
}
export default ProductManagement;
