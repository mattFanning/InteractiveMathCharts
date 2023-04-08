const express = require('express')
const app = express()
const path = require('path');
const port = 8080
const router = express.Router();
 
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/public/MultiplicationDivisionChart.html'));
});

// //add static files
app.use(express.static('public'))
app.use('/lib', express.static('lib'))

//add the router
app.use('/', router)
app.listen(8080)
