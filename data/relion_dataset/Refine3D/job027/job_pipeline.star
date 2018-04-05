
data_pipeline_general

_rlnPipeLineJobCounter                       2
 

data_pipeline_processes

loop_ 
_rlnPipeLineProcessName #1 
_rlnPipeLineProcessAlias #2 
_rlnPipeLineProcessType #3 
_rlnPipeLineProcessStatus #4 
Refine3D/job027/       None           10            0 
 

data_pipeline_nodes

loop_ 
_rlnPipeLineNodeName #1 
_rlnPipeLineNodeType #2 
./Polish/job026/shiny.star            3 
./Class3D/job018/run_it025_class002.mrc            6 
Refine3D/job027/run_data.star            3 
Refine3D/job027/run_class001.mrc            6 
Refine3D/job027/run_half1_class001_unfil.mrc           10 
 

data_pipeline_input_edges

loop_ 
_rlnPipeLineEdgeFromNode #1 
_rlnPipeLineEdgeProcess #2 
./Polish/job026/shiny.star Refine3D/job027/ 
./Class3D/job018/run_it025_class002.mrc Refine3D/job027/ 
 

data_pipeline_output_edges

loop_ 
_rlnPipeLineEdgeProcess #1 
_rlnPipeLineEdgeToNode #2 
Refine3D/job027/ Refine3D/job027/run_data.star 
Refine3D/job027/ Refine3D/job027/run_class001.mrc 
Refine3D/job027/ Refine3D/job027/run_half1_class001_unfil.mrc 
 
