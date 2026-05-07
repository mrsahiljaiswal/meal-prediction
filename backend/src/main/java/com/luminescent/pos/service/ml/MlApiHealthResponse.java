package com.luminescent.pos.service.ml;

public class MlApiHealthResponse {
    private boolean ok;
    private Integer predictionsCount;
    private String error;

    public MlApiHealthResponse() {
    }

    public static MlApiHealthResponse ok(int predictionsCount) {
        MlApiHealthResponse r = new MlApiHealthResponse();
        r.ok = true;
        r.predictionsCount = predictionsCount;
        return r;
    }

    public static MlApiHealthResponse error(String error) {
        MlApiHealthResponse r = new MlApiHealthResponse();
        r.ok = false;
        r.error = error;
        return r;
    }

    public boolean isOk() {
        return ok;
    }

    public void setOk(boolean ok) {
        this.ok = ok;
    }

    public Integer getPredictionsCount() {
        return predictionsCount;
    }

    public void setPredictionsCount(Integer predictionsCount) {
        this.predictionsCount = predictionsCount;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}

