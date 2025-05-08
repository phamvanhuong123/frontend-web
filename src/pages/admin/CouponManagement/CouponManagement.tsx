import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ListCoupons from "./ListCoupons/ListCoupons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CouponManagement() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("allStatus");

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Box sx={{ bgcolor: "#FFFFFF", p: 3, borderRadius: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            {/* Search */}
            <Box>
              <TextField
                size="small"
                id="filled-search"
                label="Tìm kiếm"
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
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(105, 177, 255)",
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 120,
                  ".MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "rgb(105, 177, 255)" },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(105, 177, 255)",
                    },
                  },
                }}
                size="small"
              >
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={status}
                  onChange={handleChange}
                >
                  <MenuItem value={"allStatus"}>Tất Cả Trạng Thái</MenuItem>
                  <MenuItem value={"active"}>Hoạt Động</MenuItem>
                  <MenuItem value={"inactive"}>Không Hoạt Động</MenuItem>
                </Select>
              </FormControl>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => {
                  navigate("create");
                }}
              >
                Thêm Mã Giảm Giá
              </Button>
              <Button variant="outlined">Tải Lại Trang</Button>
            </Box>
          </Box>

          {/* List Coupons */}
          <ListCoupons />
        </Box>
      </Box>
    </>
  );
}

export default CouponManagement;
