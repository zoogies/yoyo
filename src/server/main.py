from flask import Flask
from flask import g, request
import sqlite3
import json
import datetime

DATABASE = "yoyo.db"

# connecting to our db
def get_db():
    try:
        db = getattr(g, "_database", None)
        if db is None:
            db = g._database = sqlite3.connect(DATABASE)
        return db
    except Exception as e:
        return "bad"


# executing a db change
def execute_db(cmd):
    try:
        con = sqlite3.connect(DATABASE)
        c = con.cursor()
        c.execute(cmd)
        con.commit()
    except Exception as e:
        return "bad"


# probing db for data
def query_db(query, args=(), one=False):
    try:
        cur = get_db().execute(query, args)
        rv = cur.fetchall()
        cur.close()
        return (rv[0] if rv else None) if one else rv
    except Exception as e:
        return "bad"


app = Flask(__name__, instance_relative_config=True)


@app.route("/")
def main():
    return "server: bad route"


@app.route("/auth", methods=["GET", "POST"])
def admin():
    if (
        request.json["password"]
        == query_db(
            'SELECT password FROM users WHERE username="'
            + request.json["username"]
            + '"'
        )[0][0]
    ):
        return str(True)
    else:
        return str(False)


@app.route("/getconversations", methods=["GET", "POST"])
def getconversations():
    return json.dumps(
        query_db(
            'SELECT * FROM conversations WHERE user1="'
            + request.json["username"]
            + '" OR user2 ="'
            + request.json["username"]
            + '"'
        )
    )


@app.route("/getmessages", methods=["GET", "POST"])
def getmessages():
    return json.dumps(
        query_db(
            'SELECT * FROM messages WHERE conversationid="'
            + request.json["conversation_id"]
            + '"'
        )
    )


@app.route("/sendmessage", methods=["GET", "POST"])
def sendmessage():
    try:
        execute_db(
            'INSERT INTO messages (conversationid,content,username,stamp) VALUES ("'
            + request.json["conversationid"]
            + '","'
            + request.json["content"]
            + '","'
            + request.json["username"]
            + '","'
            + str(datetime.datetime.now())[0:19]
            + '")'
        )
        return "done"
    except:
        return "failed"


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    app.run(host="192.168.50.213", port=5000, debug=True)
