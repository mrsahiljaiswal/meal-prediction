package com.luminescent.pos.dto;

import java.util.List;

public class ModelVsActualResponse {
    private int sampleSize;
    private double meanAbsoluteError;
    private double meanAbsolutePercentageError;
    private List<ModelVsActualPoint> points;

    public ModelVsActualResponse(int sampleSize,
                                 double meanAbsoluteError,
                                 double meanAbsolutePercentageError,
                                 List<ModelVsActualPoint> points) {
        this.sampleSize = sampleSize;
        this.meanAbsoluteError = meanAbsoluteError;
        this.meanAbsolutePercentageError = meanAbsolutePercentageError;
        this.points = points;
    }

    public int getSampleSize() {
        return sampleSize;
    }

    public void setSampleSize(int sampleSize) {
        this.sampleSize = sampleSize;
    }

    public double getMeanAbsoluteError() {
        return meanAbsoluteError;
    }

    public void setMeanAbsoluteError(double meanAbsoluteError) {
        this.meanAbsoluteError = meanAbsoluteError;
    }

    public double getMeanAbsolutePercentageError() {
        return meanAbsolutePercentageError;
    }

    public void setMeanAbsolutePercentageError(double meanAbsolutePercentageError) {
        this.meanAbsolutePercentageError = meanAbsolutePercentageError;
    }

    public List<ModelVsActualPoint> getPoints() {
        return points;
    }

    public void setPoints(List<ModelVsActualPoint> points) {
        this.points = points;
    }
}

