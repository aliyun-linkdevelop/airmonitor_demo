import { Page } from '@bone/bone-web-sdk';
import View from '../view/home';

class Model {
    add(state, step) {
        return {
            ...state,
            count: state.count + step
        };
    }

    minus(state, step) {
        return {
            ...state,
            count: state.count - step
        };
    }
}

export default class HomePage extends Page {
    constructor(namespace) {
        super(namespace);
        this.component = View;
        this.initWithAction({ count: 0 }, new Model());
    }
}