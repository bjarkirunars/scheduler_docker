/**
 * Order form popup
 */
import { Popup, StringHelper } from '@bryntum/schedulerpro/schedulerpro.umd.js';

export default class OrderForm extends Popup {

    static get $name() {
        return 'OrderForm';
    }

    static get configurable() {
        return {
            title       : 'New order',
            rootElement : document.body,
            centered    : true,
            width       : '30em',
            defaults    : {
                labelWidth : '10em'
            },
            items : [
                {
                    type         : 'combo',
                    ref          : 'type',
                    valueField   : 'id',
                    displayField : 'name',
                    label        : 'Type',
                    name         : 'type',
                    listItemTpl  : template => StringHelper.xss`${template.name} (${template.children.length} tasks)`,
                    editable     : false,
                    required     : true,
                    pickerWidth  : '20em'
                },
                {
                    type        : 'text',
                    label       : 'Customer',
                    name        : 'customer',
                    placeholder : 'Customer Name',
                    required    : true
                },
                {
                    type  : 'number',
                    label : 'Order quantity',
                    step  : 10,
                    min   : 10,
                    value : 10,
                    name  : 'size'
                }
            ]
        };
    }

    construct() {
        super.construct(...arguments);

        const orderTypeCombo = this.widgetMap.type;

        orderTypeCombo.store = this.templateStore;
        orderTypeCombo.value = this.templateStore.first;
    }
};
