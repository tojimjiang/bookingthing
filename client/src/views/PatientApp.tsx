import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import './PatientApp.css';

import Header from '../components/Header';
import PatientAppointment from '../components/patientAppointment';
import PatientAppointmentSlot from '../components/patientAppointmentSlot';
import { Appointment } from '../interfaces/Appointment';
import { AppointmentSlot } from '../interfaces/AppointmentSlot';
import { ProviderTime } from '../interfaces/ProviderTime';
import { User } from '../interfaces/User';

function PatientApp(props: { user: User }) {
    let [appointments, setAppointments] = useState<Array<Appointment>>([]);
    let [appointmentSlots, setAppointmentSlots] = useState<Array<AppointmentSlot>>([]);

    let [providerTime, setProviderTime] = useState<Array<ProviderTime>>([]);
    let [appointmentKeys, setAppointmentKeys] = useState<Array<string>>([]);

    let appointmentDuration = 15;
    let appointmentType = "Quick Appointment";

    useEffect(() => {
        getPatientAppointments();
        getBookableTimes();
    }, []);

    useEffect(() => {
        deriviveAppointmentSlots();
    }, [providerTime, appointmentKeys]);

    function getPatientAppointments() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('http://localhost:8080/get-patient-appointments', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: props.user.email,
                })
            })
            let appointmentsResponse = await rawResponse.json();
            //console.log(appointmentsResponse);
            setAppointments(appointmentsResponse);
        })
    }

    function getProviderTime() {
        return new Promise(async (resolve, reject) => {
            const rawResponseProvTime = await fetch('http://localhost:8080/get-all-provider-times', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            let provTimeResponse = await rawResponseProvTime.json();
            setProviderTime(provTimeResponse);
        })
    }

    function getAppointmentKeys() {
        return new Promise(async (resolve, reject) => {
            const rawResponseAppt = await fetch('http://localhost:8080/get-all-booked-times', {
                headers: {
                    'Accept': 'application/json'
                }
            });

            let appointmentsResponse = await rawResponseAppt.json();
            setAppointmentKeys(appointmentsResponse)
        })
    }

    function deriviveAppointmentSlots() {
        //console.log("Deriving", providerTime, appointmentKeys)
        let newAppointmentSlots: Array<AppointmentSlot> = [];
        let minStartTime = dayjs().add(1, "hour").toDate();

        providerTime.forEach((provTime: ProviderTime) => {
            let startTime = new Date(provTime.startTime);
            let endTime = new Date(provTime.endTime);
            let providerUserId = provTime.userId;
            let currTime = startTime;
            while (currTime.valueOf() < endTime.valueOf()) {
                if (currTime > minStartTime) {
                    let quickKey = `${providerUserId}_${currTime.valueOf()}`;
                    if (!appointmentKeys.includes(quickKey)) {
                        newAppointmentSlots.push({
                            providerUserId: providerUserId,
                            startTime: currTime,
                            duration: appointmentDuration,
                            appointmentType: appointmentType
                        });
                    }
                }

                currTime = new Date(currTime.valueOf() + (appointmentDuration * 60000))
            }
        });
        //console.log(appointmentSlots);
        setAppointmentSlots(newAppointmentSlots)
    }

    function getBookableTimes() {
        getProviderTime();
        getAppointmentKeys();
    }

    return (
        <>
            <Header user={props.user}></Header>
            <div className="patient-app" style={{
                display: "flex",
                justifyContent: "space-evenly"
            }}>
                <div className="patient_app_section">
                    <h2 className="patient_app_section_title">Your Appointments</h2>
                    {appointments.map((appt) => {
                        return <PatientAppointment
                            key={`${appt.id}`}
                            appointmentId={appt.id}
                            appointmentType={appt.appointmentType}
                            providerUserId={appt.providerUserId}
                            duration={appt.duration}
                            startTime={appt.startTime}
                            mustConfirmBy={appt.mustConfirmBy}
                            user={props.user}
                            onChange={() => { getPatientAppointments() }}
                        />
                    })}
                </div>
                <div className="patient_app_section">
                    <h2 className="patient_app_section_title">Schedule An Appointment</h2>
                    <div className="patient_app_section_inner">
                        {appointmentSlots.map((appointmentSlot) => {
                            return <PatientAppointmentSlot
                                key={`${appointmentSlot.providerUserId}_${appointmentSlot.startTime.valueOf()}`}
                                providerUserId={appointmentSlot.providerUserId}
                                appointmentType={appointmentSlot.appointmentType}
                                startTime={appointmentSlot.startTime}
                                duration={appointmentSlot.duration}
                                user={props.user}
                                onChange={() => {
                                    getPatientAppointments()
                                    getBookableTimes()
                                }}
                            />
                        })}
                    </div>

                </div>
            </div>
        </>
    );
}

export default PatientApp;
