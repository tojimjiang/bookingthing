import React, { useState, useEffect } from 'react';
import './App.css';

import { User } from '../interfaces/User';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";

import Register from './Register';
import Bookingthing from './Bookingthing';

function App() {
    const [user, setUser] = useState<User>({
        email: "",
    });
    const [synced, setSynced] = useState<boolean>(false)

    useEffect(() => {
        readUser();
    }, [])

    async function registerAPI(user: User) {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('http://localhost:8080/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    timezone: user.timezone,
                    mode: user.role
                })
            })
            let content = await rawResponse.json();
            if (content.user) {
                setSynced(true)
            }
        })
    }

    // Basic State Management (in practice this is SUPER DUPER unsafe - really this would be some soft of authtoken/jsessionId)
    function readUser() {
        let userInfoJSONString = localStorage.getItem("userInfo");
        if (userInfoJSONString) {
            let user = JSON.parse(userInfoJSONString);
            if (user.email.length > 1) {
                setUser(user);
                if (!synced) {
                    registerAPI(user);
                }
            }
        }
    }

    function updateUser(user: User) {
        setUser(user);
        localStorage.setItem("userInfo", JSON.stringify(user));
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Register user={user} setUser={updateUser} />} />
                <Route path="prov-register" element={<Register mode="provider" user={user} setUser={updateUser} />} />
                <Route path="bookingthing" element={<Bookingthing user={user} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
