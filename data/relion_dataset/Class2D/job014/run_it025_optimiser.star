# RELION optimiser
# --o Class2D/job014/run --i ./Select/job013/particles.star --dont_combine_weights_via_disc --preread_images --pool 3 --ctf --iter 25 --tau2_fudge 2 --particle_diameter 200 --K 100 --flatten_solvent --zero_mask --oversampling 1 --psi_step 12 --offset_range 5 --offset_step 2 --norm --scale --j 6 --gpu 0:1:2:3 

data_optimiser_general

_rlnOutputRootName                                    Class2D/job014/run
_rlnModelStarFile                                     Class2D/job014/run_it025_model.star
_rlnExperimentalDataStarFile                          Class2D/job014/run_it025_data.star
_rlnOrientSamplingStarFile                            Class2D/job014/run_it025_sampling.star
_rlnCurrentIteration                                            25
_rlnNumberOfIterations                                          25
_rlnDoSplitRandomHalves                                          0
_rlnJoinHalvesUntilThisResolution                        -1.000000
_rlnAdaptiveOversampleOrder                                      1
_rlnAdaptiveOversampleFraction                            0.999000
_rlnRandomSeed                                          1497002358
_rlnParticleDiameter                                    200.000000
_rlnWidthMaskEdge                                                5
_rlnDoZeroMask                                                   1
_rlnDoSolventFlattening                                          1
_rlnSolventMaskName                                   None
_rlnSolventMask2Name                                  None
_rlnTauSpectrumName                                   None
_rlnCoarseImageSize                                             56
_rlnMaximumCoarseImageSize                                     100
_rlnHighresLimitExpectation                              -1.000000
_rlnIncrementImageSize                                          10
_rlnDoMapEstimation                                              1
_rlnDoStochasticGradientDescent                                  0
_rlnSgdMuFactor                                           0.000000
_rlnSgdSigma2FudgeInitial                                 8.000000
_rlnSgdSigma2FudgeHalflife                                      -1
_rlnSgdNextSubset                                                1
_rlnSgdSubsetSize                                               -1
_rlnSgdWriteEverySubset                                         -1
_rlnSgdMaxSubsets                                               -1
_rlnSgdStepsize                                           0.500000
_rlnHighresLimitSGD                                      20.000000
_rlnDoAutoRefine                                                 0
_rlnAutoLocalSearchesHealpixOrder                                4
_rlnNumberOfIterWithoutResolutionGain                            1
_rlnBestResolutionThusFar                                 0.101695
_rlnNumberOfIterWithoutChangingAssignments                       1
_rlnDoSkipAlign                                                  0
_rlnDoSkipRotate                                                 0
_rlnOverallAccuracyRotations                              1.700000
_rlnOverallAccuracyTranslations                           0.400000
_rlnChangesOptimalOrientations                           24.049607
_rlnChangesOptimalOffsets                                 0.628923
_rlnChangesOptimalClasses                                 0.182155
_rlnSmallestChangesOrientations                          15.507724
_rlnSmallestChangesOffsets                                0.410111
_rlnSmallestChangesClasses                                       0
_rlnLocalSymmetryFile                                 None
_rlnDoHelicalRefine                                              0
_rlnIgnoreHelicalSymmetry                                        0
_rlnHelicalTwistInitial                                   0.000000
_rlnHelicalRiseInitial                                    0.000000
_rlnHelicalCentralProportion                              0.300000
_rlnHelicalMaskTubeInnerDiameter                         -1.000000
_rlnHelicalMaskTubeOuterDiameter                         -1.000000
_rlnHelicalSymmetryLocalRefinement                               0
_rlnHelicalSigmaDistance                                 -1.000000
_rlnHelicalKeepTiltPriorFixed                                    0
_rlnHasConverged                                                 0
_rlnHasHighFscAtResolLimit                                       0
_rlnHasLargeSizeIncreaseIterationsAgo                            0
_rlnDoCorrectNorm                                                1
_rlnDoCorrectScale                                               1
_rlnDoCorrectCtf                                                 1
_rlnDoRealignMovies                                              0
_rlnDoIgnoreCtfUntilFirstPeak                                    0
_rlnCtfDataArePhaseFlipped                                       0
_rlnCtfDataAreCtfPremultiplied                                   0
_rlnDoOnlyFlipCtfPhases                                          0
_rlnRefsAreCtfCorrected                                          1
_rlnFixSigmaNoiseEstimates                                       0
_rlnFixSigmaOffsetEstimates                                      0
_rlnMaxNumberOfPooledParticles                                  18
 