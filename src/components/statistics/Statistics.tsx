import StatisticCard from "./StatisticCard";
import { type Statistic } from "../../types/statistics";

type StatisticsProps = {
    statistics: Statistic[];
}

function Statistics({ statistics }: StatisticsProps) {
    return (
        <section className="statistics">
            <div className="heading">
                <h2>Statistics</h2>
            </div>
            <div className="cards">
                <ul>
                    {statistics.map((statistic) => (
                        <StatisticCard key={statistic.name} name={statistic.name} value={statistic.value} />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default Statistics