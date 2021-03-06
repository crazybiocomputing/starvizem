
data_pipeline_general

_rlnPipeLineJobCounter                      15
 

data_pipeline_processes

loop_ 
_rlnPipeLineProcessName #1 
_rlnPipeLineProcessAlias #2 
_rlnPipeLineProcessType #3 
_rlnPipeLineProcessStatus #4 
Import/job001/ Import/movies/            0            2 
MotionCorr/job002/       None            1            2 
CtfFind/job003/       None            2            2 
ManualPick/job004/       None            3            2 
Extract/job005/ Extract/manualpick/            5            2 
Class2D/job006/ Class2D/manualpick/            8            2 
Select/job007/ Select/templates4autopick/            7            2 
Select/job008/ Select/2mics4autopick/            7            2 
AutoPick/job009/ AutoPick/optimise_params/            4            2 
AutoPick/job010/ AutoPick/allmics/            4            2 
Extract/job011/ Extract/allmics_autopicked/            5            2 
Sort/job012/ Sort/after_autopick/            6            2 
Select/job013/ Select/after_sorting/            7            2 
Class2D/job014/       None            8            0 
 

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
Select/job008/micrographs_selected.star            1 
./Select/job008/micrographs_selected.star            1 
./Select/job007/class_averages.star            5 
AutoPick/job009/coords_suffix_autopick.star            2 
AutoPick/job010/coords_suffix_autopick.star            2 
./AutoPick/job010/coords_suffix_autopick.star            2 
Extract/job011/particles.star            3 
./Extract/job011/particles.star            3 
Sort/job012/particles_sort.star            3 
./Sort/job012/particles_sort.star            3 
Select/job013/particles.star            3 
./Select/job013/particles.star            3 
Class2D/job014/run_it025_data.star            3 
Class2D/job014/run_it025_model.star            8 
 

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
ManualPick/job004/coords_suffix_manualpick.star Select/job008/ 
./Select/job008/micrographs_selected.star AutoPick/job009/ 
./Select/job007/class_averages.star AutoPick/job009/ 
CtfFind/job003/micrographs_ctf.star AutoPick/job010/ 
./Select/job007/class_averages.star AutoPick/job010/ 
CtfFind/job003/micrographs_ctf.star Extract/job011/ 
./AutoPick/job010/coords_suffix_autopick.star Extract/job011/ 
./Extract/job011/particles.star Sort/job012/ 
./Select/job007/class_averages.star Sort/job012/ 
./Sort/job012/particles_sort.star Select/job013/ 
./Select/job013/particles.star Class2D/job014/ 
 

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
Select/job007/ ./Select/job007/class_averages.star 
Select/job008/ Select/job008/micrographs_selected.star 
Select/job008/ ./Select/job008/micrographs_selected.star 
AutoPick/job009/ AutoPick/job009/coords_suffix_autopick.star 
AutoPick/job010/ AutoPick/job010/coords_suffix_autopick.star 
AutoPick/job010/ ./AutoPick/job010/coords_suffix_autopick.star 
Extract/job011/ Extract/job011/particles.star 
Extract/job011/ ./Extract/job011/particles.star 
Sort/job012/ Sort/job012/particles_sort.star 
Sort/job012/ ./Sort/job012/particles_sort.star 
Select/job013/ Select/job013/particles.star 
Select/job013/ ./Select/job013/particles.star 
Class2D/job014/ Class2D/job014/run_it025_data.star 
Class2D/job014/ Class2D/job014/run_it025_model.star 
 
