import React, { useState } from 'react';
import PropTypes from 'prop-types';

interface propType {
    children: any
}

type userContextState = {
    user: string;
    setUser: (id: string) => void;
};

const contextDefaultValues: userContextState = {
    user: '0',
    setUser: () => { }
};

const MediaContext = React.createContext<userContextState>(contextDefaultValues)

const MediaProvider = ({ children }: propType) => {
    const [user, setUser] = useState<string>(contextDefaultValues.user);
    return (
        <MediaContext.Provider value={{ user, setUser }}>
            {children}
        </MediaContext.Provider>
    );
};

MediaProvider.propTypes = {
    children: PropTypes.node,
};

export { MediaContext, MediaProvider };