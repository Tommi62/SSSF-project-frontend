import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { MediaContext } from '../contexts/mediaContext';
import { WebsocketContext } from '../contexts/websocketContext';
import { useUsers } from '../hooks/apiHooks';

interface propType {
    history: {
        push: Function,
    }
}

const Logout = ({ history }: propType) => {
    const { user, setUser } = useContext(MediaContext);
    const { websocket } = useContext(WebsocketContext);

    useEffect(() => {
        (async () => {
            try {
                console.log('USER:', user)
                localStorage.removeItem('token');
                setUser('0');
                history.push('/login');
                if (websocket !== undefined) {
                    websocket.close();
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    });

    return (
        <>
            <Redirect to={'/login'} />
        </>
    );
};

Logout.propTypes = {
    history: PropTypes.object,
};

export default Logout;