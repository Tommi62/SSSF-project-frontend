/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid, ListItem, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { useChats } from '../hooks/apiHooks';
import moment from 'moment';

interface updateThreadObject {
    id: string,
    update: number
}

interface propType {
    id: string,
    threadName: string,
    setThreadOpen: Function,
    setThreadId: Function,
    threadOpen: Boolean,
    threadId: string,
    updateThreadButtonInfos: number,
    threadToUpdate: updateThreadObject,
}

interface lastMessageObject {
    username: string,
    contents: string,
    timestamp: any,
}

const useStyles = makeStyles((theme) => ({
    text: {
        color: 'white',
        width: '100%',
        padding: '1rem',
    },
    inline: {
        display: 'inline',
    },
    lastMessage: {
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '0.7rem'
    },
    timestamp: {
        fontSize: '0.5rem',
        marginLeft: '2rem'
    },
    button: {
        width: '100%',
        maxWidth: '30vw',
        padding: '0 0.7rem',
        borderBottom: '1px solid #5F4B8BFF',
        cursor: 'pointer',
        '&:hover': {
            background: "#f0f0f0",
        },
        [theme.breakpoints.down(600)]: {
            maxWidth: 'none',
            width: '100vw',
        },
    }
}));

const ThreadButton = ({ id, threadName, setThreadOpen, setThreadId, threadOpen, threadId, updateThreadButtonInfos, threadToUpdate}: propType) => {
    const { getLastMessage } = useChats();
    const [lastMessage, setLastMessage] = useState<lastMessageObject>({
        username: '',
        contents: '',
        timestamp: ''
    });
    const classes = useStyles();

    useEffect(() => {
        (async () => {
            try { 
                if(threadToUpdate.id === '0' || threadToUpdate.id == id) {
                    const token = localStorage.getItem('token');
                    if (token !== null) {
                        const lastMessageData = await getLastMessage(id, token!)
                        if (lastMessageData.data.length !== 0) {
                            const now = moment().startOf('day')
                            const formatedDate = moment(lastMessageData.data[0].timestamp).startOf('day');
                            const difference = now.diff(formatedDate, 'days');
                            let formatedTime;
                            if (difference === 0) {
                                const d = new Date(lastMessageData.data[0].timestamp);
                                let hours = d.getHours().toString();
                                let minutes = d.getMinutes().toString();
                                if (d.getHours() < 10) {
                                    hours = '0' + hours;
                                }
                                if (d.getMinutes() < 10) {
                                    minutes = '0' + minutes;
                                }
                                formatedTime = hours + '.' + minutes;
                            } else if (difference === 1) {
                                formatedTime = 'Yesterday';
                            } else {
                                formatedTime = moment(lastMessageData.data[0].timestamp).format('DD.MM.YYYY');
                            }

                            const lastMessageObject = {
                                username: lastMessageData.data[0].user.username + ':',
                                contents: lastMessageData.data[0].contents,
                                timestamp: formatedTime,
                            }
                            setLastMessage(lastMessageObject);
                        } else {
                            const noLastMessageObject = {
                                username: 'No messages yet.',
                                contents: '',
                                timestamp: '',
                            }
                            setLastMessage(noLastMessageObject);
                        }
                    }
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [threadToUpdate]);

    const openThread = () => {
        try {
            if (!threadOpen) {
                setThreadOpen(true)
                setThreadId(id)
            } else {
                if (threadId === id) {
                    setThreadOpen(false)
                    setThreadId('0')
                } else {
                    setThreadId(id)
                }
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <>
            <ListItem onClick={openThread} className={classes.button} >
                <ListItemText
                    primary={
                        <>
                            <Grid container justifyContent="space-between">
                                <Typography
                                    component="h1"
                                >
                                    {threadName}
                                </Typography>
                                <Typography
                                    component="span"
                                    variant="subtitle1"
                                    className={classes.timestamp}
                                >
                                    {lastMessage.timestamp}
                                </Typography>
                            </Grid>
                        </>
                    }
                    secondary={
                        <>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.lastMessage}
                            >
                                {lastMessage.username} {lastMessage.contents}
                            </Typography>
                        </>
                    }
                />
            </ListItem>
        </>
    )
}

export default ThreadButton