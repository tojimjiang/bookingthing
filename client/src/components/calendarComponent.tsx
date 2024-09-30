import React from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Events } from '../interfaces/Events';

const localizer = dayjsLocalizer(dayjs)

function CalendarComponent(props: { events: Events[]; onNavigate: Function }) {
    return (
        <div className="Calendar">
            <Calendar
                localizer={localizer}
                events={props.events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                defaultView={"day"}
                views={['day']}
                defaultDate={dayjs(new Date).startOf("day").toDate()}
                onNavigate={(newDate) => {
                    props.onNavigate(newDate)
                }}
                onSelectEvent={(event: { title: string; start: Date }) => {
                    window.alert(`${event.title} at ${event.start}`)
                }}
                eventPropGetter={
                    (event, start, end, isSelected) => {
                        let appliedStyle = {
                        }
                        if (event.title === "Working Hours") {
                            appliedStyle = {
                                backgroundColor: "rgba(40, 44, 52, 0.33)",
                                color: "#ffffff"
                            }
                        }
                        return {
                            className: "",
                            style: appliedStyle
                        };
                    }}
            />
        </div>
    );
}

export default CalendarComponent;
