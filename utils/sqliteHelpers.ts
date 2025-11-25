export function toSqliteTimestamp(date: Date) {
    const pad = (n: number) => String(n).padStart(2, "0")
    return (
        date.getUTCFullYear() + "-" +
        pad(date.getUTCMonth() + 1) + "-" +
        pad(date.getUTCDate()) + " " +
        pad(date.getUTCHours()) + ":" +
        pad(date.getUTCMinutes()) + ":" +
        pad(date.getUTCSeconds())
    )
}

export function fromSqliteTimestamp(dateString: string): Date {
    // Append 'Z' to indicate UTC, and replace space with T to conform to ISO 8601
    return new Date(dateString.replace(" ", "T") + "Z");
}