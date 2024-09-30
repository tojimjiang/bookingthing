import React, { useState, useEffect } from 'react';

import './Header.css';
import { Button } from '@mui/material';
import { HeaderProps } from '../interfaces/HeaderProps';
import { User } from '../interfaces/User';

export default function Header(props: HeaderProps) {
    const [user, setUser] = useState<User>(props?.user || {
        email: ""
    })

    useEffect(() => {
        if (props.user) {
            setUser(props.user)
        }
    }, [props.user])

    return (
        <div className={(user.role || "register") + "Header"}>
            <h3>bookingthing</h3>
            {/* tz data */}
            {/* profile data */}
            {user.id ?
                <Button variant="text"
                    onClick={() => {
                        if (props.logout) {
                            props.logout()

                            // TODO SHOW Tz
                        }
                    }}
                >Logout
                </Button> : ""}
        </div>
    );
}

