const shortid = require('shortid');
const randomWords = require('random-words');

function RequestList(){
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
}

const requestList = new RequestList();

function createRequest(socketid) {
    return requestList.addRequest(socketid);
}

function init(data) {
    console.log("sano-dispatch ok");

    return {
        createRequest: createRequest
    }
}

module.exports = init;