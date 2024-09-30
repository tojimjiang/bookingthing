// src/index.js
import express, { Express, NextFunction, Request, Response } from "express";
let cors = require('cors')
import path from "path";

import { USERS, check, register } from "./users";
import { checkProviderTime, getProviderTime, getAllProviderTime, insertProviderTimeRecord } from "./providers";
import { getPatientAppointments, getProviderAppointments, preScheduleAppointment, getAllBookedAppointmentTimes, finalizeScheduleAppointment } from "./appointments";


const app: Express = express();
const port: Number = Number(process.env.PORT) || 8080;

app.use(cors())
app.use(express.json());

app.post("/signup", (req: Request, res: Response) => {
    if (req?.body) {
        let errors = check(req.body);
        if (errors.length) {
            res.status(400);
            res.send({ errors: errors });
        } else {
            let user = register(req.body);
            if (user) {
                res.status(200);
                res.send({ user: user });
            } else {
                res.status(400);
                res.send({ errors: ["User not found."] });
            }
        }
    }
});

app.post("/new-provider-time", (req: Request, res: Response) => {
    if (req?.body) {
        let errors = checkProviderTime(req.body);
        if (errors.length) {
            res.status(400);
            res.send({ errors: errors });
        } else {
            let newProviderTime = insertProviderTimeRecord(req.body.userId, req.body.startTime, req.body.endTime);
            res.status(200);
            res.send({ providerTime: newProviderTime });
        }
    }
});

app.post("/get-provider-time", (req: Request, res: Response) => {
    if (req.body.userId) {
        let result = getProviderTime(req.body.userId);
        if (typeof result === "boolean") {
            res.status(400);
        }
        else {
            res.status(200);
            res.send(result);
        }
    }
    res.send();
});

app.get("/get-all-booked-times", (req: Request, res: Response) => {
    res.send(getAllBookedAppointmentTimes());
});

app.get("/get-all-provider-times", (req: Request, res: Response) => {
    res.send(getAllProviderTime());
});

app.post("/get-patient-appointments", (req: Request, res: Response) => {
    if (req.body.userId) {
        let result = getPatientAppointments(req.body.userId);
        if (typeof result === "boolean") {
            res.status(400);
        }
        else {
            res.status(200);
            res.send(result);
        }
    }
    res.send();
});

app.post("/get-provider-appointments", (req: Request, res: Response) => {
    if (req.body.userId) {
        let result = getProviderAppointments(req.body.userId);
        if (typeof result === "boolean") {
            res.status(400);
        }
        else {
            res.status(200);
            res.send(result);
        }
    }
    res.send();
});


app.post("/schedule-appointment", (req: Request, res: Response) => {
    if (req.body.userId) {
        let result = preScheduleAppointment(req.body.startTime, req.body.appointmentType, req.body.duration, req.body.userId, req.body.providerUserId);
        if (typeof result === "boolean") {
            res.status(400);
        }
        else {
            res.status(200);
            res.send(result);
        }
    }
    res.send();
});


app.post("/confirm-appointment", (req: Request, res: Response) => {
    if (req.body.userId) {
        let result = finalizeScheduleAppointment(req.body.id, req.body.userId);
        if (result === false) {
            res.status(400);
        }
        else {
            res.status(200);
            res.send(result);
        }
    }
    res.send();
});

app.use(express.static(path.join(__dirname, '../../client/build')));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.sendFile(path.join(__dirname, '../../client/build/index.html'));
    }
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});