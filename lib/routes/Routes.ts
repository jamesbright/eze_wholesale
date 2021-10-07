import * as express from 'express';
import { Request, Response } from 'express';
import validateRequest from '../middlewares/validateRequest';
import { BuyRequestController } from '../controllers/BuyRequestController';
import { SellRequestController } from '../controllers/SellRequestController';


export class Routes {
    //create an instance of BuyRequestController
    public buyRequestController: BuyRequestController = new BuyRequestController();
    //create an instance of SellRequestController
    public sellRequestController: SellRequestController = new SellRequestController();


    public routes(app: express.Application): void {

        //base url
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: "Wellcome to Eze wholesale"
                })
            });

          //create buy requests
        app.route('/api/requests/buy/create')
            .post(validateRequest, this.buyRequestController.create)
        // get all buy requests 
        app.route('/api/requests/buy')
            .get(this.buyRequestController.getAll);

        // get an item with the item's id
        app.route('/api/requests/buy/get/:itemId')
            .get(this.buyRequestController.getItemWithID);
        
        

        //create sell requests
        app.route('/api/requests/sell/create')
            .post(validateRequest, this.sellRequestController.create)
        // get all sell requests
        app.route('/api/requests/sell')
            .get(this.sellRequestController.getAll);

        // get an item with the item's id
        app.route('/api/requests/sell/get/:itemId')
            .get(this.sellRequestController.getItemWithID);

        
        //get buy or sell requests according to query string
        app.route('/api/requests')
            .get((req: Request, res: Response) => {
                if (req.query.action == 'buy') {
                    // get all buy requests 
                    res.redirect('/api/requests/buy');
                   
                } else {

                    // get all sell requests
                    res.redirect('/api/requests/sell')
                }
               
            });


    }
}
