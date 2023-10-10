
const axios = require('axios')
const { format } = require('date-fns');
require('dotenv').config()

const name = process.env.AE_NAME;
const server = process.env.AE_SERVER;
const port = process.env.AE_PORT;
const client = process.env.AE_CLIENT;
const user = process.env.AE_USER;
const pass = process.env.AE_PASSWORD;
const protocol = process.env.PROTOCOL;
const timer = process.env.PERIOD;

const URL = protocol + "://" + server + ":" + port + "/ae/api/v1/" + client + "/system/health?details=true"


function status() {

  axios
  .get(
    URL,
     {
      auth: {
        username: user,
        password: pass,
      },

      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  .then (response => {
  
    console.log(response.status);
    
    const dateTime = format(new Date(), 'dd.MM.yyyy HH:mm:SS');

    console.log("[" + dateTime + "] -- Status check: System Name " + name);
    console.log("[" + dateTime + "] -- " + name + " status " + response.data.status);
    console.log("[" + dateTime + "] -- " + name + "PWP status " + response.data.pwp.status)
    console.log("[" + dateTime + "] -- " + name + "WP status " + response.data.wp.status + " with " + response.data.wp.instancesRunning + " instances running")
    console.log("[" + dateTime + "] -- " + name + "JWP status " + response.data.jwp.status + " with " + response.data.jwp.instancesRunning + " instances running")
    console.log("[" + dateTime + "] -- " + name + "JCP status " + response.data.jcp.status + " with " + response.data.jcp.instancesRunning + " instances running")
    console.log("[" + dateTime + "] -- " + name + "Rest status " + response.data.rest.status + " with " + response.data.rest.instancesRunning + " instances running")
    console.log("[" + dateTime + "] -- " + name + "CP status " + response.data.cp.status + " with " + response.data.cp.instancesRunning + " instances running")


  })
  .catch(error => {
    console.log(error)
  
    /*
      With timer == 0 no periodical repeat is set
      In this case the app will end with rc 100 in case of Rest error
      
    */
    
    if(timer == 0){
      process.exit(100);
    }
  
  })

}

status();

console.log('timer set to ' + timer + ' minutes');

if( timer > 0) {


  const id = setInterval(() => {
   status();
}, 1000 * 60 * timer);


}












