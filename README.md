# Interactive Math Charts
<b style="color:rgb(200,0,0)">*overhaul in progress</b>

## Details:
A series of interactive tools to teach or practice various basic math concepts.  
<i style="color:rgb(200,200,0)">An excellent resource for children!</i>


## Stack:
This application uses a simple MERN stack:

* __MongoDB__ provides data for coloring the tools.
* __Express.js__ making connecting to the server a breeeze!
* __Reach.js__ built components.
* __Node.js__ our server and project manager.


## Install:
This project is actually just two smaller projects (sever & client).  After cloning, We will be running installs for both of these.
1. Clone this repo. 
    ```
    git clone https://github.com/mattFanning/InteractiveMathCharts.git
    ```
1. _cd_ into the project folder.
    ```
    cd <clone_dir>/InteractiveMathCharts
    ```
1. From the server folder run _npm install_.
    ```
    cd sever
    npm install
    ```
1. From the client folder run _npm install_.
    ```
    cd ../client
    npm install
    ```

## Run:
Both projects (server & client) need to be running in individual environments.
1. Execute the sever.   __*Note:__ this needs to be done from the context of the root folder:
    ```
    cd <clone_dir>/InteractiveMathCharts
    node server/server.js
    ```
1. Execute the client.
    ```
    cd <clone_dir>/InteractiveMathCharts
    cd client
    cd npm start
    ```
You can use the tools by going to 
    ```http://localhost:3000/``` in your browser.

<br></br>
## Enjoy!