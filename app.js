/*
 *  StarVizEM: STAR Files Visualization in CryoEM
 *  Copyright (C) 2018  Jean-Christophe Taveau.
 *
 *  This file is part of StarVizEM
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with StarVizEM.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */
 

'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const fs = require('fs');
const path = require('path');
const svzm = require('./routes/starvizem.js');


const port = 3000;
const upload = multer();
const app = express();


// 1- Init StarVizEM
svzm.init();

// 2- Server config
  // https?
  // https://stackoverflow.com/questions/43905643/expressjs-ssl-self-signed-https
  // Using Self signed certificate
  // https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
  
  // https://stackoverflow.com/questions/5778245/expressjs-how-to-structure-an-application
  // https://spinspire.com/article/creating-expressjs-environment-webpack-react-and-babel-configurations

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 


// Static
console.log('dir ' + __dirname);
app.use(express.static(__dirname + '/public'));
app.use('/js',express.static(__dirname + '/src')); // Only for debug

// Start server with express.js
// Now we can listen on port 3000 and report if there are any errors in doing so.
app.listen(port, function (error) {
  if(error) {
      console.log(error);
  }
  console.log(process.env.IP);
  console.log(this.address());
  console.log('Open your web browser at http://localhost:3000.\nCTRL+C to exit');
});


// 3- Routes
app.get('/',  (req, res,next) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/pipeline', (req, res,next) => {
  console.log(__dirname);
  svzm.getPipeline('./default_pipeline.star').then( (data) => res.json(data), (err) => console.log(err));
});

app.post('/star', (req, res,next) => {
  console.log('body: ');
  console.log(req.body);
  let fullpath = `${svzm.processes(req.body.process)}/job${req.body.job.toString().padStart(3,"0")}/${req.body.starfile}`;
  svzm.getSTAR(fullpath).then( (data) => res.json(data), (err) => console.log(err));
  // res.json({data:'cool', length: 22});
});

app.get('/test', (req, res,next) => {
  res.sendFile(path.join(__dirname, './test/00_index.html'));
});

app.get('/test/:file',  (req, res,next) => {
  res.sendFile(path.join(__dirname, `./test/${req.params.file}`));
});


// Routes - JSON response
app.get('/Class2D/:job/', (req, res,next) => {
  console.log('Class2D');
  // TODO
  let id = parseInt(req.params.job.match(/\d+/g)[0]);
  svzm.getClass2D(5)(`./Class2D/${req.params.job}/run_it025_data.star`).then( (data) => res.json(data), (err) => console.log(err));

  // res.send(json);
  // svzm.getSTAR(`./Class2D/${req.params.job}/run_it025_model.star`).then( (data) => data, (err) => console.log(err));
});

app.get('/MotionCorr/:job', (req, res,next) => {
  // TODO
  let id = parseInt(req.params.job.match(/\d+/g)[0]);
  res.json({"id": id, "type": "MotionCorr", "name": req.params.job}) 
});


