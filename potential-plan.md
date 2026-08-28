# Possible Overview for Request Bin

## Application Flow

* User -> GET req to "/"
    * Express res -> homepage
    * Homepage 
        * Add New Bin
            * Form to create bin_name (ie, url endpoint)
        * My Bins:
            * SELECT bins for specific user (PostgreSQL)

* User -> POST req to create new bin
    * if user exists, get id; else, INSERT new user

    * if end point is unique (SELECT from bins returns null)
        * INSERT into bins table

    * Display new bin for user (in My Bins)

* User -> GET req for specific bin (eg, example.com/web/:bin_name)
    * PostgreSQL SELECT FROM requests for specific bin
    * Display for user

* 3rd Party (eg, webhook) -> GET/POST/etc req to example.com/:bin_name
    * Does bin name exist (psql SELECT bin_name from bins)?
        * if not, send 404 res
        * if yes, send 200 res
            * save raw request data to MongoDB
            * parse MongoDB req payload and store it in PostgreSQL

## Optimizations

* Cache user
* Cache bin_names for a user
