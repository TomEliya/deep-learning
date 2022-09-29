from flask_jwt_extended import create_access_token, create_refresh_token
from flask_restful import Resource, reqparse
from passlib.hash import sha256_crypt


class User:
    def __init__(self, _id, username, password):
        self.id = _id
        self.username = username
        self.password = password


user = User(1, "Tom", "$5$rounds=535000$lCje72viMpTNwyRi$74Mz6A7bnkI5wgHj9PogXxdPHiK2J3/5cORJfgTqK98") # TOMandhen123

_user_parser = reqparse.RequestParser()
_user_parser.add_argument("username", type=str, required=True, help="This field cannot be blank.")
_user_parser.add_argument("password", type=str, required=True, help="This field cannot be blank.")


class UserLogin(Resource):
    def post(self):
        try:
            global user
            data = _user_parser.parse_args()
            if user.username == data["username"] and sha256_crypt.verify(str(data["password"]), user.password):
                access_token = create_access_token(identity=user.id, fresh=True)
                refresh_token = create_refresh_token(user.id)
                return {"access_token": access_token, "refresh_token": refresh_token}, 200

            return {"massage": "Wrong username of password."}, 401

        except Exception as e:
            # in the future add a logger to output errors
            return {"massage": "Something went wrong."}
