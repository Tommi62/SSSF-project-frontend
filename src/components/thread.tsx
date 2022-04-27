import { Button, Grid, List, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { MediaContext } from '../contexts/mediaContext';
import { useChats } from '../hooks/apiHooks';
import Message from '../components/message';
import useWindowDimensions from '../hooks/windowDimensionsHook';
import { useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '70%',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        [theme.breakpoints.down(600)]: {
            marginTop: '0.27rem'
        },
    },
    sendButton: {
        marginTop: '0.25rem',
        padding: '12px 0 12px 12px',
        [theme.breakpoints.down(600)]: {
            marginTop: 0
        },
    },
    thread: {
        padding: '0 6rem',
        backgroundColor: '#E69A8DFF',
        height: '90%',
        overflowX: 'hidden',
        overflowY: 'auto',
        [theme.breakpoints.down(1000)]: {
            padding: '0 1rem',
        },
    },
    arrowBack: {
        position: 'absolute',
        top: '58px',
        left: 0,
        zIndex: 10,
        padding: 0,
    }
}));

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
    user: userObject,
}

interface propType {
    messages: messagesArray[],
    id: string,
    websocket: WebSocket | undefined,
    messageAmount: number,
    setMessageAmount: Function,
    setThreadOpen: Function,
    setThreadId: Function,
}



const Thread = ({ messages, id, websocket, messageAmount, setMessageAmount, setThreadOpen, setThreadId }: propType) => {
    const classes = useStyles();
    const [message, setMessage] = useState('');
    const [messageId, setMessageId] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [moreMessages, setMoreMessages] = useState<messagesArray[]>([])
    const [loadMore, setLoadMore] = useState(false);
    const [messageScroll, setMessageScroll] = useState(false);
    const [currentThread, setCurrentThread] = useState('0');
    const { user } = useContext(MediaContext);
    const { postMessage, getMessages } = useChats();
    const { height } = useWindowDimensions();
    const [heightCorrected, setHeightCorrected] = useState(height - 64);
    const messagesEndRef = useRef<null | HTMLDivElement>(null)
    const messagesEndRef2 = useRef<null | HTMLDivElement>(null)

    const isMobile = useMediaQuery({
        query: '(max-width: 600px)'
    });

    useEffect(() => {
        try {
            if (isMobile) {
                setHeightCorrected(height - 56);
            } else {
                setHeightCorrected(height - 64);
            }
        } catch (e) {
            console.log(e.message);
        }
    }, [isMobile]);

    const scrollToBottom = (number: number) => {
        if (number === 1) {
            messagesEndRef.current?.scrollIntoView()
        } else {
            messagesEndRef2.current?.scrollIntoView()
            setMessageScroll(true);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                if (loadMore && !messageScroll) {
                    scrollToBottom(2);
                } else {
                    scrollToBottom(1);
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [messageId]);

    useEffect(() => {
        (async () => {
            try {
                if (currentThread !== id) {
                    setLoadMore(false);
                    setMessageScroll(false);
                    setMessageAmount(50);
                }
                setCurrentThread(id);
                console.log('messageUpdate')
                if (messages.length >= 50 && !loadMore) {
                    setShowButton(true);
                } else {
                    setShowButton(false);
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [messages]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            if (message !== '') {
                const tzoffset = (new Date()).getTimezoneOffset() * 60000;
                const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
                console.log('TIMEST: ', localISOTime)
                const messageObject = JSON.stringify({
                    contents: message,
                    timestamp: localISOTime,
                    user_id: user,
                    thread_id: id,

                });
                const success = await postMessage(messageObject)
                console.log('SUCCESS: ', success)
                const webSocketUpdate = {
                    type: 'message',
                    contents: message,
                    timestamp: localISOTime,
                    user_id: user,
                    thread_id: id
                }
                if (websocket !== undefined) {
                    websocket.send(JSON.stringify(webSocketUpdate));
                }
                setMessage('');
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const loadAllMessages = async () => {
        try {
            let amount;
            if (currentThread !== id) {
                setMessageAmount(50);
                amount = 50;
            } else {
                amount = messageAmount;
            }
            const token = localStorage.getItem('token');
            const allMessages = await getMessages(id, 0, token!);
            const messagesToSplice = allMessages.data;
            console.log('MESSAGE AMOUNT', messageAmount, messagesToSplice);
            messagesToSplice.splice(messagesToSplice.length - amount, amount);
            setMoreMessages(messagesToSplice);
            setLoadMore(true);
            setShowButton(false);
        } catch (e) {
            console.log(e.message);
        }
    };

    const closeThread = () => {
        try {
            setThreadOpen(false);
            setThreadId(0);
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <>
            {isMobile &&
                <Button className={classes.arrowBack} onClick={closeThread}>
                    <ArrowBackIcon /> Back
                </Button>
            }
            <Grid container justifyContent="center" direction="column" style={{ height: heightCorrected }}>
                <Grid item justifyContent="center" className={classes.thread}>
                    {loadMore &&
                        <List>
                            {moreMessages.map((item, index) => (
                                <Message
                                    message_id={item.id}
                                    user_id={item.user.id}
                                    contents={item.contents}
                                    timestamp={item.timestamp}
                                    setMessageId={setMessageId}
                                    username={item.user.username}
                                    index={index}
                                    messageArray={moreMessages}
                                />
                            ))}{' '}
                            <div ref={messagesEndRef2} />
                        </List>
                    }
                    {showButton &&
                        <Button onClick={loadAllMessages}>Load all messages</Button>
                    }
                    <List>
                        {messages.map((item, index) => (
                            <Message
                                message_id={item.id}
                                user_id={item.user.id}
                                contents={item.contents}
                                timestamp={item.timestamp}
                                setMessageId={setMessageId}
                                username={item.user.username}
                                index={index}
                                messageArray={messages}
                            />
                        ))}{' '}
                        <div ref={messagesEndRef} />
                    </List>
                </Grid>
                <Grid item container justifyContent="center" direction="column" style={{ height: '10%', backgroundColor: 'lightgray' }}>
                    <Grid item>
                        <form
                            onSubmit={handleSubmit}
                        >
                            {isMobile ? (
                                <TextField
                                    value={message}
                                    variant="outlined"
                                    label="Say something!"
                                    onInput={(event) => setMessage((event.target as HTMLInputElement).value)}
                                    className={classes.textField}
                                    size="small"
                                />
                            ) : (
                                <TextField
                                    value={message}
                                    variant="outlined"
                                    label="Say something!"
                                    onInput={(event) => setMessage((event.target as HTMLInputElement).value)}
                                    className={classes.textField}
                                />
                            )}
                            <IconButton
                                type="submit"
                                color="default"
                                className={classes.sendButton}
                            >
                                <SendIcon style={{ fill: '#5F4B8BFF' }} />
                            </IconButton>

                        </form>
                    </Grid>
                </Grid>

            </Grid>

        </>
    )
}

export default Thread;