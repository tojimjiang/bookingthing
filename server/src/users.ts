export const USERS = {};

//console.log(USERS);

export function check(body: { name: { first: string; last: string; }; email: string; timezone: string; mode: string; }) {
    let errors = [];
    if (!body.name?.first || body.name.first.length < 1) {
        errors.push("No first name");
    }
    if (!body.name?.last || body.name.last.length < 1) {
        errors.push("No last name");
    }
    if (!body.email || body.email.length < 1) {
        errors.push("No email");
    } else if (!/.+@.+\..+/.test(body.email)) {
        errors.push("Invalid email address");
    }
    if (!body.timezone) {
        errors.push("No timezone");
    }
    if (!body.mode) {
        errors.push("API error");
    }
    return errors;
}

export function register(body: { name: { first: string; last: string; }; email: string; timezone: string; mode: string; }) {
    let user: { name: { first: string; last: string; }; email: string; timezone: string; role: string; };
    if (USERS[body.email]) {
        user = USERS[body.email];
        if (user.role === body.mode && user.name.first === body.name.first && user.name.last === body.name.last) {
            return user;
        }
    } else {
        user = {
            name: body.name,
            email: body.email,
            timezone: body.timezone,
            role: body.mode
        };
        USERS[body.email] = user;
        //console.log(USERS);
        return user;
    }
    return null;
}