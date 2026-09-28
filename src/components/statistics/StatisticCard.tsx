import { Box, Card, CardContent, Typography } from "@mui/material";

type StatisticCardProps = {
    name: string,
    value: string
};

function StatisticCard({ name, value }: StatisticCardProps) {
    return (
        <Card sx={{
            borderRadius: 4,
            boxShadow: 2,
            height: "100%"
        }}>
            <Box sx={{
                backgroundColor: "secondary.main",
                p: 1,
                pl: 2
            }}
            >
                <Typography variant="body1">
                    {name}
                </Typography>
            </Box>
            <CardContent>
                <Typography variant="h6">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default StatisticCard