<!-- toc -->

# sdchain-holographic
> A platform for all users to view all transactions in SDChain

## Run

### Engineering Configuration Changes
Modify the corresponding js file: js/constant.js
```js
var Constant = new function() {
    return {
         data:{
            // dataapi address of the main data source
            dataApiUrl:"https://dataapi-beta.sdchain.io",
            // restapi addressof some data sources 
            restApiUrl:"https://rest-beta.sdchain.io"
        }
    };
}();
```

### Start the service
This project is a pure front-end project and can be run with nginx or other static servers.
For example, use nginx to modify the following configuration:
Modify the file nginx.conf
```
http {
 server {
 location / {
            # Actual project path
            root C :/sdchain-explorer;
            # Home mapping html
            index index.html index.htm;
        }
   }
}
```
Access address: http://localhost:80/


## Function Description
The current project contains the following features:

1. Show the latest transferred data.
2. Get a line graph of the number of transactions in the last 7 days.
3. Show the latest block height.
4. Query transfer details According to hash.
5. Get account balance based on account address, and recent transfer history.


## schema description
1. Based on html5, css3, jquery
Code structure
```
css/                --> Style file
i18n/               --> Language Pack
images/             --> Image files
js/                 --> Logical processing
index.html          --> Home Page
accountSearch.html  --> Page of viewing account information
txSearch.html       --> Page of viewing transaction details
```