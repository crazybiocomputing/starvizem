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


const fs = require('fs');

/**
 * Read and Parse STAR data headers
 *
 * @params {string} data - STAR data
 * @return {object} 
 *
 * @author Pauline Bock
 */
const readSTARHeader = (filestats) => (data) => { 

  // STAR parser - only headers, size, etc.
  const parse = (input) => {

    // Init variables
    let block;
    let status = 0;
    
    // Default parameter
    let star = {
      comment : "Created by StarVizEM",
      date: (new Date()).toString().split(' ').splice(1,4).join('/'),
      mtime: filestats.mtime,
      tables : []
    };

    // Cleanup: Deleting spaces
    let lines = input.replace(/^\s*\n/gm, "").split('\n');
    
    // For each line, extract the keywords: `data_`, `loop_`, and `_xxx`
    lines.forEach( (line,index) => {
      let words = line.trim().split(/\s+/); 
      
      // Data block
      if (words[0].substr(0,5) === 'data_'){
        // Create a new data block structure 
        block = {
          name : words[0].substr(5,words[0].length) || 'None', // ??
          headers : [],
          mx : 0,
          my : 0,
          type : 0 // 0: single line; 1: loop
        };
        star.tables.push(block);
      }
      // Keyword `loop_`
      else if (words[0].substr(0,5) === 'loop_') {
        block.type = 1;  
      }
      // Column headers and type == 'single row'
      else if (words[0][0] === '_' && block.type === 0){
        block.headers.push(words[0]);
        block.mx = 1;
        block.my = 1;
        // Create new Column
        block.data.push([isNaN(words[1]) ? words[1] : parseFloat(words[1])]);
      }
      // Column headers and type == 'multi-rows'
      else if (words[0][0] === '_' && block.type === 1){
        block.headers.push(words[0]);
        block.mx++;
      }
      else {
        block.my++;
      }
    });
    return star;
  }

  //Parse StarFile

  return parse(data);
}


/**
 * Read and Parse STAR data
 *
 * @params {string} data - STAR data
 * @return {object} A data structure suitable for STARVizEM 
 *
 * @author Pauline Bock
 */
const readSTAR = (filestats) => (data) => { 

  // STAR parser
  const parse = (input) => {

    // Init variables
    let block;
    
    // Default parameters
    let star = {
      comment : "Created by StarVizEM",
      date: (new Date()).toString().split(' ').splice(1,4).join('/'),
      mtime: filestats.mtime,
      tables : []
    };

    // Get rows/lines
    let lines = input.split('\n');

    // For each line, extract the keywords: `data_`, `loop_`, and `_xxx`
    lines.forEach( (line,index) => {
      if (line.trim().length !== 0) {
      
        let words = line.trim().split(/\s+/); 
        
        // Data block
        if (words[0].substr(0,5) === 'data_'){
          // Create a new data block structure 
          block = {
            name : words[0].substr(5,words[0].length) || 'None', // ??
            headers : [],
            data : [],
            mx : 0,
            my : 0,
            type : 0 // 0: single line; 1: loop
          };
          star.tables.push(block);
        }

        // Keyword `loop_`
        else if (words[0].substr(0,5) === 'loop_') {
          block.type = 1;  
        }
        // Column headers and type == 'single row'
        else if (words[0][0] === '_' && block.type === 0){
          block.headers.push(words[0]);
          block.mx = 1;
          block.my = 1;
          // Create new Column
          block.data.push([isNaN(words[1]) ? words[1] : parseFloat(words[1])]);
        }
        // Column headers and type == 'multi-rows'
        else if (words[0][0] === '_' && block.type === 1){
          block.headers.push(words[0]);
          block.mx++;
          // Create new Column
          block.data.push([]);
        }
        else {
          block.my++;
          // For each column of the data block 
          for (let col in words) {
            let v = words[col];
            block.data[col].push(isNaN(v) ? v : parseFloat(v));
          }
        }
      }
    });
    return star;
  }

  
  //MAIN - Parse StarFile
  return parse(data);
}


/**
 * Get STAR file
 *
 * @author Jean-Christophe Taveau
 */
exports.getSTAR = (filename) => {
  console.log(filename);
  // Get file stats
  let stats = fs.statSync(filename);
  return fs.readFileAsync(filename, "utf-8").then(readSTAR(stats), (err) => console.log(err));
};

exports.readSTAR = readSTAR;
exports.readSTARHeader = readSTARHeader;

/*
 * Nodes Types in RELION
 * @see https://github.com/3dem/relion/blob/master/src/pipeline_jobs.h
 */
exports.IMPORT        = 0; // Import any file as a Node of a given type
exports.MOTIONCORR    = 1; // Import any file as a Node of a given type
exports.CTFFIND       = 2; // Estimate CTF parameters from micrographs for either entire micrographs and/or particles
exports.MANUALPICK    = 3; // Manually pick particle coordinates from micrographs
exports.AUTOPICK      = 4; // Automatically pick particle coordinates from micrographs, their CTF and 2D references
exports.EXTRACT       = 5; // Window particles, normalize, downsize etc from micrographs (also combine CTF into metadata file)
exports.SORT          = 6; // Sort particles based on their Z-scores
exports.CLASSSELECT   = 7; // Read in model.star file, and let user interactively select classes through the display (later: auto-selection as well)
exports.CLASS2D       = 8; // 2D classification (from input particles)
exports.CLASS3D       = 9; // 3D classification (from input 2D/3D particles, an input 3D-reference, and possibly a 3D mask)
exports.REFINE3D      = 10; // 3D auto-refine (from input particles, an input 3Dreference, and possibly a 3D mask)
exports.POLISH        = 11; // Particle-polishing (from movie-particles)
exports.MASKCREATE    = 12; // Process to create masks from input maps
exports.JOINSTAR      = 13; // Process to create masks from input maps
exports.SUBTRACT      = 14; // Process to subtract projections of parts of the reference from experimental images
exports.POST          = 15; // Post-processing (from unfiltered half-maps and a possibly a 3D mask)
exports.RESMAP        = 16; // Local resolution estimation (from unfiltered half-maps and a 3D mask)
exports.MOVIEREFINE   = 17; // Movie-particle extraction and refinement combined
exports.INIMODEL      = 18; // De-novo generation of 3D initial model (using SGD)


exports.NODE_MOVIES        = 0; // 2D micrograph movie(s), e.g. Falcon001_movie.mrcs or micrograph_movies.star
exports.NODE_MICS          = 1; // 2D micrograph(s), possibly with CTF information as well, e.g. Falcon001.mrc or micrographs.star
exports.NODE_MIC_COORDS    = 2; // Suffix for particle coordinates in micrographs (e.g. autopick.star or .box)
exports.NODE_PART_DATA     = 3; // A metadata (STAR) file with particles (e.g. particles.star or run1_data.star)
exports.NODE_MOVIE_DATA    = 4; // A metadata (STAR) file with particle movie-frames (e.g. particles_movie.star or run1_ct27_data.star)
exports.NODE_2DREFS        = 5; // A STAR file with one or multiple 2D references, e.g. autopick_references.star
exports.NODE_3DREF         = 6; // A single 3D-reference, e.g. map.mrc
exports.NODE_MASK          = 7; // 3D mask, e.g. mask.mrc or masks.star
exports.NODE_MODEL         = 8; // A model STAR-file for class selection
exports.NODE_OPTIMISER     = 9; // An optimiser STAR-file for job continuation
exports.NODE_HALFMAP      = 10; // Unfiltered half-maps from 3D auto-refine, e.g. run1_half?_class001_unfil.mrc
exports.NODE_FINALMAP     = 11; // Sharpened final map from post-processing (cannot be used as input)
exports.NODE_RESMAP       = 12; // Resmap with local resolution (cannot be used as input)
exports.NODE_PDF_LOGFILE  = 13; //PDF logfile


/*
 * The Node class represents data and metadata that are either input to or output from Processes
 * Nodes are connected to each by Edges:
 * - the fromEdgeList are connections with Nodes earlier (higher up) in the pipeline
 * - the toEdgeList are connections with Nodes later (lower down) in the pipeline
 *
 * Nodes could be of the following types:
 * In https://github.com/3dem/relion/blob/master/src/pipeline_jobs.h
 *

#define NODE_MOVIES        0 // 2D micrograph movie(s), e.g. Falcon001_movie.mrcs or micrograph_movies.star
#define NODE_MICS          1 // 2D micrograph(s), possibly with CTF information as well, e.g. Falcon001.mrc or micrographs.star
#define NODE_MIC_COORDS    2 // Suffix for particle coordinates in micrographs (e.g. autopick.star or .box)
#define NODE_PART_DATA     3 // A metadata (STAR) file with particles (e.g. particles.star or run1_data.star)
#define NODE_MOVIE_DATA    4 // A metadata (STAR) file with particle movie-frames (e.g. particles_movie.star or run1_ct27_data.star)
#define NODE_2DREFS        5 // A STAR file with one or multiple 2D references, e.g. autopick_references.star
#define NODE_3DREF         6 // A single 3D-reference, e.g. map.mrc
#define NODE_MASK          7 // 3D mask, e.g. mask.mrc or masks.star
#define NODE_MODEL         8 // A model STAR-file for class selection
#define NODE_OPTIMISER     9 // An optimiser STAR-file for job continuation
#define NODE_HALFMAP      10 // Unfiltered half-maps from 3D auto-refine, e.g. run1_half?_class001_unfil.mrc
#define NODE_FINALMAP     11 // Sharpened final map from post-processing (cannot be used as input)
#define NODE_RESMAP       12 // Resmap with local resolution (cannot be used as input)
#define NODE_PDF_LOGFILE  13 //PDF logfile

// All the different types of jobs defined inside the pipeline
#define PROC_IMPORT        0 // Import any file as a Node of a given type
#define PROC_MOTIONCORR    1 // Import any file as a Node of a given type
#define PROC_CTFFIND       2 // Estimate CTF parameters from micrographs for either entire micrographs and/or particles
#define PROC_MANUALPICK    3 // Manually pick particle coordinates from micrographs
#define PROC_AUTOPICK      4 // Automatically pick particle coordinates from micrographs, their CTF and 2D references
#define PROC_EXTRACT       5 // Window particles, normalize, downsize etc from micrographs (also combine CTF into metadata file)
#define PROC_SORT          6 // Sort particles based on their Z-scores
#define PROC_CLASSSELECT   7 // Read in model.star file, and let user interactively select classes through the display (later: auto-selection as well)
#define PROC_2DCLASS       8 // 2D classification (from input particles)
#define PROC_3DCLASS       9 // 3D classification (from input 2D/3D particles, an input 3D-reference, and possibly a 3D mask)
#define PROC_3DAUTO       10 // 3D auto-refine (from input particles, an input 3Dreference, and possibly a 3D mask)
#define PROC_POLISH       11 // Particle-polishing (from movie-particles)
#define PROC_MASKCREATE   12 // Process to create masks from input maps
#define PROC_JOINSTAR     13 // Process to create masks from input maps
#define PROC_SUBTRACT     14 // Process to subtract projections of parts of the reference from experimental images
#define PROC_POST         15 // Post-processing (from unfiltered half-maps and a possibly a 3D mask)
#define PROC_RESMAP       16 // Local resolution estimation (from unfiltered half-maps and a 3D mask)
#define PROC_MOVIEREFINE  17 // Movie-particle extraction and refinement combined
#define PROC_INIMODEL     18 // De-novo generation of 3D initial model (using SGD)
#define NR_BROWSE_TABS    19

 */
 
