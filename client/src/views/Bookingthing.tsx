import React, { useState, useEffect } from 'react';
import './App.css';

import { User } from '../interfaces/User';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";

import PatientApp from './PatientApp';
import ProviderApp from './ProviderApp';

function Bookingthing(props: { user: User }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>(props.user);

    useEffect(() => {

        //console.log(JSON.stringify(user));
        if (user.email.length < 1) {
            navigate("/");
        }
    }, [user])


    return (
        <>
            {user.role === "patient" ? <PatientApp user={user} /> : ""}
            {user.role === "provider" ? <ProviderApp user={user} /> : ""}
        </>
    );
}

export default Bookingthing;
