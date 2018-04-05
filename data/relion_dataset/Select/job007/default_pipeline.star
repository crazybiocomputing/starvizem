
data_pipeline_general

_rlnPipeLineJobCounter                       8
 

data_pipeline_processes

loop_ 
_rlnPipeLineProcessName #1 
_rlnPipeLineProcessAlias #2 
_rlnPipeLineProcessType #3 
_rlnPipeLineProcessStatus #4 
Import/job001/       None            0            2 
MotionCorr/job002/       None            1            2 
CtfFind/job003/       None            2            2 
ManualPick/job004/       None            3            2 
Extract/job005/       None            5            2 
Class2D/job006/       None            8            2 
Select/job007/       None            7            0 
 

data_pipeline_nodes

loop_ 
_rlnPipeLineNodeName #1 
_rlnPipeLineNodeType #2 
Import/job001/movies.star            0 
./Import/job001/movies.star            0 
MotionCorr/job002/corrected_micrographs.star            1 
MotionCorr/job002/corrected_micrograph_movies.star            0 
MotionCorr/job002/logfile.pdf           13 
CtfFind/job003/micrographs_ctf.star            1 
ManualPick/job004/coords_suffix_manualpick.star            2 
ManualPick/job004/micrographs_selected.star            1 
Extract/job005/particles.star            3 
Class2D/job006/run_it025_data.star            3 
Class2D/job006/run_it025_model.star            8 
Select/job007/particles.star            3 
Select/job007/class_averages.star            5 
 

data_pipeline_input_edges

loop_ 
_rlnPipeLineEdgeFromNode #1 
_rlnPipeLineEdgeProcess #2 
./Import/job001/movies.star MotionCorr/job002/ 
MotionCorr/job002/corrected_micrographs.star CtfFind/job003/ 
CtfFind/job003/micrographs_ctf.star ManualPick/job004/ 
CtfFind/job003/micrographs_ctf.star Extract/job005/ 
ManualPick/job004/coords_suffix_manualpick.star Extract/job005/ 
Extract/job005/particles.star Class2D/job006/ 
Class2D/job006/run_it025_model.star Select/job007/ 
 

data_pipeline_output_edges

loop_ 
_rlnPipeLineEdgeProcess #1 
_rlnPipeLineEdgeToNode #2 
Import/job001/ Import/job001/movies.star 
Import/job001/ ./Import/job001/movies.star 
MotionCorr/job002/ MotionCorr/job002/corrected_micrographs.star 
MotionCorr/job002/ MotionCorr/job002/corrected_micrograph_movies.star 
MotionCorr/job002/ MotionCorr/job002/logfile.pdf 
CtfFind/job003/ CtfFind/job003/micrographs_ctf.star 
ManualPick/job004/ ManualPick/job004/coords_suffix_manualpick.star 
ManualPick/job004/ ManualPick/job004/micrographs_selected.star 
Extract/job005/ Extract/job005/particles.star 
Class2D/job006/ Class2D/job006/run_it025_data.star 
Class2D/job006/ Class2D/job006/run_it025_model.star 
Select/job007/ Select/job007/particles.star 
Select/job007/ Select/job007/class_averages.star 
 
