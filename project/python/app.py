from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_jwt_extended import JWTManager, jwt_required

from resources.user import UserLogin
from resources.predictor import Predictor


app = Flask(__name__)
app.config["PROPAGATE_EXCEPTIONS"] = True
app.secret_key = "thisIsFakeReviewsProject"
api = Api(app)

jwt = JWTManager(app)


api.add_resource(Predictor, "/predict")
api.add_resource(UserLogin, "/login")


if __name__ == "__main__":
    app.run(port=5000, debug=True, threaded=True)
