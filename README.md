
# ae-status-check-simple   
   
A simple status check of an Automic system. The tool is command line based. The output is not stored and the output is presented on the console. 

**Other output formats in pipeline**

## Requirements     
node (version 8.15.0)

## Installation   
* change directory into the ae-upstatus-check-simple folder.
* run `npm install`   
* update `.env` file with your connection parameters
  

## Configuration  
At the moment it is only possible to check the status of one Automic System by calling one Rest API connection. Use the .env file to configure the connection parameters.    
For the AE_PASSWORD parameter it is recommended to encrypt the passwort with the default Automic Encryt tool 

## Usage  
start the programm with `node index.js`


