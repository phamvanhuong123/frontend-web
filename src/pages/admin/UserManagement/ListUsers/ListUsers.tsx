import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];
const labels = ["Name","Phone Number","Role","Status","Action"];
function ListUsers() {
   
    return (
        <>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
                <TableRow >
                <TableCell sx={{fontWeight : 600}} ><TableSortLabel>Email</TableSortLabel></TableCell>

                
                <TableCell  sx={{fontWeight : 600}} align='center'><TableSortLabel>Name</TableSortLabel></TableCell>
                <TableCell sx={{fontWeight : 600}} align='center'><TableSortLabel>Phone Number</TableSortLabel></TableCell>
                <TableCell sx={{fontWeight : 600}} align='center'>Role</TableCell>
                <TableCell sx={{fontWeight : 600}} align='center'>Status</TableCell>
                <TableCell sx={{fontWeight : 600}} align='center'>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                    <TableCell>
                    {row.name}
                    </TableCell>
                    <TableCell align='center'>{row.calories}</TableCell>
                    <TableCell align='center'>{row.fat}</TableCell>
                    <TableCell align='center'>{row.carbs}</TableCell>
                    <TableCell align='center'>{row.protein}</TableCell>
                    <TableCell align='center'>
                    <Box sx={{
                        "& .MuiIconButton-root" : {
                            borderRadius : 2
                        }
                    }}>
                        <Tooltip title="Detail">
                            <IconButton ><VisibilityOutlinedIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton  color="primary"><CreateOutlinedIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton color="error" ><DeleteIcon /></IconButton>
                        </Tooltip>
                    
                        
                        
                    </Box>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </>
  );
}
export default ListUsers;
