import Alt from 'alt';

class MyAlt extends Alt {
    constructor(config) {
        super(config);
        this.createActions(MessageActions);
        this.createStore(MessageStore);
    }
}

class MessageActions {
    newMessage(content) {
        this.dispatch(content)
    }
}

class MessageStore {
    constructor() {
        this.bindListeners({
            handleNewMessage: this.alt.getActions('MessageActions').newMessage
        });

        this.messageCounter = 0;
        this.state = {};
    }

    handleNewMessage(content) {
        const id = this.messageCounter++;

        this.state[id] = {
            content,
            id
        };
    }
}

var singleton = new MyAlt();
var resolve;
singleton.getStore('MessageStore').listen(function (store) {
    resolve && resolve(store.state);
});

export default {
    isomorphic: function () {
        var flux = new MyAlt();
        // perform action
        return new Promise(function (resolve) {
            flux.getStore('MessageStore').listen(function (store) {
                resolve(store.state);
            });

            flux.getActions('MessageActions').newMessage('Hello, world!');
        });

    },
    singleton: function () {
        return new Promise(function (r) {
            resolve = r;
            singleton.getActions('MessageActions').newMessage('Hello, world!');
        });
    }
};
