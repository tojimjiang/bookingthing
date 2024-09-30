import React, { useState, useEffect } from 'react';

import { Button, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';

import Timezone from './timezone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


import { User } from '../interfaces/User';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function SubmitTime(props: { user: User, timezone: string; minimumDuration?: number, onAddProviderTime: Function}) {
    const [toolActive, setToolActive] = useState<boolean>(false);
    const [timezone, setTimezone] = useState<string>(props.timezone);
    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();
    const [errors, setErrors] = useState<Array<string>>([]);

    useEffect(() => {
        setTimezone(props.timezone);
    }, [props.timezone]);


    function submitWorkingTimeToServer() {
        setErrors([]);
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('http://localhost:8080/new-provider-time', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: props.user.email,
                    startTime: startTime,
                    endTime: endTime
                })
            })
            let content = await rawResponse.json();
            if (content.errors?.length) {
                  setErrors(content.errors)
            } else {
                props.onAddProviderTime(content.providerTimeSlot);
                setToolActive(false);
                setStartTime(undefined);
                setEndTime(undefined);
                setErrors([]);
            }
        })
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Timezone timezone={props.timezone} setTimezone={setTimezone} disabled={true} />
                {toolActive ?
                    <Dialog open={toolActive}>
                        <DialogTitle>
                            Add Working Time
                        </DialogTitle>
                        <DialogContent sx={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                            <DateTimePicker
                                label="Workday + Start Time"
                                disablePast
                                minutesStep={15}
                                value={startTime ? dayjs(startTime) : null}
                                onChange={(value) => {
                                    if (value) {
                                        //console.log(value)
                                        setStartTime(value.toDate())
                                    }
                                }}
                                timezone={props.timezone}
                                sx={{
                                    margin: "1em"
                                }}
                            />
                            <DateTimePicker label="End Time"
                                minDateTime={dayjs((startTime?.valueOf() || (new Date).valueOf()) + 3600000)}
                                maxDateTime={dayjs(startTime).endOf("day")}
                                minutesStep={15}
                                value={endTime ? dayjs(endTime) : null}
                                onChange={(value) => {
                                    if (value) {
                                        //console.log(value)
                                        setEndTime(value.toDate())
                                    }
                                }}
                                timezone={props.timezone}
                                sx={{
                                    margin: "1em"
                                }}
                            />
                            {startTime && endTime ? "You will be working for about " + (endTime.valueOf() - startTime.valueOf()) / 3600000 + " hours." : ""}
                        </DialogContent>
                        <DialogActions sx={{
                            justifyContent: "space-between"
                        }}>

                            <Button variant="text" onClick={() => {
                                setToolActive(false);
                            }}>Cancel</Button>

                            <Button disabled={dayjs(startTime).isAfter(endTime)} variant="contained" onClick={() => {
                                submitWorkingTimeToServer();
                            }}>Confirm Add Working Time</Button>
                        </DialogActions>
                    </Dialog> : <Button fullWidth variant="contained" onClick={() => {
                        setToolActive(true)
                    }}>Add Working Time</Button>}
            </LocalizationProvider>
        </>
    );
}

