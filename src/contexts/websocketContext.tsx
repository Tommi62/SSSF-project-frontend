import React, { useState } from 'react';
import PropTypes from 'prop-types';

interface propType {
    children: any
}

type userContextState = {
    websocket: any;
    setWebsocket: (socket: WebSocket) => void;
};

const contextDefaultValues: userContextState = {
    websocket: undefined,
    setWebsocket: () => { }
};

const WebsocketContext = React.createContext<userContextState>(contextDefaultValues)

const WebsocketProvider = ({ children }: propType) => {
    const [websocket, setWebsocket] = useState<WebSocket>();
    return (
        <WebsocketContext.Provider value={{ websocket, setWebsocket }}>
            {children}
        </WebsocketContext.Provider>
    );
};

WebsocketProvider.propTypes = {
    children: PropTypes.node,
};

export { WebsocketContext, WebsocketProvider };