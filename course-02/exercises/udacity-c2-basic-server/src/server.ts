import express, { Router, Request, Response, request } from 'express';
//import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express applicaiton
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
    //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  var bodyParser = require('body-parser')
  app.use(bodyParser.json()); 

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get("/cars",(req: Request, res: Response) => {
    let {make} = req.query;

    let carsList = cars;
    
    // if we have an optional query param, filter by it
    if(make){
      carsList = cars.filter((c) => c.make === make);
    }

    return res.status(200).send(carsList);
  });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars/:id",(req: Request, res: Response) => {

    let {id} = req.params;

    if(!id){
      return res.status(400).send('id is required');
    }
    else{
      // try to find the car by id
      const car = cars.filter((c) => c.id == parseInt(id));

      // respond not found if we do not have this id
      if(car && car.length == 0){
        return res.status(404).send('car is not found');
      }

      return res.status(200).send(car);
    }

  });

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/cars",(req: Request, res: Response) => {

    let  {make,type,model,cost,id} = req.body;

    if(!make || !type || !model || !cost || !id){
      return res.status(400).send('make, type, mode, cost, id are required!');
    }
    // make a new car instance
    const newCar: Car = {
      make: make, type: type, model: model, cost: cost, id: id
    };

    // add to the existing local variable
    cars.push(newCar);

    return res.status(201).send(newCar);
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();