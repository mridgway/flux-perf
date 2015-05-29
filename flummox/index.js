import { Actions, Store, Flummox } from 'flummox';

class MessageActions extends Actions {
    newMessage(content) {
        return content; // automatically dispatched
    }
}

class MessageStore extends Store {
    constructor(flux) {
        super();

        const messageActions = flux.getActions('messages');
        this.register(messageActions.newMessage, this.handleNewMessage);

        this.messageCounter = 0;
        this.state = {};
    }

    handleNewMessage(content) {
        const id = this.messageCounter++;

        this.state[id] = {
            content,
            id
        };
        this.emit('change');
    }
}

class Flux extends Flummox {
    constructor() {
        super();

        this.createActions('messages', MessageActions);
        this.createStore('messages', MessageStore, this);
    }
}

var singleton = new Flux();
var store = singleton.getStore('messages');
var resolve;
store.on('change', function () {
    resolve && resolve(store.state);
});

export default {
    isomorphic: function () {
        const flux = new Flux();

        // perform action
        return new Promise(function (resolve) {
            flux.getStore('messages').on('change', function () {
                resolve(flux.getStore('messages').state);
            });
            flux.getActions('messages').newMessage('Hello, world!');
        });

    },
    singleton: function () {
        // perform action
        return new Promise(function (r) {
            resolve = r;
            singleton.getActions('messages').newMessage('Hello, world!');
        });
    }
};
