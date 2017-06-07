const shortid = require('shortid');
const randomWords = require('random-words');
const waitTime = 5;

function RequestList(data){
    let self = this;

    this.requests = [];
    this.addRequest = function(socketid) {
        let newRequest = new DispatchRequest(socketid);

        self.requests.push(newRequest);

        return newRequest;
    };
    this.getRequestBySocketId = function(socketid) {
        return self.requests.find(function(item) {
            return item.socketid === socketid;
        });
    };
    this.getRequestById = function(id) {
        return self.requests.find(function(item) {
            return item.id === id;
        });
    };
    this.removeRequestBySocketId = function(socketid) {
        self.requests = self.requests.filter(function (item) {
            return item.socketid !== socketid;
        });
    };
}

function DispatchRequest(socketid) {
    this.socketid = socketid;
    this.id = shortid.generate();
    this.code = randomWords({exactly: 2, join: "-"});
    this.started = false;
    this.answered = false;
    this.allowEscalation = false;

    this.start = function() {
        this.started = true;
    };

    this.answer = function() {
        this.answered = true;
    };

    this.allowEscalate = function() {
        this.allowEscalation = true;
    };
}

const requestList = new RequestList();

function init(data, shell) {
    if (typeof(shell) !== "undefined") {
        shell.commands["showrequests"] = new shell.Command("Shows all current dispatch requests", (par, done) => {
            requestList.requests.forEach(function (item) {
                shell.term(JSON.stringify(item) + "\n");
            });

            shell.term("%s entries", requestList.requests.length);

            done();
        });
    }

    console.log("sano-dispatch ok");

    return {
        requestList: requestList,
        waitTime: waitTime
    }
}

module.exports = init;