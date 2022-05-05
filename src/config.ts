const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const envConfig = {
    development: {
        backendUrl: 'http://localhost:3001/graphql',
        websocketUrl: 'ws://localhost:3001'
    },
    production: {
        backendUrl: 'https://chatapptommiov.azurewebsites.net/graphql',
        websocketUrl: 'wss://chatapptommiov.azurewebsites.net'
    }
}

export default envConfig[env]