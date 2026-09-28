import StatisticCard from "./StatisticCard";
import { type Statistic } from "../../types/statistics";
import { Grid } from "@mui/material";

type StatisticsProps = {
    statistics: Statistic[];
}

function Statistics({ statistics }: StatisticsProps) {
    return (
        <Grid
            container
            columnSpacing={2}
            rowSpacing={2}
            sx={{
                alignItems: "stretch"
            }}
        >
            {statistics.map((statistic) => (
                <Grid key={statistic.name} size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatisticCard
                        name={statistic.name}
                        value={statistic.value}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default Statistics