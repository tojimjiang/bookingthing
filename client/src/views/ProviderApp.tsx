import React, { useState, useEffect } from 'react';
import './ProviderApp.css';


import { Appointment } from '../interfaces/Appointment';
import { User } from '../interfaces/User';
import { Events } from '../interfaces/Events';

import Header from '../components/Header';
import CalendarComponent from '../components/calendarComponent';
import SubmitTime from '../components/submitTime';
import { ProviderTime } from '../interfaces/ProviderTime';

import dayjs from 'dayjs';

function ProviderApp(props: { user: User }) {
    let [appointmentEvents, setAppointmentEvents] = useState<Array<Events>>([]);
    let [providerTimeEvents, setProviderTimeEvents] = useState<Array<Events>>([]);

    useEffect(() => {
        getProviderAppointments();
        getProviderTimes();
    }, []);

    function makeProviderTimeEvents(providerTimes: Array<ProviderTime>) {
        let events: Array<Events> = [];
        providerTimes.forEach((provTime, index) => {
            events.push({
                id: provTime.userId + "_" + index,
                title: "Working Hours",
                start: dayjs(provTime.startTime).toDate(),
                end: dayjs(provTime.endTime).toDate()
            })
        });
        setProviderTimeEvents(events);
    }

    function getProviderTimes() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('http://localhost:8080/get-provider-time', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: props.user.email,
                })
            })
            let provTime = await rawResponse.json();
            makeProviderTimeEvents(provTime);
        })
    }

    function makeAppointmentEvents(appointments: Array<Appointment>) {
        let events: Array<Events> = [];
        appointments.forEach((appt, index) => {
            events.push({
                id: appt.id,
                title: appt.appointmentType + " with " + appt.patientUserId,
                start: dayjs(appt.startTime).toDate(),
                end: dayjs(appt.startTime).add(appt.duration, "minutes").toDate()
            })
        });
        setAppointmentEvents(events);
    }

    function getProviderAppointments() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('http://localhost:8080/get-provider-appointments', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: props.user.email,
                })
            })
            let appointments = await rawResponse.json();
            makeAppointmentEvents(appointments);
        })
    }

    return (
        <>
            <Header user={props.user}></Header>
            <div className="provider-app" style={{
                display: "flex",
                justifyContent: "space-evenly"
            }}>
                <div className="provider_app_section">
                    <h2 className="provider_app_section_title">Your Calendar</h2>
                    <CalendarComponent events={[...appointmentEvents, ...providerTimeEvents]} onNavigate={() => {
                        getProviderTimes();
                        getProviderAppointments();
                    }} />
                </div>
                <div className="provider_app_section">
                    <h2 className="provider_app_section_title">Submit Working Time</h2>
                    <SubmitTime user={props.user} timezone={props.user.timezone || "America/New_York"} onAddProviderTime={() => {
                        getProviderTimes();
                        getProviderAppointments();
                    }}
                    />
                </div>
            </div>
        </>
    );
}

export default ProviderApp;
