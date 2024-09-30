import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./Register.css";

import {
    Alert,
    Button,
    FormControl,
    TextField
} from '@mui/material';
import { getSystemTimezone } from '../components/shared_functions';
import Timezone from '../components/timezone';

import { Name } from '../interfaces/Name';
import { User } from '../interfaces/User';

import Header from '../components/Header';

function Register(props: { mode?: string; user?: User, setUser: Function }) {
    const navigate = useNavigate();

    let [mode, setMode] = useState<string>(props.mode || "patient");
    let [name, setName] = useState<Name>({ first: "", last: "" })
    let [email, setEmail] = useState<string>("");
    let [timezone, setTimezone] = useState<string>(getSystemTimezone());
    let [errors, setErrors] = useState<Array<string>>([]);

    useEffect(() => {
        //console.log(props.user)
        if (Boolean(props.user?.role)) {
            //console.log("Nav")
            navigate("/bookingthing")
        }
    }, [props.user])

    async function registerAPI() {
        setErrors([]);
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('http://localhost:8080/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    timezone: timezone,
                    mode: mode
                })
            })
            let content = await rawResponse.json();
            //console.log(content);
            if (content.errors?.length) {
                setErrors(content.errors)
            } else {
                if (content.user) {
                    props.setUser(content.user);
                }
            }
        })
    }

    return (
        <>
            <Header />
            <div className="register-wrapper">
                <h2>
                    Join us as a {mode}!
                </h2>
                <FormControl>
                    <TextField label="First Name" variant="outlined" value={name.first} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setName({ ...name, first: event.target.value });
                    }} fullWidth sx={{ m: 1 }} />
                    <TextField label="Last Name" variant="outlined" value={name.last} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setName({ ...name, last: event.target.value });
                    }} fullWidth sx={{ m: 1 }} />
                    <TextField label="Email" variant="outlined" value={email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setEmail(event.target.value);
                    }} fullWidth sx={{ m: 1 }} />
                    <Timezone timezone={timezone} setTimezone={setTimezone} />
                    {errors.length !== 0 ? <Alert severity='error'>
                        You have errors!
                        {errors.map((err, index) => {
                            return <p key={"err_" + index}>{err}</p>
                        })}
                    </Alert> : ""}
                    <Button variant="contained" onClick={async () => {
                        await registerAPI();
                    }} fullWidth sx={{ m: 1 }}>
                        LETS GO
                    </Button>
                </FormControl>
            </div>

        </>
    );
}

export default Register;
