import { Button, Card, CardContent, CardActions, CardHeader } from '@mui/material';
import { User } from '../interfaces/User';

function PatientAppointmentSlot(props: { appointmentType: string; providerUserId: string; duration: number; startTime: Date; onChange: Function; user: User; key?: string }) {

    function scheduleAppointment() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('http://localhost:8080/schedule-appointment', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: props.user.email,
                    providerUserId: props.providerUserId,
                    appointmentType: props.appointmentType,
                    duration: props.duration,
                    startTime: props.startTime
                })
            })
            let _response = await rawResponse.json();
            props.onChange();
        })
    }

    return (
        <>
            <div className="patient-appointment-slot">
                <Card sx={{ m: 1 }}>
                    <CardHeader title={`${props.appointmentType} with ${props.providerUserId}`} />
                    <CardContent>
                        at {props.startTime.toLocaleString()} for {props.duration} minutes
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={() => {
                            scheduleAppointment()
                        }}>Schedule this appointment</Button>
                    </CardActions>
                </Card>

            </div>
        </>
    );
}

export default PatientAppointmentSlot;
