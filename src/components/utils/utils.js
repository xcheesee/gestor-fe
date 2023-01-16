export function getDateDiff(date1, date2) {
    if(date1 === null || date2 === null) return 0
    const daysBetween = Date.parse(date2) - Date.parse(date1)
    return daysBetween / (1000 * 3600 * 24)
}