export function formatDuration(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    let hoursLabel = "hours"
    let minutesLabel = "minutes"

    if (hours === 0 && minutes === 0) {
        return "0 minutes"
    }

    if (hours === 1) {
        hoursLabel = "hour"
    }
    if (minutes === 1) {
        minutesLabel = "minute"
    }

    if (hours === 0) {
        return minutes + " " + minutesLabel
    }

    if (minutes === 0) {
        return hours + " " + hoursLabel
    }

    return String(hours) + " " + hoursLabel + " " + String(minutes) + " " + minutesLabel
}