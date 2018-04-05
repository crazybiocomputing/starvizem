
data_pipeline_general

_rlnPipeLineJobCounter                       2
 

data_pipeline_processes

loop_ 
_rlnPipeLineProcessName #1 
_rlnPipeLineProcessAlias #2 
_rlnPipeLineProcessType #3 
_rlnPipeLineProcessStatus #4 
Select/job015/       None            7            0 
 

data_pipeline_nodes

loop_ 
_rlnPipeLineNodeName #1 
_rlnPipeLineNodeType #2 
Class2D/job014/run_it025_model.star            8 
Select/job015/particles.star            3 
Select/job015/class_averages.star            5 
 

data_pipeline_input_edges

loop_ 
_rlnPipeLineEdgeFromNode #1 
_rlnPipeLineEdgeProcess #2 
Class2D/job014/run_it025_model.star Select/job015/ 
 

data_pipeline_output_edges

loop_ 
_rlnPipeLineEdgeProcess #1 
_rlnPipeLineEdgeToNode #2 
Select/job015/ Select/job015/particles.star 
Select/job015/ Select/job015/class_averages.star 
 
