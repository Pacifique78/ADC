import dotenv from 'dotenv';
let connection = "";
dotenv.config();
if(process.env.NODE_ENV =='production'){
    connection = process.env.DATABASE_URL3;
}
else if(process.env.NODE_ENV =='test'){
    connection = process.env.DATABASE_URL2;
}
else if(process.env.NODE_ENV =='development'){
    connection = process.env.DATABASE_URL;
}
export default connection;