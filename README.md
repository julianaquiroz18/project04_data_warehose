# DATA WAREHOUSE

This project was done using HTML, CSS, Sass, Bootstrap and Javascript in Front-end and Node.JS with Express, MongoDB and Mongoose in Back-end.   Author: julianaquiroz18   License: MIT

## How to test it?
Clone the repository and follow next steps:

1. Install Front-end dependencies:
```bash
    #Go to Data warehouse FE folder
    cd Data_warehouse_FE
    #Install dependencies
    npm install
```

2. Preparing enviroment:
```bash
    #Go back to main folder
    cd ..
    #Go to Data warehouse BE folder
    cd Data_warehouse_BE
    #Rename file `sample.env` to `.env`
    mv sample.env .env 
    #Make sure homebrew is installed previuosly, if it's not please refer to https://brew.sh instructions.
    #Install mongo data base tools. (Needed to restore data base)
    brew install mongodb-database-tools
    #Restore data base
    mongorestore --archive=data-warehouse.bson --db=data-warehouse   
```


3. Install Back-end dependencies and start server:

```bash
    #Install dependencies
    npm install
    #Initialize server
    npx nodemon server.js
```
4. Use your browser to access: http://localhost:9092/

5. Use next credentials to Data Warehouse app access:    

    As admin:  
        user: admin1@datawarehouse.com  
        password: Adminpassword1

    As user:  
        user: user1@datawarehouse.com  
        password: Userpassword1
