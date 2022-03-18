/**
 * Custom Task model, based on EventModel with additional fields
 */
import { GridRowModel } from '@bryntum/schedulerpro/schedulerpro.umd.js';

let orderCount = 1010;

export default class Order extends GridRowModel {
    static get fields() {
        return [
            'type',
            'name',
            'size',
            'customer',
            'firstTaskId',
            'lastTaskId'
        ];
    }

    get project() {
        return this.stores[0].crudManager;
    }

    get template() {
        return this.project.getCrudStore('templates').getById(this.type);
    }

    get templateName() {
        return this.template?.name;
    }

    get orderStartMachine() {
        return this.project.resourceStore.getById(this.template.firstChild.resourceId);
    }

    get isScheduled() {
        return Boolean(this.firstTask?.startDate);
    }

    get startDate() {
        return this.firstTask?.startDate;
    }

    get finishDate() {
        return this.lastTask?.endDate;
    }

    get firstTask() {
        if (this.firstTaskId) {
            return this.project.eventStore.getById(this.firstTaskId);
        }
        else {
            // Not scheduled, read from template
            return this.template.firstChild;
        }
    }

    get lastTask() {
        if (this.lastTaskId) {
            return this.project.eventStore.getById(this.lastTaskId);
        }
        else {
            // Not scheduled, read from template
            return this.template.lastChild;
        }
    }

    static generateNewOrderId() {
        return orderCount++;
    }
}
