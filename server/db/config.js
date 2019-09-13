import dotenv from 'dotenv';
let connect = "";
dotenv.config();
switch(process.env.NODE_ENV){
    case 'production':
        connect = process.env.DATABASE_URL3;
        break;
    case 'test':
        connect = process.env.DATABASE_URL2;
        break;
    default:
        connect = process.env.DATABASE_URL;
        break;
}
export default connect;