import dotenv from 'dotenv';
let connect = "";
dotenv.config();
if(process.env.NODE_ENV =='production'){
    connect = process.env.DATABASE_URL3;
}
else if(process.env.NODE_ENV =='test'){
    connect = process.env.DATABASE_URL2;
}
else if(process.env.NODE_ENV =='development'){
    connect = process.env.DATABASE_URL;
}
export default connect;