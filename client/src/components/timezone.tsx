import React, { useState, useEffect } from 'react';

import { InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

import { getSystemTimezonesList } from './shared_functions';

export default function Timezone(props: { timezone: string; setTimezone: Function; className?: string, disabled?:boolean }) {
    const [timezone, setTimezone] = useState<string>(props.timezone);
    const [timezoneList, setTimezoneList] = useState<Array<string>>(getSystemTimezonesList("core") || []);

    useEffect(() => {
        setTimezone(props.timezone);
    }, [props.timezone]);

    function selectTimezone(newTimezone: string) {
        props.setTimezone(newTimezone);
    }

    function timezoneMenuItem(timezone: string) {
        let timeWithTz = new Intl.DateTimeFormat('en-US', { hour: "numeric", minute:"numeric", timeZone: timezone, timeZoneName: "short" })
        let timeWithShortTz = timeWithTz.format(new Date())
        return <MenuItem key={timezone} value={timezone}>{timeWithShortTz} / {timeWithTz.resolvedOptions().timeZone}</MenuItem>
    }

    return (
        <div>
            <InputLabel sx={{position: "relative", top: "24px", marginTop: "-24px"}} id="timezone-select-label">Timezone</InputLabel>
            <Select
                labelId="timezone-select-label"
                id="timezone-select"
                value={timezone}
                label="Timezone"
                onChange={(event: SelectChangeEvent) => {
                    //console.log(event.target.value);
                    selectTimezone(event.target.value)
                }}
                fullWidth
                sx={{ m: 1 }}
                disabled={props.disabled}
            >
                {timezoneList.map((timezone) => {
                    return timezoneMenuItem(timezone);
                })}
            </Select>
        </div>
    );
}

