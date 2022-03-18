/**
 * Custom Task model, based on EventModel with additional fields
 */
import { EventModel } from '@bryntum/schedulerpro/schedulerpro.umd.js';

export default class Task extends EventModel {
    static get fields() {
        return [
            { name : 'durationUnit', defaultValue : 'h' },
            'orderId'
        ];
    }

    get order() {
        return this.project.getCrudStore('orders').getById(this.orderId);
    }

    get orderSize() {
        return this.order?.size;
    }

    get eventColor() {
        return this.order?.eventColor;
    }
}
