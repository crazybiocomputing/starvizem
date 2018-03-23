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
 

'use script';

const express = require('express');
const fs = require('fs');
const path = require('path');
const svzm = require('./routes/starvizem.js');

const port = 3000;
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

// Start server with express.js
// Now we can listen on port 3000 and report if there are any errors in doing so.
app.listen(port, function (error) {
  if(error) {
      console.log(error);
  }
  console.log('Open your browser at http://localhost:3000.\nCTRL+C to exit');
});

// 3- Routes
app.get('/',  (req, res,next) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// Routes - JSON response
app.get('/Class2D/:job', (req, res,next) => {
  // TODO
  let id = parseInt(req.params.job.match(/\d+/g)[0]);
  res.json({"id": id, "type": "Class2D", "name": req.params.job}) 
});

app.get('/MotionCorr/:job', (req, res,next) => {
  // TODO
  let id = parseInt(req.params.job.match(/\d+/g)[0]);
  res.json({"id": id, "type": "MotionCorr", "name": req.params.job}) 
});


