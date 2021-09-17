/** here can be some logic to set up all variables for our app configuration */

//used in app.module.ts
export default () => ({
    environment: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    }
})