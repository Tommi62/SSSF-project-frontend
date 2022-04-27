import config from '../config'

interface fetchQuery {
    query: string
}

interface inputsObject {
    username: string,
    password: string
}

const doFetch = async (url: string, options = {}) => {
    const response = await fetch(config.backendUrl + url, options);
    const json = await response.json();
    if (json.error) {
        // if API response contains error message (use Postman to get further details)
        throw new Error(json.message + ': ' + json.error);
    } else if (!response.ok) {
        // if API response does not contain error message, but there is some other error
        throw new Error('doFetch failed');
    } else {
        // if all goes well
        return json;
    }
};

const doQueryFetch = async (query: fetchQuery, token: string) => {
    let options = {};
    
    if (token !== 'no token') {
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(query),
        };
    } else {
      options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(query),
        };
    }
    try {
      const response = await fetch(config.backendUrl, options);
      const json = await response.json();
      return json;
    }
    catch (e) {
      console.log(e);
      return false;
    }
};

const useUsers = () => {

    const getUsers = async () => {
        const fetchOptions = {
            method: 'GET',
            credentials: 'include',
        };
        try {
            return await doFetch('/users', fetchOptions);
        } catch (e) {
            throw new Error(e.message);
        }
    };

    const getUserAvailable = async (username: String) => {
        try {
            return await doFetch('/users/username/' + username);
        } catch (e) {
            alert(e.message);
        }
    };

    const getUsernameById = async (id: number) => {
        try {
            return await doFetch('/user/' + id);
        } catch (e) {
            alert(e.message);
        }
    };

    const register = async (inputs: Object) => {
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
            credentials: 'include',
        };
        try {
            const result = await doFetch('/user', fetchOptions);
            console.log('RegisterResult', result.message)
            return result.message
        } catch (e) {
            alert(e.message);
        }
    };

    const getLoggedInUser = async (token: string) => {
        try {
            const query = {
                query: `
                {
                  getLoggedInUser{
                    id
                    username
                  }
                }
                `,
                variables: {}
              };
              const data = await doQueryFetch(query, token);
              let success = true;
              if (data.errors) {
                success = false;
              }
              const returnObject = {
                  success,
                  data: data.data.getLoggedInUser
              }
              return returnObject;
        } catch (e) {
            throw new Error(e.message);
        }
    };

    const postLogin = async (inputs: inputsObject) => {
        try {
            const query = {
                query: `
                {
                    login(username: "${inputs.username}", password: "${inputs.password}") {
                        id,
                        username,
                        token
                    }
                }
                `,
                variables: inputs
              };
              const data = await doQueryFetch(query, 'no token');
              let success = true;
              if (data.errors) {
                success = false;
              }
              const returnObject = {
                  success,
                  data: data.data.login
              }
              return returnObject;
        } catch (e) {
            alert(e.message);
        }
    };

    const logout = async () => {
        const fetchOptions = {
            method: 'DELETE',
            credentials: 'include',
        };
        try {
            return await doFetch('/logout', fetchOptions);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    const getProfile = async () => {
        const fetchOptions = {
            method: 'GET',
            credentials: 'include',
        };
        try {
            return await doFetch('/profile', fetchOptions);
        } catch (e) {
            throw new Error(e.message);
        }
    };

    return { getUsers, getUserAvailable, getUsernameById, register, getLoggedInUser, postLogin, logout, getProfile };
};

const useChats = () => {

    const getThreadIds = async (userId: number) => {
        try {
            return await doFetch('/threads/' + userId);
        } catch (e) {
            alert(e.message);
        }
    };

    const getThreads = async (token: string) => {
        try {
            const query = {
                query: `
                {
                    getChatThreadsByUserId {
                        thread {
                            id,
                            name,
                            private,
                            creator {
                                username
                            }
                        }
                    }
                }
                `,
                variables: {}
              };
              const data = await doQueryFetch(query, token);
              let message = 'Success';
              if (data.errors) {
                console.log(data.errors[0]);
                message = data.errors[0].message;
              }
              const returnObject = {
                  message,
                  data: data.data.getChatThreadsByUserId
              }
              return returnObject;
        } catch (e) {
            console.log(e.message);
            const returnObject = {
                message: e.message,
                data: null,
            }
            return returnObject;
        }
    };

    interface messageParams {
        threadId: string,
        limit: number
    }

    const getMessages = async (threadId: string, mLimit: number, token: string) => {
        try {
            const query = {
                query: `
                {
                    getMessagesByThreadId(id: "${threadId}", messageLimit: ${mLimit}) {
                        id,
                        contents,
                        timestamp,
                        status,
                        thread {
                            id,
                            name
                        },
                        user {
                            id,
                            username
                        }
                    }
                }
                `,
                variables: {
                    threadId,
                    mLimit
                }
              };
              const data = await doQueryFetch(query, token);
              let message = 'Success';
              if (data.errors) {
                console.log(data.errors[0]);
                message = data.errors[0].message;
              }
              const returnObject = {
                  message,
                  data: data.data.getMessagesByThreadId
              }
              return returnObject;
        } catch (e) {
            console.log(e.message);
            const returnObject = {
                message: e.message,
                data: null,
            }
            return returnObject;
        }
    };

    const getLastMessage = async (threadId: string, token: string) => {
        try {
            const query = {
                query: `
                {
                    getLastMessageByThreadId(id: "${threadId}") {
                        id,
                        contents,
                        timestamp,
                        status,
                        thread {
                            id,
                            name
                        },
                        user {
                            id,
                            username
                        }
                    }
                }
                `,
                variables: {threadId}
              };
              const data = await doQueryFetch(query, token);
              let message = 'Success';
              if (data.errors) {
                console.log(data.errors[0]);
                message = data.errors[0].message;
              }
              const returnObject = {
                  message,
                  data: data.data.getLastMessageByThreadId
              }
              return returnObject;
        } catch (e) {
            console.log(e.message);
            const returnObject = {
                message: e.message,
                data: null,
            }
            return returnObject;
        }
    };

    const getUserIds = async (userId: number) => {
        try {
            return await doFetch('/threadusers/' + userId);
        } catch (e) {
            alert(e.message);
        }
    };

    const getThreadName = async (threadId: number) => {
        try {
            const thread = await doFetch('/thread/' + threadId);
            return thread.name;
        } catch (e) {
            alert(e.message);
        }
    };

    const postMessage = async (messageObject: Object) => {
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: messageObject,
            credentials: 'include',
        };
        try {
            const result = await doFetch('/message', fetchOptions);
            return result.success
        } catch (e) {
            alert(e.message);
        }
    };

    const getAllMessages = async (threadId: number) => {
        try {
            return await doFetch('/all_messages/' + threadId);
        } catch (e) {
            alert(e.message);
        }
    };

    const createNewChatThread = async (chatThreadObject: Object) => {
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: chatThreadObject,
            credentials: 'include',
        };
        try {
            const result = await doFetch('/new_thread', fetchOptions);
            return result
        } catch (e) {
            alert(e.message);
        }
    };

    return { getThreadIds, getUserIds, getThreadName, postMessage, getMessages, getAllMessages, getLastMessage, createNewChatThread, getThreads }
}

export { useUsers, useChats };