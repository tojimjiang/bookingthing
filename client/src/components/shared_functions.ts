import { CORE_USA_TIMEZONES } from "./constants";

export function getSystemTimezone() {
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone;
}

export function getSystemTimezonesList(scope: String) {
    let allTimezonesList = Intl.supportedValuesOf('timeZone');
    if (scope === "global") {
        return allTimezonesList;
    } else if (scope === "america") {
        return allTimezonesList.filter((timezone: string) => {
            return /(America\/)|(Pacific\/Honolulu)/.test(timezone);
        });
    } else if (scope === "core") {
        return allTimezonesList.filter((timezone: string) => {
            return CORE_USA_TIMEZONES.includes(timezone)
        });
    }
}