import dotenv from 'dotenv/config'

if(!process.env.MONGO_URI){
    throw new error("MONGO_URI is required")
}
if(!process.env.JWT_SECRET){
    throw new error("JWT_SECRET is required")
}
if(!process.env.CLIENT_ID){
    throw new error("CLIENT_ID is required")
}
if(!process.env.CLIENT_SECRET){
    throw new error("CLIENT_SECRET is required")
}
if(!process.env.REFRESH_TOKEN){
    throw new error("REFRESH_TOKEN is required")
}
if(!process.env.EMAIL_USER){
    throw new error("EMAIL_USER is required")
}
const config={
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    REFRESH_TOKEN:process.env.REFRESH_TOKEN,
    EMAIL_USER:process.env.EMAIL_USER
}

export default config