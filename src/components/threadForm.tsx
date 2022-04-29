import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, Typography } from "@material-ui/core"
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator"
import { MediaContext } from "../contexts/mediaContext";
import { useUsers, useChats } from "../hooks/apiHooks";
import useForm from "../hooks/formHooks";

interface propTypes {
    websocket: WebSocket,
    setModalOpen: Function,
    setThreadOpen: Function,
    setThreadId: Function,
}

interface usersArrayType {
    id: number,
    username: string,
}

const useStyles = makeStyles((theme) => ({
    select: {
        minWidth: '5rem',
    },
    formControl: {
        marginTop: '0.5rem',
    },
    header: {
        textAlign: 'center',
        [theme.breakpoints.down(600)]: {
            fontSize: '1.3rem',
        },
    },
    createButton: {
        backgroundColor: '#5F4B8BFF',
        marginTop: '2rem',
        marginBottom: '0.5rem',
        '&:hover': {
            backgroundColor: '#7159a6',
        },
    }
}));

const ThreadForm = ({ websocket, setModalOpen, setThreadOpen, setThreadId }: propTypes) => {
    const classes = useStyles();
    const { user } = useContext(MediaContext);
    const { createNewChatThread, createNewChatting } = useChats();
    const { getUsers } = useUsers();
    const [usersArray, setUsersArray] = useState<usersArrayType[]>([]);
    const [newThreadId, setNewThreadId] = useState('0');

    const validators = {
        threadName: ['required', 'minStringLength: 3', 'maxStringLength: 25'],
    };

    const errorMessages = {
        threadName: [
            'Required field',
            'Minimum of 3 characters',
            'Too many characters!',
        ]
    };

    const createNewThread = async () => {
        try {
            if (inputs.user2.length !== 0) {
                const token = localStorage.getItem('token');
                const success = await createNewChatThread(inputs.threadName, inputs.private, token!);
                console.log('SUCCESS: ', success.message);
                if (success.message === 'Success') {
                    let count = 0;
                    for(let i = 0; i < inputs.user2.length; i++) {
                        console.log('Params', success.data.id, inputs.user2[i]);
                        const joinThread = await createNewChatting(success.data.id, inputs.user2[i], token!);
                        if (joinThread.message === 'Success') {
                            count++
                        }
                    }
                    if (count === inputs.user2.length) {
                        setNewThreadId(success.data.id);
                    } else {
                        alert('Something went wrong');
                    }
                }
            } else {
                alert('Choose a user with whom you want to chat!');
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    const { inputs, handleInputChange, handleSubmit } = useForm(createNewThread, {
        threadName: '',
        user2: [],
        private: true,
    });

    useEffect(() => {
        try {
            if (newThreadId !== '0') {
                console.log('NEWTHREADID', newThreadId);
                const webSocketUpdate = {
                    type: 'newThread',
                    user_id: user,
                    user2: inputs.user2,
                    thread: {
                        id: newThreadId,
                        name: inputs.threadName
                    }
                }
                if (websocket !== undefined) {
                    websocket.send(JSON.stringify(webSocketUpdate));
                    setThreadOpen(true);
                    setThreadId(newThreadId);
                    setModalOpen(false);
                }
            }
        } catch (e) {
            console.log(e.message);
        }
    }, [newThreadId]);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                const users = await getUsers(token!);
                let arrayForUsers = [];
                for (let i = 0; i < users.data.length; i++) {
                    if (users.data[i].id !== user) {
                        arrayForUsers.push(users.data[i]);
                    }
                }
                setUsersArray(arrayForUsers);
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    return (
        <>
            <Grid container justifyContent="center" direction="column">
                <Typography variant="h4" className={classes.header}>Create a new chat thread</Typography>
                <ValidatorForm onSubmit={handleSubmit}>
                    <Grid container item justifyContent="center">
                        <TextValidator
                            type="text"
                            name="threadName"
                            label="Thread name"
                            onChange={handleInputChange}
                            value={inputs.threadName}
                            validators={validators.threadName}
                            errorMessages={errorMessages.threadName}
                        />
                    </Grid>
                    <Grid container item justifyContent="center">
                        <FormControl className={classes.formControl}>
                            <InputLabel>User</InputLabel>
                            <Select
                                name="user2"
                                value={inputs.user2}
                                label="User"
                                onChange={handleInputChange}
                                autoWidth
                                multiple
                                className={classes.select}
                            >
                                {usersArray.map((item) => (
                                    <MenuItem value={item.id}>{item.username}</MenuItem>
                                ))}{' '}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container item justifyContent="center">
                        <FormControl className={classes.formControl}>
                            <InputLabel>Private</InputLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="private"
                                value={inputs.private}
                                onChange={handleInputChange}
                            >
                                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                <FormControlLabel value={false} control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid container item justifyContent="center">
                        <Button
                            className={classes.createButton}
                            color="primary"
                            type="submit"
                            variant="contained"
                        >
                            Create
                        </Button>
                    </Grid>
                </ValidatorForm>
            </Grid>
        </>
    )
}

export default ThreadForm;