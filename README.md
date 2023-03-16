# REST API for acronyms with a NodeJS server and MongoDB

## Created endpoints:

### GET

/acronym?page=1&limit=10&search=:search

- returns a list of acronyms, pagination using query parameters
- response headers indicate if there are more results
- returns all acronyms that fuzzy match against :search

### POST

/acronym

- receives an acronym and definition string
- adds the acronym definition to the db

### PATCH

/acronym/:acronymID

- updates the acronym for :acronymID
- DELETE /acronym/:acronymID
- deletes the acronym for :acronymID

## Project setup

```
npm install
```

## Database connection

Go to `db.config.js` file and replace mongodbconnection with your url.

```
module.exports = {
  url: "mongodbconnection"
};
```

## Run

```
npm start
```
