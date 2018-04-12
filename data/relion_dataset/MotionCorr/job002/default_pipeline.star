
data_pipeline_general

_rlnPipeLineJobCounter                       3
 

data_pipeline_processes

loop_ 
_rlnPipeLineProcessName #1 
_rlnPipeLineProcessAlias #2 
_rlnPipeLineProcessType #3 
_rlnPipeLineProcessStatus #4 
Import/job001/       None            0            2 
MotionCorr/job002/       None            1            0 
 

data_pipeline_nodes

loop_ 
_rlnPipeLineNodeName #1 
_rlnPipeLineNodeType #2 
Import/job001/movies.star            0 
./Import/job001/movies.star            0 
MotionCorr/job002/corrected_micrographs.star            1 
MotionCorr/job002/corrected_micrograph_movies.star            0 
MotionCorr/job002/logfile.pdf           13 
 

data_pipeline_input_edges

loop_ 
_rlnPipeLineEdgeFromNode #1 
_rlnPipeLineEdgeProcess #2 
./Import/job001/movies.star MotionCorr/job002/ 
 

data_pipeline_output_edges

loop_ 
_rlnPipeLineEdgeProcess #1 
_rlnPipeLineEdgeToNode #2 
Import/job001/ Import/job001/movies.star 
Import/job001/ ./Import/job001/movies.star 
MotionCorr/job002/ MotionCorr/job002/corrected_micrographs.star 
MotionCorr/job002/ MotionCorr/job002/corrected_micrograph_movies.star 
MotionCorr/job002/ MotionCorr/job002/logfile.pdf 
 
