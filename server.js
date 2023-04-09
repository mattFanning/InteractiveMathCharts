import express from 'express'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 8080
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/public/MultiplicationDivisionChart.html'));
});

// //add static files
app.use(express.static('public'))

//add the router
app.use('/', router)
app.listen(port)
