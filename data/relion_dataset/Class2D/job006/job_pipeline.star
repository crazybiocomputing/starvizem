
data_pipeline_general

_rlnPipeLineJobCounter                       2
 

data_pipeline_processes

loop_ 
_rlnPipeLineProcessName #1 
_rlnPipeLineProcessAlias #2 
_rlnPipeLineProcessType #3 
_rlnPipeLineProcessStatus #4 
Class2D/job006/       None            8            0 
 

data_pipeline_nodes

loop_ 
_rlnPipeLineNodeName #1 
_rlnPipeLineNodeType #2 
Extract/job005/particles.star            3 
Class2D/job006/run_it025_data.star            3 
Class2D/job006/run_it025_model.star            8 
 

data_pipeline_input_edges

loop_ 
_rlnPipeLineEdgeFromNode #1 
_rlnPipeLineEdgeProcess #2 
Extract/job005/particles.star Class2D/job006/ 
 

data_pipeline_output_edges

loop_ 
_rlnPipeLineEdgeProcess #1 
_rlnPipeLineEdgeToNode #2 
Class2D/job006/ Class2D/job006/run_it025_data.star 
Class2D/job006/ Class2D/job006/run_it025_model.star 
 
