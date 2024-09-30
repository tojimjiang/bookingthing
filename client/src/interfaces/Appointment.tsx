export interface Appointment {
    mustConfirmBy?: Date;
    id: string,
    patientUserId: string,
    providerUserId: string,
    startTime: Date,
    duration: number,
    appointmentType: string
}