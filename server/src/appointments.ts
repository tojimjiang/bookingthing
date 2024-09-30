export const APPOINTMENTS = {};

export const PENDING_APPOINTMENTS = {};

export function preScheduleAppointment(startTime: Date, appointmentType: string, duration: number, userId: string, providerUserId: string) {
    let now = new Date();
    let startTimeDate = new Date(startTime);
    let appointmentId = `${providerUserId}_${startTimeDate.valueOf()}`
    // TODO better LOGIC TO CHECK IF THE APPOINTMENT SLOT IS STILL AVAILABLE
    let collision = Object.values(APPOINTMENTS).find(
        (appointment: {
            id: string,
            patientUserId: string,
            providerUserId: string,
            startTime: Date,
            duration: number,
            appointmentType: string
        }) => {
            return appointment.startTime === startTime && (appointment.providerUserId === providerUserId || appointment.patientUserId === userId)
        });

    if (collision) {
        return false;
    } else {
        let appointment = {
            id: appointmentId,
            patientUserId: userId,
            providerUserId: providerUserId,
            startTime: startTime,
            duration: duration,
            appointmentType: appointmentType,
            mustConfirmBy: new Date(now.valueOf() + 60000 * 30)
        }
        PENDING_APPOINTMENTS[appointmentId] = appointment;
        return appointment;
    }
}

export function finalizeScheduleAppointment(id: string, userId: string) {
    let pending = PENDING_APPOINTMENTS[id];
    let nowTs = (new Date()).valueOf();
    let mustConfirmByDate = (new Date(pending.mustConfirmBy));
    if (pending && mustConfirmByDate.valueOf() > nowTs) {
        // Can finalize
        if (pending.patientUserId === userId) {
            delete pending.mustConfirmBy;
            APPOINTMENTS[pending.id] = pending;
            delete PENDING_APPOINTMENTS[id]
            return true;
        }
        else {
            return false;
        }
    } else {
        // Delete and cancel
        delete PENDING_APPOINTMENTS[id]
        return false;
    }
}

export function getProviderAppointments(userId: string) {
    let allConfirmedAppointments = Object.values(APPOINTMENTS).filter(
        (appointment: {
            id: string,
            patientUserId: string,
            providerUserId: string,
            startTime: Date,
            duration: number,
            appointmentType: string
        }) => {
            return appointment.providerUserId === userId
        });
    return allConfirmedAppointments;
}

export function getPatientAppointments(userId: string) {
    let allConfirmedAppointments = Object.values(APPOINTMENTS).filter(
        (appointment: {
            id: string,
            patientUserId: string,
            providerUserId: string,
            startTime: Date,
            duration: number,
            appointmentType: string
        }) => {
            return appointment.patientUserId === userId
        });
    let allPendingAppointments = Object.values(PENDING_APPOINTMENTS).filter(
        (appointment: {
            id: string,
            patientUserId: string,
            providerUserId: string,
            startTime: Date,
            duration: number,
            appointmentType: string
        }) => {
            return appointment.patientUserId === userId
        });
    return allConfirmedAppointments.concat(allPendingAppointments);
}

export function getAllBookedAppointmentTimes() {
    // Basic API
    let confirmedAppointments = Object.keys(APPOINTMENTS);
    let pendingAppointments = Object.keys(PENDING_APPOINTMENTS);
    let list = [].concat(confirmedAppointments, pendingAppointments);
    return list;
}
