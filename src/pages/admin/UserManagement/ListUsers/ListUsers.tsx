import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Box, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { getUsers } from "../../../../services/userService";

interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
}

function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        debugger
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const formatRole = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="user table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>
              <TableSortLabel>Name</TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Phone Number
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Role
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell align="center">{user.phoneNumber}</TableCell>
              <TableCell align="center">{formatRole(user.role)}</TableCell>
              <TableCell align="center">
                <Chip
                  label={user.isActive ? "Active" : "Inactive"}
                  color={user.isActive ? "success" : "error"}
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="center">
                <Box
                  sx={{
                    "& .MuiIconButton-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <Tooltip title="View details">
                    <IconButton>
                      <VisibilityOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton color="primary">
                      <CreateOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ListUsers;