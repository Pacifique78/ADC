import express from 'express';
import bodyParser from "body-parser"
import router from './server/routes/Routes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(bodyParser.json());// to create post request
app.use(bodyParser.urlencoded({extended:false}));

app.use(router);
const port= process.env.PORT || 6003;
 app.listen(port,console.log(`Listening to port ${port}`));
 
 export default app;

