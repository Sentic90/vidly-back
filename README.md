# Vidly Store

## Bio

    - vidly store is API service that let customer to rent avaiable movie in store.
    - When customer return the movie these API will calculate the rental fee according to days movie has been out multipled by dailyRentalRate.

## features

    - admins can register with POST request to /api/users
    - get valid JWT token that will require in #crusual action like adding or deleting.

## Technology & tools

    - Nodejs v14.6 -> JavaScript runtime environment
    - Express v4.16.2 -> build API
    - Mongoose v5.0.2 to manipluate with MongoDB.

## Logging

    - Winstone v2.4
    - Winstone-mongodb v3.0

## Testing

    - For testing I've used Jest v29.5.
    - To simulate the Request client used Supertest v3.0.

## Endpoints:

### Movies /api/movies

    Supported Method        Required Token      Support Id Paramter
    - GET                                               *
    - POST          *           *
    - PUT           *           *                       *
    - DELETE        *           *                       *

### Genres /api/genres

    Supported Method        Required Token      Support Id Paramter
    - GET                                               *
    - POST          *           *
    - PUT           *           *                       *
    - DELETE        *           *                       *

### Customers /api/customers

    Supported Method        Required Token      Support Id Paramter
    - GET                                               *
    - POST          *           *
    - PUT           *           *                       *
    - DELETE        *           *                       *

### Users /api/users

    Supported Method        Required Token      Support Id Paramter
    - GET                                               *
    - POST          *           *
    - PUT           *           *                       *
    - DELETE        *           *                       *

### Rentals /api/rentals

    Supported Method        Required Token      Support Id Paramter
    - GET                                               *
    - POST          *           *
    - PUT           *           *                       *
    - DELETE        *           *                       *

### Returns /api/returns

    Supported Method        Required Token      Support Id Paramter
    - GET                                               *
    - POST          *           *
    - PUT           *           *                       *
    - DELETE        *           *                       *

### Auth /api/auth
