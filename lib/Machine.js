/**
 * Custom Machine model, based on ResourceModel with additional fields
 */
import { ResourceModel } from '@bryntum/schedulerpro/schedulerpro.umd.js';

// Custom Machine model, based on ResourceModel with additional fields
export default class Machine extends ResourceModel {
    static get fields() {
        return [
            'capacity',
            'running',
            'statusMessage'
        ];
    }
}
