from flask import Flask
from flask import g, request

DATABASE = "yoyo.db"

# connecting to our db
def get_db():
    try:
        logmaker("daily").log("database connect", "INTERNAL")
        db = getattr(g, "_database", None)
        if db is None:
            db = g._database = sqlite3.connect(DATABASE)
        return db
    except Exception as e:
        logmaker("daily").log("failure - " + str(e), "INTERNAL")
        return "bad"


# executing a db change
def execute_db(cmd):
    try:
        logmaker("daily").log("database execute", "INTERNAL")
        con = sqlite3.connect(DATABASE)
        c = con.cursor()
        c.execute(cmd)
        con.commit()
    except Exception as e:
        logmaker("daily").log("failure - " + str(e), "INTERNAL")
        return "bad"


# probing db for data
def query_db(query, args=(), one=False):
    try:
        logmaker("daily").log("database query", "INTERNAL")
        cur = get_db().execute(query, args)
        rv = cur.fetchall()
        cur.close()
        return (rv[0] if rv else None) if one else rv
    except Exception as e:
        logmaker("daily").log("failure - " + str(e), "INTERNAL")
        return "bad"


app = Flask(__name__, instance_relative_config=True)


@app.route("/")
def main():
    return "server: bad route"


@app.route("/admin")
def admin():
    if (
        request.json["password"]
        == query_db(
            'SELECT password FROM users WHERE username="'
            + request.json["username"]
            + '"'
        )[0][0]
    ):
        return True
    else:
        return False


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    app.run(host="192.168.50.213", port=443, debug=True)
