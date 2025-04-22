import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CountUp from 'react-countup';
const WIDTH_CARD = "30%"
function Dashboard() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap : 'wrap',
          p : 2,
          gap : 2,
        }}
      >
        <Card sx={{
            width : WIDTH_CARD
        }}>
          <CardHeader title="Tổng Users"/>
          <CardContent>
            <Typography  variant="h4" sx={{ color: "text.secondary" }}>
            <CountUp end={23} />
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{
            width : WIDTH_CARD
        }}>
          <CardHeader title="Tổng Products"/>
          <CardContent>
            <Typography  variant="h4" sx={{ color: "text.secondary" }}>
            <CountUp end={100} />
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{
            width : WIDTH_CARD
        }}>
          <CardHeader title="Tổng Orders "/>
          <CardContent>
            <Typography  variant="h4" sx={{ color: "text.secondary" }}>
            <CountUp end={34} />
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
export default Dashboard;
