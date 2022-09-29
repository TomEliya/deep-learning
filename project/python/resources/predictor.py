from flask_jwt_extended import jwt_required
from flask_restful import Resource, reqparse

from ml_model.fake_reviews_ann import DetectFakeReviews

dfr = DetectFakeReviews("./ml_model/electronics.csv")  # for electronics


class Predictor(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("predict", type=str, required=True, help="This field cannot be left blank!")

    @jwt_required()
    def post(self):
        data = Predictor.parser.parse_args()
        return {"msg": dfr.predict_value(data["predict"])}, 200
