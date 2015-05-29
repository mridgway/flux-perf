import { Dispatcher } from 'flux';
import {EventEmitter} from 'events';

const dispatcher = new Dispatcher();

const newMessage = (content) => {
    dispatcher.dispatch({
        type: 'NEW_MESSAGE',
        content: content
    })
};

class MessageStore extends EventEmitter {
    constructor() {
        super();

        this.messageCounter = 0;
        this.state = {};
    }

    handler(action) {
        switch (action.type) {
            case 'NEW_MESSAGE':
                this.handleNewMessage(action);
                break;
            default:

        }
    }

    handleNewMessage(payload) {
        const content = payload.content;
        const id = this.messageCounter++;

        this.state[id] = {
            content,
            id
        };
        this.emit('change');
    }
}


let store = new MessageStore();
let resolve;
store.on('change', function () {
    resolve && resolve(store.state);
});

dispatcher.register(store.handler.bind(store));
export default {
    isomorphic: function () {
        // Poor man's isomorphic: reset the store values
        store.messageCounter = 0;
        store.state = {};

        return new Promise(function (resolve) {
            var listener = function () {
                store.removeListener('change', listener);
                resolve(store.state);
            };
            store.on('change', listener);
            newMessage('Hello, world!');
        });
    },
    singleton: function () {
        return new Promise(function (r) {
            resolve = r;
            newMessage('Hello, world!');
        });
    }
};
