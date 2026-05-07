package com.luminescent.pos.service.ml;

import java.util.List;

public class MlPredictRequest {
    private List<MlPredictSample> samples;

    public List<MlPredictSample> getSamples() {
        return samples;
    }

    public void setSamples(List<MlPredictSample> samples) {
        this.samples = samples;
    }
}

