import Fluxible from 'fluxible';
import {BaseStore} from 'fluxible/addons';

const newMessage = (context, payload) => {
    context.dispatch('NEW_MESSAGE', payload);
};

class MessageStore extends BaseStore {
    constructor() {
        super();

        this.messageCounter = 0;

        this.state = {};
    }

    handleNewMessage(content) {
        const id = this.messageCounter++;

        this.state[id] = {
            content,
            id
        };
        this.emitChange();
    }
}

MessageStore.storeName = 'MessageStore';
MessageStore.handlers = {
    'NEW_MESSAGE': 'handleNewMessage'
};

const app = new Fluxible();

app.registerStore(MessageStore);

var singleton = app.createContext();
var resolve;
var store = singleton.getActionContext().getStore(MessageStore);
store.on('change', function () {
    resolve && resolve(store.state);
});

export default {
    isomorphic: function () {
        var context = app.createContext();
        var store = context.getActionContext().getStore(MessageStore);

        return new Promise(function (resolve) {
            store.on('change', function () {
                resolve(store.state);
            });
            context.executeAction(newMessage, 'Hello, world!');
        });
    },
    singleton: function () {
        return new Promise(function (r) {
            resolve = r;
            singleton.executeAction(newMessage, 'Hello, world!');
        });
    }
};
