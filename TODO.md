## set vidly_jwtPrivateKey = default value in Development env
## /api/me get the current user 

## Endpoints: Routes 
    - we have make a new module called with the resource 
    like genres.js and then load 
    const route = express.Route()

    GET POST PUT DELETE
    /api/users    
    /api/genres (secured)
    /api/customers (secured)
    /api/movies (secured)
    /api/rentals (secured)

## Authentication:
    - is the process of identifying if the user who they claim you are (when we loggin) 
    - we have 
## Authorization:
    - is determine if the user has the right permission to perform the given opertations
## JSON Web Token:
    - is a long string that identify the user as meta for is think of it like driver licesne or passport

GET customers/ done
POST customers/ done
GET customers/:id done
PUT customers/:id done
DELETE customers/:id done

## Genre Model
    name 

## Movie Model
    title
    dailyRentalRate
    numberInStock
    genre

## Rental Model 
    movie
        title 
        dailyRentalRate
    customer
        name 
        phone
        isGold
    dateOut
    retalFee
    dateReturned

## Customer Model
    name
    phone
    isGold
    dateJoined

## User Model
    customer
    isAdmin
