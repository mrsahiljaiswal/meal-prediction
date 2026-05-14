package com.luminescent.pos.dto;

import java.util.List;

public class ModelVsActualResponse {
    private int sampleSize;
    private double meanAbsoluteError;
    private double meanAbsolutePercentageError;
    private double rSquared;
    private List<ModelVsActualPoint> points;

    public ModelVsActualResponse(int sampleSize,
                                 double meanAbsoluteError,
                                 double meanAbsolutePercentageError,
                                 double rSquared,
                                 List<ModelVsActualPoint> points) {
        this.sampleSize = sampleSize;
        this.meanAbsoluteError = meanAbsoluteError;
        this.meanAbsolutePercentageError = meanAbsolutePercentageError;
        this.rSquared = rSquared;
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

    public double getRSquared() {
        return rSquared;
    }

    public void setRSquared(double rSquared) {
        this.rSquared = rSquared;
    }

    public List<ModelVsActualPoint> getPoints() {
        return points;
    }

    public void setPoints(List<ModelVsActualPoint> points) {
        this.points = points;
    }
}

