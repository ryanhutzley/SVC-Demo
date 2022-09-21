from typing import Optional, List
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.svm import SVC
import numpy as np


class ModelData(BaseModel):
    xVals: List[int]
    yVals: List[int]
    labels: List[int]

app = FastAPI()

@app.post("/train")
def generate_svm(model_data: ModelData):
    data_dict = model_data.dict()
    points = [[data_dict['xVals'][i], data_dict['yVals'][i]] for i in range(len(data_dict['xVals']))]
    labels = data_dict['labels']
    model = SVC(kernel="linear")
    model.fit(points, labels)
    model_y_int = list(model.intercept_)[0]
    coef = list(model.coef_[0])
    x_min = min(min(data_dict['xVals']), 0)
    x_max = max(data_dict['xVals'])
    db_min_x = -(coef[0]/coef[1])*x_min - (model_y_int/coef[1])
    db_max_x = -(coef[0]/coef[1])*x_max - (model_y_int/coef[1])
    convert_point_to_dict = lambda v: {'x': v[0], 'y': v[1]}
    db_endpoints = [[x_min, db_min_x], [x_max, db_max_x]]
    db_endpoints_dicts = list(map(convert_point_to_dict, db_endpoints))
    support_vectors = list(map(convert_point_to_dict, model.support_vectors_))
    w_hat = model.coef_[0] / (np.sqrt(np.sum(model.coef_[0] ** 2)))
    margin = 1 / np.sqrt(np.sum(model.coef_[0] ** 2))
    db_margin_above = db_endpoints + w_hat * margin
    db_margin_below = db_endpoints - w_hat * margin
    db_margin_above_list = list(map(convert_point_to_dict, db_margin_above))
    db_margin_below_list = list(map(convert_point_to_dict, db_margin_below))
    return { "fitStatus": model.fit_status_, "modelAccuracy": float(model.score(points, labels)), "dbEndpoints": db_endpoints_dicts, "supportVectors": support_vectors, "margins": [db_margin_above_list, db_margin_below_list], "marginValue": round(float(margin),5) }