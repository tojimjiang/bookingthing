import { resolve } from "path";
import { USERS } from "./users";

export const PROVIDER_HOURS = {};
// Super basic in memory store

export function checkProviderTime(body: { userId: string; startTime: Date; endTime: Date }) {
    let errors = [];
    let user = USERS[body.userId];
    //console.log(body, USERS);
    if (user?.role !== "provider") {
        errors.push("User not found");
        return errors;
    }
    // We are naive and assume all time slots are unique (non overlapping) to be added. Otherwise here the should be logic to coalesce
    // for (let i = 0; i < existingProviderHours.length; i++) {
    // }
    return [];
}

export function insertProviderTimeRecord(userId: string, startTime: Date, endTime: Date) {
    let existingProviderHours : Array<any>= PROVIDER_HOURS[userId] || [];
    let startTimestamp = startTime.valueOf();
    let endTimestamp = endTime.valueOf();
    let newTimeSlot = {
        startTime: startTimestamp,
        endTime: endTimestamp,
        userId: userId
    }

    // Super basic naive backend
    existingProviderHours.push(newTimeSlot);
    existingProviderHours.sort((a: { startTime: number; },b: { startTime: number; }) => {
        return a.startTime - b.startTime
    });

    //console.log(existingProviderHours);
    PROVIDER_HOURS[userId] = existingProviderHours;

    return newTimeSlot;
}

export function getProviderTime(userId: string) {
    let user = USERS[userId];
    if (user?.role !== "provider") {
        return false;
    }
    let existingProviderHours: Array<any> = PROVIDER_HOURS[userId] || [];
    return existingProviderHours;
}

export function getAllProviderTime() {
    let returnArray = [];
    Object.values(PROVIDER_HOURS).forEach((subArray: Array<any>) => {
        returnArray.push(...subArray)
    })
    return returnArray;
}