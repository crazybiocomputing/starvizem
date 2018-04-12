
data_pipeline_general

_rlnPipeLineJobCounter                      19
 

data_pipeline_processes

loop_ 
_rlnPipeLineProcessName #1 
_rlnPipeLineProcessAlias #2 
_rlnPipeLineProcessType #3 
_rlnPipeLineProcessStatus #4 
InitialModel/job019/       None           18            2 
 

data_pipeline_nodes

loop_ 
_rlnPipeLineNodeName #1 
_rlnPipeLineNodeType #2 
InitialModel/job019/run_it003_data.star            3 
InitialModel/job019/run_it003_model.star            8 
InitialModel/job019/run_it003_class001.mrc            6 
 

data_pipeline_input_edges

loop_ 
_rlnPipeLineEdgeFromNode #1 
_rlnPipeLineEdgeProcess #2 
./Select/job015/particles.star InitialModel/job019/ 
 

data_pipeline_output_edges

loop_ 
_rlnPipeLineEdgeProcess #1 
_rlnPipeLineEdgeToNode #2 
InitialModel/job019/ InitialModel/job019/run_it003_data.star 
InitialModel/job019/ InitialModel/job019/run_it003_model.star 
InitialModel/job019/ InitialModel/job019/run_it003_class001.mrc 
 
