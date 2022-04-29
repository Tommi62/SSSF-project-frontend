/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid, List, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import Thread from '../components/thread';
import ThreadButton from '../components/threadButton';
import Modal from '../components/modal';
import { MediaContext } from '../contexts/mediaContext';
import { WebsocketContext } from '../contexts/websocketContext';
import { useUsers, useChats } from '../hooks/apiHooks';
import useWindowDimensions from '../hooks/windowDimensionsHook';
import { useMediaQuery } from 'react-responsive';
import { makeStyles } from "@material-ui/core/styles";
import { Card } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    newThreadButton: {
        backgroundColor: '#5F4B8BFF',
        marginTop: '1rem',
        '&:hover': {
            backgroundColor: '#7159a6',
        },
        [theme.breakpoints.down(1000)]: {
            fontSize: '0.8rem',
            padding: '6px 10px'
        },
        [theme.breakpoints.down(800)]: {
            fontSize: '0.7rem',
            padding: '6px 6px'
        },
        [theme.breakpoints.down(600)]: {
            fontSize: '0.875rem',
            padding: '6px 16px'
        },
    },
    desktopContainer: {
        [theme.breakpoints.up(1280)]: {
            width: '70vw',
        },
    },
    mobileWelcomeCard: {
        maxWidth: '15rem',
        margin: 'auto',
        marginTop: '1rem'
    },
    mobileSubtitle: {
        fontSize: '0.9rem'
    }
}));

interface propType {
    history: {
        push: Function,
    }
}

interface threadsArray {
    thread_id: string
    thread_name: string
}

interface sortedThreadsArray {
    id: string,
    contents: string,
    timestamp: string,
    name: string,
    username: string
}

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

interface creatorObject {
    username: string
}

interface threadDataObject {
    id: string,
    name: string,
    private: boolean,
    creator: creatorObject
}

interface threadDataArray {
    thread: threadDataObject
}

const Home = ({ history }: propType) => {
    const classes = useStyles();
    const { user, setUser } = useContext(MediaContext);
    const [username, setusername] = useState('');
    const { websocket, setWebsocket } = useContext(WebsocketContext);
    const { getLoggedInUser } = useUsers();
    const { getThreads, getMessages, getLastMessage } = useChats();
    const { height } = useWindowDimensions();
    const [heightCorrected, setHeightCorrected] = useState(height - 64);
    const [threads, setThreads] = useState<threadsArray[]>([]);
    const [threadData, setThreadData] = useState<threadDataArray[]>([]);
    const [sortedThreads, setSortedThreads] = useState<sortedThreadsArray[]>([]);
    const [threadOpen, setThreadOpen] = useState(false)
    const [threadId, setThreadId] = useState('0');
    const [messages, setMessages] = useState<messagesArray[]>([]);
    const [updateState, setUpdateState] = useState(Date.now());
    const [updateThreadButtons, setUpdateThreadButtons] = useState(Date.now());
    const [updateThreadButtonInfos, setUpdateThreadButtonInfos] = useState(Date.now());
    const [messageAmount, setMessageAmount] = useState(50);
    const [modalOpen, setModalOpen] = useState(false);
    const [threadToUpdate, setThreadToUpdate] = useState({
        id: '0',
        update: Date.now()
    });
    const [wsMessage, setWsMessage] = useState({
        type: '',
        contents: '',
        timestamp: String(new Date()),
        status: 'unseen',
        thread: {
            id: '0',
            name: '',
        },
        user: {
            id: '0',
            username: ''
        },
    });

    const isMobile = useMediaQuery({
        query: '(max-width: 600px)'
    });

    const isDesktop = useMediaQuery({
        query: '(min-width: 1280px)'
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

    useEffect(() => {
        (async () => {
            try {
                console.log('USER: ', user)
                const token = localStorage.getItem('token');
                if ( token === null) history.push('/login');
                const loggedInUser = await getLoggedInUser(token!);
                console.log('Logged', loggedInUser);
                if (!loggedInUser.success) {
                    history.push('/login');
                }
                setUser(loggedInUser.data.id);
                setusername(loggedInUser.data.username);
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                if (user !== '0') {
                    const token = localStorage.getItem('token');
                    if ( token === null) history.push('/login');
                    const chatThreads = await getThreads(token!);
                    if(chatThreads.message === 'Not authorized') history.push('/login');
                    if (chatThreads.data.length > 0) {
                        const threadIdArray = [];
                        for(let i = 0; i < chatThreads.data.length; i++) {
                            const idObject = {
                                thread_id: chatThreads.data[i].thread.id,
                                thread_name: chatThreads.data[i].thread.name
                            }
                            threadIdArray.push(idObject);
                        }
                        setThreads(threadIdArray);
                        setThreadData(chatThreads.data);
                    } else {
                        setThreads([{thread_id: '0', thread_name: ''}]);
                    }
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [user, updateThreadButtons]);

    useEffect(() => {
        (async () => {
            try {
                if (threads.length > 0) {
                    if (threads[0].thread_id !== '0') {
                        console.log('THREADS', threads);
                        let idArray = [];
                        const token = localStorage.getItem('token');
                        if ( token === null) history.push('/login');
                        for (let i = 0; i < threads.length; i++) {
                            const threadMessages = await getLastMessage(threads[i].thread_id, token!);
                            const threadIdObject = {
                                id: threads[i].thread_id,
                                contents: threadMessages.data.length > 0 ? threadMessages.data[0].contents : '',
                                timestamp: threadMessages.data.length > 0 ? threadMessages.data[0].timestamp : '1999-02-06T05:47:00',
                                name: threads[i].thread_name,
                                username: threadMessages.data.length > 0 ? threadMessages.data[0].user.username : '',
                            };
                            idArray.push(threadIdObject);
                        }
                        idArray.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0));
                        console.log('IDARRAY', idArray);
                        setSortedThreads(idArray);
                    }
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [threads, updateThreadButtonInfos]);

    useEffect(() => {
        (async () => {
            try {
                if (threadId !== '0') {
                    const token = localStorage.getItem('token');
                    if ( token === null) history.push('/login');
                    const threadMessages = await getMessages(threadId, 50, token!);
                    if (threadMessages.message === 'Not authorized') history.push('/login');
                    setMessages(threadMessages.data);
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [threadId, updateState]);

    useEffect(() => {
        try {
            if (wsMessage.type !== '' && wsMessage.thread.id === threadId) {
                const newMessageObject: messagesArray = {
                    id: String(Date.now()),
                    contents: wsMessage.contents,
                    timestamp: wsMessage.timestamp,
                    status: wsMessage.status,
                    thread: wsMessage.thread,
                    user: wsMessage.user
                }
                setMessages(messages => [...messages, newMessageObject]);
                setMessageAmount(messageAmount + 1);
            }
        } catch (e) {
            console.log(e.message);
        }
    }, [wsMessage]);

    useEffect(() => {
        try {
            if (threads.length !== 0) {
                if (websocket === undefined || websocket.readyState === 2 || websocket.readyState === 3) {
                    console.log('READYSTATE ', websocket?.readyState)
                    const socket = new WebSocket('wss://chatapptommiov.azurewebsites.net');

                    socket.addEventListener('open', function (event) {
                        try {
                            console.log('Server is opened.');
                            const client = {
                                type: 'client',
                                user_id: user,
                                threads: threads,
                            }
                            socket.send(JSON.stringify(client));
                        } catch (e) {
                            console.log(e.message);
                        }
                    });

                    socket.addEventListener('message', function (event) {
                        try {
                            if (event.data !== 'ping') {
                                console.log('Message from server ', JSON.parse(event.data).thread);
                                const message = JSON.parse(event.data);
                                if (message.type === 'message') {
                                    setWsMessage(message);
                                    setUpdateThreadButtonInfos(Date.now());
                                    setThreadToUpdate({
                                        id: message.thread.id,
                                        update: Date.now()
                                    });
                                } else if (message.type === 'newThread') {
                                    setUpdateThreadButtons(Date.now());
                                    setThreadToUpdate({
                                        id: '0',
                                        update: Date.now()
                                    });
                                }
                            } else {
                                setTimeout(() => socket.send('pong'), 1000);
                            }
                        } catch (e) {
                            console.log(e.message);
                        }
                    });

                    socket.addEventListener('close', function (event) {
                        try {
                            console.log('Websocket connection closed.');
                            setUpdateState(Date.now());
                        } catch (e) {
                            console.log(e.message);
                        }
                    });

                    setWebsocket(socket);
                    console.log('NEW SOCKET');
                }
            }
        } catch (e) {
            console.log(e.message);
        };
    }, [updateState, threads]);

    const setCreateNewChatThreadOpen = () => {
        setModalOpen(true);
    }


    return (
        <>
            {isMobile ? (
                <Grid container direction="column" style={{ height: heightCorrected, }} >
                    {threadOpen ? (
                        <Grid item >
                            <Thread
                                messages={messages}
                                id={threadId}
                                websocket={websocket}
                                messageAmount={messageAmount}
                                setMessageAmount={setMessageAmount}
                                setThreadOpen={setThreadOpen}
                                setThreadId={setThreadId}
                            />
                        </Grid>
                    ) : (
                        <Grid item>
                            <Card className={classes.mobileWelcomeCard}>
                                <Grid container alignItems="center" justifyContent="center" direction="column" >
                                    <Typography component="h6" variant="h6">Welcome {username}!</Typography>
                                    <Typography className={classes.mobileSubtitle} component="div" variant="body1">This is Chat App made by Tommi.</Typography>
                                </Grid>
                            </Card>
                            <Button
                                onClick={setCreateNewChatThreadOpen}
                                color="primary"
                                variant="contained"
                                className={classes.newThreadButton}
                            >
                                Create a new chat thread
                            </Button>
                            <Grid container style={{ borderTop: '1px solid #5F4B8BFF', marginTop: '1rem' }} >
                                <List style={{ padding: 0, width: '100vw' }}>
                                    {sortedThreads.map((item) => (
                                        <ThreadButton
                                            key={item.id}
                                            id={item.id}
                                            threadName={item.name}
                                            setThreadOpen={setThreadOpen}
                                            setThreadId={setThreadId}
                                            threadOpen={threadOpen}
                                            threadId={threadId}
                                            updateThreadButtonInfos={updateThreadButtonInfos}
                                            threadToUpdate={threadToUpdate}
                                        />
                                    ))}{' '}
                                </List>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            ) : (
                <>
                    {isDesktop ? (
                        <Card style={{ width: '70vw', margin: 'auto' }}>
                            <Grid container direction="row" style={{ height: heightCorrected, }} className={classes.desktopContainer} >
                                <Grid item style={{ width: '30%', borderRight: '1px solid #5F4B8BFF', maxHeight: heightCorrected, overflowY: 'auto' }}>
                                    <Button
                                        onClick={setCreateNewChatThreadOpen}
                                        color="primary"
                                        variant="contained"
                                        className={classes.newThreadButton}
                                    >
                                        Create a new chat thread
                                    </Button>
                                    <Grid container style={{ borderTop: '1px solid #5F4B8BFF', marginTop: '1rem' }} >
                                        <List style={{ padding: 0, width: '100%' }}>
                                            {sortedThreads.map((item) => (
                                                <ThreadButton
                                                    key={item.id}
                                                    id={item.id}
                                                    threadName={item.name}
                                                    setThreadOpen={setThreadOpen}
                                                    setThreadId={setThreadId}
                                                    threadOpen={threadOpen}
                                                    threadId={threadId}
                                                    updateThreadButtonInfos={updateThreadButtonInfos}
                                                    threadToUpdate={threadToUpdate}
                                                />
                                            ))}{' '}
                                        </List>
                                    </Grid>
                                </Grid>
                                <Grid item style={{ width: '70%' }}>
                                    {threadOpen ? (
                                        <Thread
                                            messages={messages}
                                            id={threadId}
                                            websocket={websocket}
                                            messageAmount={messageAmount}
                                            setMessageAmount={setMessageAmount}
                                            setThreadOpen={setThreadOpen}
                                            setThreadId={setThreadId}
                                        />
                                    ) : (
                                        <Grid container alignItems="center" justifyContent="center" direction="column" >
                                            <Typography component="h1" variant="h2">Welcome {username}!</Typography>
                                            <Typography component="div" variant="body1">This is Chat App made by Tommi.</Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Card>
                    ) : (
                        <Grid container direction="row" style={{ height: heightCorrected, }} className={classes.desktopContainer} >
                            <Grid item style={{ width: '30%', borderRight: '1px solid #5F4B8BFF', maxHeight: heightCorrected, overflowY: 'auto' }}>
                                <Button
                                    onClick={setCreateNewChatThreadOpen}
                                    color="primary"
                                    variant="contained"
                                    className={classes.newThreadButton}
                                >
                                    Create a new chat thread
                                </Button>
                                <Grid container style={{ borderTop: '1px solid #5F4B8BFF', marginTop: '1rem' }} >
                                    <List style={{ padding: 0, width: '100%' }}>
                                        {sortedThreads.map((item) => (
                                            <ThreadButton
                                                key={item.id}
                                                id={item.id}
                                                threadName={item.name}
                                                setThreadOpen={setThreadOpen}
                                                setThreadId={setThreadId}
                                                threadOpen={threadOpen}
                                                threadId={threadId}
                                                updateThreadButtonInfos={updateThreadButtonInfos}
                                                threadToUpdate={threadToUpdate}
                                            />
                                        ))}{' '}
                                    </List>
                                </Grid>
                            </Grid>
                            <Grid item style={{ width: '70%' }}>
                                {threadOpen ? (
                                    <Thread
                                        messages={messages}
                                        id={threadId}
                                        websocket={websocket}
                                        messageAmount={messageAmount}
                                        setMessageAmount={setMessageAmount}
                                        setThreadOpen={setThreadOpen}
                                        setThreadId={setThreadId}
                                    />
                                ) : (
                                    <Grid container alignItems="center" justifyContent="center" direction="column" >
                                        <Typography component="h1" variant="h2">Welcome {username}!</Typography>
                                        <Typography component="div" variant="body1">This is Chat App made by Tommi.</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    )}
                </>
            )
            }
            <Modal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                websocket={websocket}
                setThreadOpen={setThreadOpen}
                setThreadId={setThreadId}
            />
        </>
    );

}

export default Home