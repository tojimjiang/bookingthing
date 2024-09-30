import { Button, Card, CardContent, CardActions, CardHeader } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { User } from '../interfaces/User';


function PatientAppointment(props: { appointmentId: string, appointmentType: string; providerUserId: string; duration: number; startTime: Date; mustConfirmBy?: Date; onChange: Function; user: User; key?: string }) {
    let timeConfirmString = "";
    if (props.mustConfirmBy) {
        timeConfirmString = new Date(props.mustConfirmBy).toLocaleTimeString();
    }

    function confirmAppointment() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('http://localhost:8080/confirm-appointment', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: props.user.email,
                    id: props.appointmentId,
                })
            })
            let _response = await rawResponse.json();
            props.onChange();
        })
    }

    return (
        <>
            <div className="patient-appointment">
                <Card sx={{ m: 1 }}>
                    <CardHeader title={`${props.appointmentType} with ${props.providerUserId}`} sx={{ color: "#ffffff", backgroundColor: "#028120" }} />
                    <CardContent>
                        at {new Date(props.startTime).toLocaleString()} for {props.duration} minutes
                    </CardContent>
                    <CardActions>
                        {props.mustConfirmBy ? <Button variant="contained" onClick={() => {
                            confirmAppointment()
                        }}>Confirm before {timeConfirmString}</Button> : <Button>CONFIRMED</Button>}
                    </CardActions>
                </Card>
            </div>
        </>
    );
}

export default PatientAppointment;
