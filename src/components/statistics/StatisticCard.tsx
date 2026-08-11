type StatisticCardProps = {
    name: string,
    value: string
};

function StatisticCard({ name, value }: StatisticCardProps) {
    return (
        <li className="statistics-card">
            <p>{name}: {value}</p>
        </li>
    )
}

export default StatisticCard