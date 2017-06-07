const bcrypt = require('bcryptjs');
const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.SANO_DATA_IP,
    port: process.env.SANO_DATA_PORT,
    database: process.env.SANO_DATA_DB,
    user: process.env.SANO_DATA_USER,
    password: process.env.SANO_DATA_PW
});

const queries = {
    "ADD_USER": "INSERT INTO responder (login, password) VALUES (?, ?)",
    "GET_USER": "SELECT login, password FROM responder WHERE login = ?",
    "GET_RESPONDERCOUNT": "SELECT COUNT(*) AS count FROM responder"
};

function query(query, args) {
    return new Promise((resolve, reject) => {
        pool.query(query, args, (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
}

function addUser(user) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.password, 8, function(err, hash) {
            if (err === null) {
                query(queries.ADD_USER, [user.login, hash])
                    .then(resultSet => {
                        resolve(true);
                    }).catch(error => reject(error))
            } else {
                reject(err);
            }
        });
    });
}

function validateUser(user) {
    return new Promise((resolve, reject) => {
        query(queries.GET_USER, [user.login])
            .then(resultSet => {
                if (resultSet.length === 0) reject("User does not exist");
                else bcrypt.compare(user.password, resultSet[0].password).then(res => {
                    if (res) resolve(true);
                    else reject("Wrong password");
                });
            })
            .catch(error => reject(error));
    });
}

function getAvailableResponderCount() {
    return new Promise((resolve, reject) => {
        query(queries.GET_RESPONDERCOUNT, [])
            .then(resultSet => {
                resolve(resultSet[0].count);
            })
            .catch(error => reject(error));
    });
}

function init(shell) {
    if (typeof(shell) !== "undefined") {
        shell.commands["adduser"] = new shell.Command("adduser <name> <password>", (par, done) => {
            addUser({
                login: par[0],
                password: par[1]
            })
                .then(() => {
                    shell.term("Added user");
                    done();
                })
                .catch((err) => {
                    shell.term("Error: %s", err);
                    done();
                });
        });
    }

    console.log("sano-data ok");

    return {
        addUser: addUser,
        validateUser: validateUser,
        getAvailableResponderCount: getAvailableResponderCount
    }
}

module.exports = init;