

import {Request, Response} from 'express';
import {ORDERS} from "./db-data";



export function getAllOrders(req: Request, res: Response) {

    console.log("Retrieving Orders ...");

    setTimeout(() => {

      res.status(200).json(Object.values(ORDERS));

    }, 1000);



}

