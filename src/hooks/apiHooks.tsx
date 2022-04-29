import config from '../config'

interface fetchQuery {
    query: string
}

interface inputsObject {
    username: string,
    password: string
}

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
      const response = await fetch('https://chatapptommiov.azurewebsites.net/graphql', options);
      const json = await response.json();
      return json;
    }
    catch (e) {
      console.log(e);
      return false;
    }
};

const useUsers = () => {

    const getUsers = async (token: string) => {
        try {
            const query = {
                query: `
                {
                    getAllUsers{
                        id,
                        username,
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
                  data: data.data.getAllUsers
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

    const getUserAvailable = async (username: string) => {
        try {
            const query = {
                query: `
                {
                    getUserByUsername(username: "${username}"){
                        id, 
                        username,
                    }
                }
                `,
                variables: {username}
              };
              const data = await doQueryFetch(query, 'no token');
              if (data.errors) return false;
              if (data.data.getUserByUsername !== null) return false
              return true;
        } catch (e) {
            console.log(e.message);
            return false;
        }
    };

    const register = async (inputs: inputsObject) => {
        try {
            const query = {
                query: `
                mutation {
                    registerUser( username: "${inputs.username}", password: "${inputs.password}") {
                        id,
                        username
                    }
                }
                `,
                variables: inputs
              };
              const data = await doQueryFetch(query, 'no token');
              let message = 'Success';
              if (data.errors) {
                console.log(data.errors[0]);
                message = data.errors[0].message;
              }
              const returnObject = {
                  message,
                  data: data.data.register
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

    return { getUsers, getUserAvailable, register, getLoggedInUser, postLogin };
};

const useChats = () => {

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

    interface messageObject {
        contents: string,
        timestamp: string,
        threadId: string
    }

    const postMessage = async (messageObject: messageObject, token: string) => {
        try {
            const query = {
                query: `
                mutation {
                    postMessage(contents: "${messageObject.contents}", timestamp: "${messageObject.timestamp}", thread: "${messageObject.threadId}") {
                        id,
                        contents,
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
                variables: messageObject
              };
              const data = await doQueryFetch(query, token);
              let message = 'Success';
              if (data.errors) {
                console.log(data.errors[0]);
                message = data.errors[0].message;
              }
              const returnObject = {
                  message,
                  data: data.data.postMessage
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

    const createNewChatThread = async (name: string, threadPrivate: boolean, token: string) => {
        try {
            const query = {
                query: `
                mutation {
                    createChatThread(name: "${name}", private: ${threadPrivate}) {
                        id,
                        name,
                        private,
                        creator {
                            id,
                            username
                        }
                    }
                }
                `,
                variables: {name, threadPrivate}
              };
              const data = await doQueryFetch(query, token);
              let message = 'Success';
              if (data.errors) {
                console.log(data.errors[0]);
                message = data.errors[0].message;
              }
              const returnObject = {
                  message,
                  data: data.data.createChatThread
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

    const createNewChatting = async (threadId: string, userId: string, token: string) => {
        try {
            const query = {
                query: `
                mutation {
                    createChatting(thread: "${threadId}", user: "${userId}") {
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
                variables: {threadId, userId}
              };
              const data = await doQueryFetch(query, token);
              let message = 'Success';
              if (data.errors) {
                console.log(data.errors[0]);
                message = data.errors[0].message;
              }
              const returnObject = {
                  message,
                  data: data.data.createChatting
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

    return { postMessage, getMessages, getLastMessage, createNewChatThread, createNewChatting, getThreads }
}

export { useUsers, useChats };