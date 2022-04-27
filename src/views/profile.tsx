/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { WebsocketContext } from '../contexts/websocketContext';
import { useUsers } from '../hooks/apiHooks';

const Profile = () => {
    const [user, setUser] = useState({ id: '', username: '' })
    const { websocket } = useContext(WebsocketContext);
    const { getProfile } = useUsers();

    useEffect(() => {
        (async () => {
            try {
                if (websocket !== undefined) {
                    websocket.close();
                }
                const result = await getProfile();
                console.log('Profile: ', result);
                setUser(result);
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    return (
        <div style={{ whiteSpace: 'pre-line' }}>
            <h1>{!user ? "Loading..." : user.username + '\n' + user.id}</h1>
        </div>
    );
}

export default Profile