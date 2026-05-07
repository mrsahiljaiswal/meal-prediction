package com.luminescent.pos.service.ml;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class MlPredictResponse {
    @JsonProperty("predictions")
    private List<MlPrediction> predictions;

    public List<MlPrediction> getPredictions() {
        return predictions;
    }

    public void setPredictions(List<MlPrediction> predictions) {
        this.predictions = predictions;
    }
}

