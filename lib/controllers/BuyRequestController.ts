import * as mongoose from 'mongoose';
import { BuyRequestSchema } from '../models/buyRequestModel';
import { BuyRequestI } from '../interfaces/buyRequest';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
// initialize configuration
dotenv.config();

//Create an instance of  buyRequest model
const BuyRequest = mongoose.model<BuyRequestI>('BuyRequest', BuyRequestSchema);
//index  documents to enable searching
BuyRequest.createIndexes();


class BuyRequestController {

  public create(req: Request, res: Response): void {


    BuyRequest.create({
      item: req.body.item,
      storageSize: req.body.storageSize,
      grading: req.body.grading,
      unlocked: req.body.unlocked,
      price: req.body.price
    },
      (err, productRequest) => {
        if (err) {
          return res.status(500).send({ status: "Server error", code: 500, message: err });

        } else {

          productRequest.save(err => {
            if (err) {
              return res.status(500).send({ status: "Server error", code: 500, message: err });

            }

            return res.status(201).send({ request: productRequest, status: "Success", code: 201, message: 'buy request successfully created' });

          });

        }
      });
  }


  public getAll(req: Request, res: Response): void {

    let status: string,
      message: string,
      code: number;

    // get limit and page number from request
    const currentPage: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 5;
    const orderBy: number = Number(req.query.orderBy) || 1;
    const sortBy: string = req.query.sortBy as string || 'firstName';
    let hasNext: boolean,
      hasPrev: boolean,
      query: object;
    if (req.query.search) {

      const search = req.query.search;
      //query to search for text
      query = { $text: { $search: search } };
    } else {
      query = null
    }

    try {
      //sort by firstname in ascending order
      const sort = { [sortBy]: orderBy };

      BuyRequest.find(query, async function (err: any, items: any) {
        // get total documents in the User collection 
        const count: number = await BuyRequest.countDocuments();
        let totalPages: number;
        if (err) {
          code = 500;
          status = "Server error";
          message = "There was a problem with the server.";
          totalPages = 0;
        } else {
          if (items.length == 0) {
            code = 404;
            status = "Not found";
            message = "items not found";
            totalPages = 0;
          } else {
            code = 200;
            status = "Success";
            message = "Endpoint returned successfully";
            totalPages = Math.ceil(count / limit);

          }
        }

        if (currentPage > 1)
          hasPrev = true;
        else
          hasPrev = false;

        if (totalPages > currentPage)
          hasNext = true;
        else
          hasNext = false;

        //calculate values for previous and next page
        const prevPage: number = Number(currentPage) - 1;
        const nextPage: number = Number(currentPage) + 1;

        //pagination object with all pagination values
        const pagination: Record<string, unknown> = {
          'totalPages': totalPages,
          'currentPage': currentPage,
          'items': count,
          'hasNext': hasNext,
          'hasPrev': hasPrev,
          'perPage': limit,
          'prevPage': prevPage,
          'nextPage': nextPage
        }
        //get current and next url
        const links: Record<string, unknown> = {
          'nextLink': `${req.protocol}://${req.get('host')}/api/requests/buy?page=${nextPage}&limit=${limit}`,
          'prevLink': `${req.protocol}://${req.get('host')}/api/requests/buy?page=${prevPage}&limit=${limit}`
        };
        // return response with posts, calculated total pages, and current page
        return res.status(code).send({ items, pagination: pagination, status: status, code: code, message: message, links: links });



      })
        .limit(limit * 1)//prevPage = (currentPage - 1) * limit
        .skip((currentPage - 1) * limit)
        .sort(sort) //sort by firstnamed
        .exec();

    } catch (err) {
      console.error(err.message);
    }
  }


  public getItemWithID(req: Request, res: Response): void {

    let status: string,
      message: any,
      code: number;
    //find user using their id
    BuyRequest.findById(req.params.itemId, function (err, item) {
      if (err) {
        code = 500;
        status = "Server error";
        message = "There was a problem with the server.";
      } else {
        if (!item) {
          code = 404;
          status = "Not found";
          message = "item not found";
        } else {
          code = 200;
          status = "Success";
          message = "Endpoint returned successfully";
        }
      }
      return res.status(code).send({ item: item, status: status, code: code, message: message });

    })
  }


}

export { BuyRequestController }