const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const envConfig = {
    development: {
        backendUrl: 'http://localhost:3001/graphql'
    },
    production: {
        backendUrl: 'https://something.com'
    }
}

export default envConfig[env]