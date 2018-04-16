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


const IMPORT        = 0; // Import any file as a Node of a given type
const MOTIONCORR    = 1; // Import any file as a Node of a given type
const CTFFIND       = 2; // Estimate CTF parameters from micrographs for either entire micrographs and/or particles
const MANUALPICK    = 3; // Manually pick particle coordinates from micrographs
const AUTOPICK      = 4; // Automatically pick particle coordinates from micrographs, their CTF and 2D references
const EXTRACT       = 5; // Window particles, normalize, downsize etc from micrographs (also combine CTF into metadata file)
const SORT          = 6; // Sort particles based on their Z-scores
const CLASSSELECT   = 7; // Read in model.star file, and let user interactively select classes through the display (later: auto-selection as well)
const CLASS2D       = 8; // 2D classification (from input particles)
const CLASS3D       = 9; // 3D classification (from input 2D/3D particles, an input 3D-reference, and possibly a 3D mask)
const REFINE3D      = 10; // 3D auto-refine (from input particles, an input 3Dreference, and possibly a 3D mask)
const POLISH        = 11; // Particle-polishing (from movie-particles)
const MASKCREATE    = 12; // Process to create masks from input maps
const JOINSTAR      = 13; // Process to create masks from input maps
const SUBTRACT      = 14; // Process to subtract projections of parts of the reference from experimental images
const POST          = 15; // Post-processing (from unfiltered half-maps and a possibly a 3D mask)
const RESMAP        = 16; // Local resolution estimation (from unfiltered half-maps and a 3D mask)
const MOVIEREFINE   = 17; // Movie-particle extraction and refinement combined
const INIMODEL      = 18; // De-novo generation of 3D initial model (using SGD)

const processes = [
  'Import', 
  'MotionCorr', 
  'Ctf Find', 
  'Manual Picking', 
  'Auto Picking', 
  'Extract', 
  'Sort', 
  'Select', 
  'Class 2D', 
  'Class 3D', 
  'Refine 3D',
  'Polish',
  'Mask Create',
  'Join STAR',
  'Subtract',
  'Post Processing', 
  'Local Res. Map', 
  'Movie Refine', 
  'Initial Model'
];

const getProcessName = (index) => processes[index];


