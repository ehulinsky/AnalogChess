from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*")

# messages
@socketio.on("message")
def handle_message(message):
    print("received message: " + message)


@socketio.on("move")
def handle_json(json):
    print("move: " + str(json))


# socket connect
@socketio.on("connect")
def test_connect():
    print("Client connected")


# socket disconnect
@socketio.on("disconnect")
def test_disconnect():
    print("Client disconnected")


if __name__ == "__main__":
    socketio.run(app)
