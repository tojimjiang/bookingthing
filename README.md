# bookingthing

## Get this running NOW
1. Go to the server folder `cd server`
2. Install dependencies `npm install`
3. Run it NOW! `npm run dev`

### Patient entrypoint
- http://localhost:8080

### Provider entrypoint
- http://localhost:8080/prov-register

## What does this do
- Super basic provider/patient registation (with very basic TZ support for now) - using email as a userId for now.
    - TZ Support discussed much more later
- Providers can submit working hours and see their working time on a calendar and their appointments on deck
    - Provider time should start and end on the same day
- Patients can see a list of available up coming appointments.
- Patients can book an appointment, then see when they need to confirm an appointment by.
- Patient data is automatically sent with the appointment since they are auth'ed.

## Limits
- User/session system is very naive. App for now just writes all 
- Patients need to schedule their appointments.
    - If we want providers to be able to schedule FOR patients, then TZ support needs to be further built out.
- TZ assumes all servers are constant timezone, it works for a local machine, but a real API should be casting everything to unix timestamps and actually apply TZ transforms when booking for others.
- Patient/Provider pages can be more responsive with polling or websockets (not implemented)
- Basic API is very basic and very insecure and absolutely not scaleable.
    - For example all data is in mem on an express server.
    - Scheduling API is very not smart when it comes to scheduling.
- Very basic logic on the front end to handle already booked times and to create time slots from provider hours.
- No support for provider hours overnight
- Appointments have rigid starttimes (every 15 minutes)
- Only one appointment type
- Missed to wrapping this up
    - Could benefit from more error handling on the schedule path.
- no provider license logic

## Choices
- email for userId - would assume a real API would use some actual user management system
- express server and memory db - basic somewhat realistic "server"
- front end appointment slots - was in that file in the zone
- mui/components/react-big-calender/dayjs - use tooling that already exists
- some css files - in some cases for agility for layout, quicker to just use flexbox
- tz support - want to lay the ground work for this, but this would need a patients api and more provider safeguards to protect userdata
    - daylight savings time since we live in the US and want to be national

