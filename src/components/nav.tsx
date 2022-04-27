/* eslint-disable react-hooks/exhaustive-deps */
import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    makeStyles,
    Toolbar,
    Link,
    Button,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useUsers } from '../hooks/apiHooks';
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { MediaContext } from '../contexts/mediaContext';

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#5F4B8BFF',
        width: '100vw',
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        paddingRight: '24px',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    itemPack: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        left: '71px',
        transform: 'translate(-50%)',
    },
}));

const Nav = () => {
    const classes = useStyles();
    const [logged, setLogged] = useState(false);
    const { user, setUser } = useContext(MediaContext);
    const { getLoggedInUser } = useUsers();

    useEffect(() => {
        (async () => {
            try {
                console.log('NAV');
                const token = localStorage.getItem('token');
                token === null ? setLogged(false) : setLogged(true);
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [user]);

    return (
        <>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Link
                        component={RouterLink}
                        to="/"
                        className={classes.logo}
                        color="inherit"
                        style={{ textDecoration: 'none' }}
                    >
                        <h2>ChatApp</h2>
                    </Link>
                    <div className={classes.itemPack}>
                        {logged ? (
                            <div>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/logout"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button
                                color="inherit"
                                startIcon={<ExitToAppIcon />}
                                component={RouterLink}
                                to="/login"
                            >
                                Login
                            </Button>
                        )}

                    </div>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Nav;