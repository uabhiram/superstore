

import * as express from 'express';
import {Application} from "express";
import {getAllOrders} from "./get-orders.route";
import {loginUser} from "./auth.route";

const bodyParser = require('body-parser');



const app: Application = express();


app.use(bodyParser.json());


app.route('/api/login').post(loginUser);

app.route('/api/orders').get(getAllOrders);





const httpServer:any = app.listen(9000, () => {
    console.log("HTTP REST API Server running at http://localhost:" + httpServer.address().port);
});




