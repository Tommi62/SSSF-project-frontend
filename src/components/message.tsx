import { Grid, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { MediaContext } from '../contexts/mediaContext';
import moment from 'moment';

interface userObject {
    id: string,
    username: string,
}

interface threadObject {
    id: string,
    name: string
}

interface messagesArray {
    id: string,
    contents: string,
    timestamp: string,
    status: string,
    thread: threadObject,
    user: userObject
}

interface propType {
    message_id: string,
    user_id: string,
    contents: string,
    timestamp: string,
    setMessageId: Function,
    username: string,
    index: number,
    messageArray: messagesArray[],
}

const useStyles = makeStyles((theme) => ({
    message: {
        backgroundColor: 'lightGrey',
        marginBottom: 0,
        borderRadius: '1rem',
        padding: '0.5rem',
        maxWidth: '60%',
        [theme.breakpoints.down(1000)]: {
            maxWidth: '75%',
        },
        [theme.breakpoints.down(1000)]: {
            maxWidth: '85%',
        },
    },
    ownMessage: {
        backgroundColor: '#5F4B8BFF',
        color: 'white',
        marginBottom: 0,
        borderRadius: '1rem',
        padding: '0.5rem',
        maxWidth: '60%',
        [theme.breakpoints.down(1000)]: {
            maxWidth: '75%',
        },
        [theme.breakpoints.down(600)]: {
            maxWidth: '85%',
        },
    },
    inline: {
        display: 'inline',
    },
    inlineOwn: {
        display: 'inline',
        color: 'white',
    },
    timestamp: {
        fontSize: '0.7rem',
        marginLeft: '2rem'
    },
    dateIndicator: {
        background: 'rgb(95, 75, 139, .2)',
        borderRadius: '0.3rem',
        padding: '0.2rem',
        marginBottom: '0.5rem',
        textAlign: 'center',
    }
}));

const Message = ({ message_id, user_id, contents, timestamp, setMessageId, username, index, messageArray }: propType) => {
    const classes = useStyles();
    const [time, setTime] = useState('');
    const [ownMessage, setOwnMessage] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const { user } = useContext(MediaContext);
    const formattedTimestamp = moment(timestamp).format('DD.MM.YYYY');

    useEffect(() => {
        try {
            if (index !== 0) {
                const formattedPreviousTimestamp = moment(messageArray[index - 1].timestamp).format('DD.MM.YYYY');
                if (formattedTimestamp !== formattedPreviousTimestamp) {
                    setShowDate(true);
                }
            } else {
                setShowDate(true);
            }

            const d = new Date(timestamp);
            let hours = d.getHours().toString();
            let minutes = d.getMinutes().toString();
            if (d.getHours() < 10) {
                hours = '0' + hours;
            }
            if (d.getMinutes() < 10) {
                minutes = '0' + minutes;
            }
            const formatedTime = hours + '.' + minutes;
            setTime(formatedTime);

            if (user_id === user) {
                setOwnMessage(true)
            } else {
                setOwnMessage(false);
            }
            setMessageId(message_id);
        } catch (e) {
            console.log(e.message);
        }
    }, [message_id]);


    return (
        <>
            <ListItem style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                {showDate &&
                    <Grid container justifyContent="center" >
                        <Typography className={classes.dateIndicator} component="h6" variant="body1">{formattedTimestamp}</Typography>
                    </Grid>
                }
                {ownMessage ? (
                    <Grid container justifyContent="flex-end" >
                        <Grid item className={classes.ownMessage}>
                            <ListItemText
                                primary={
                                    <>
                                        <Grid container justifyContent="space-between">
                                            <Typography
                                                component="h2"
                                            >
                                                {username}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                variant="subtitle1"
                                                className={classes.timestamp}
                                            >
                                                {time}
                                            </Typography>
                                        </Grid>
                                    </>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inlineOwn}
                                        >
                                            {contents}
                                        </Typography>
                                    </>
                                }
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container justifyContent="flex-start" >
                        <Grid item className={classes.message}>
                            <ListItemText
                                primary={
                                    <>
                                        <Grid container justifyContent="space-between">
                                            <Typography
                                                component="h2"
                                            >
                                                {username}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                variant="subtitle1"
                                                className={classes.timestamp}
                                            >
                                                {time}
                                            </Typography>
                                        </Grid>
                                    </>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {contents}
                                        </Typography>
                                    </>
                                }
                            />
                        </Grid>
                    </Grid>
                )
                }

            </ListItem >
        </>
    )
}

export default Message;