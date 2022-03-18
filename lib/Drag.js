/**
 * Handles dragging unscheduled orders from the grid onto the schedule
 */
import { DragHelper, DateHelper, StringHelper } from '@bryntum/schedulerpro/schedulerpro.umd.js';

export default class Drag extends DragHelper {
    static get configurable() {
        return {
            // Don't drag the actual row element, clone it
            cloneTarget    : true,
            mode           : 'translateXY',
            // Only allow drag of unscheduled orders
            targetSelector : '.b-grid-row:not(.scheduled)',

            listeners : {
                dragstart : 'onOrderDragStart',
                drag      : 'onOrderDrag',
                drop      : 'onOrderDrop'
            }
        };
    }

    onOrderDragStart({ context }) {
        const
            me           = this,
            { schedule } = me,
            proxy        = context.element,
            order        = me.grid.getRecordFromElement(context.grabbed);

        // save a reference to the Order being dragged so we can access it later
        context.order = order;

        // Mutate dragged element (grid row) into an event bar
        proxy.classList.remove('b-grid-row');
        proxy.classList.add('b-sch-event-wrap');
        proxy.classList.add('b-sch-style-border');
        proxy.classList.add('b-unassigned-class');
        proxy.innerHTML = StringHelper.xss`
            <div class="b-sch-event b-has-content b-sch-event-withicon">
                <div class="b-sch-event-content">
                    <div>${order.name}</div>
                    <span class="validity-overlap"><i></i>No overlap</span>
                    <span class="validity-machine"><i></i>Start machine: ${order.orderStartMachine.name}</span>
                </div>
            </div>
        `;

        schedule.enableScrollingCloseToEdges(schedule.timeAxisSubGrid);

        proxy.style.width = '150px';

        // Prevent tooltips from showing while dragging
        schedule.element.classList.add('b-dragging-event');
        schedule.element.classList.add('b-mask-incompatible-rows');

        context.validityOverlapIcon  = proxy.querySelector('.validity-overlap i');
        context.validityResourceIcon = proxy.querySelector('.validity-machine i');

        // Only allow drops on the machine specific to the start task of the order, blur out others (in CSS
        me.dropTargetSelector             = `.b-timeline-subgrid .b-grid-row[data-id="${context.order.orderStartMachine.id}"]`;
        context.order.orderStartMachine.cls = 'compatible';
    }

    onOrderDrag({ context }) {
        const
            date      = this.schedule.getDateFromCoordinate(context.newX, 'round', false),
            // Only allow drops of an order onto the first machine which creates the chain of production tasks
            available = date && this.schedule.eventStore.isDateRangeAvailable(date, DateHelper.add(date, context.order.firstTask.duration, 'h'), null, context.order.orderStartMachine);

        context.validityResourceIcon.className = `b-fa b-fa-fw b-fa-${context.valid ? 'check' : 'times'}`;
        context.validityOverlapIcon.className = `b-fa b-fa-fw b-fa-${available ? 'check' : 'times'}`;
        context.valid                         = context.valid && available;
    }

    // Drop callback after a mouse up, take action and transfer the unplanned Order to the real EventStore (if it's valid)
    async onOrderDrop({ context }) {
        const
            me           = this,
            { schedule } = me,
            { target }   = context;

        schedule.disableScrollingCloseToEdges(schedule.timeAxisSubGrid);

        // If drop was done in a valid location, set the startDate and transfer the task to the Scheduler event store
        if (context.valid && target) {
            const
                date = schedule.getDateFromCoordinate(context.newX, 'round', false);

            // Suspending refresh to not have multiple redraws from date change and assignments (will animate weirdly)
            schedule.suspendRefresh();

            schedule.project.scheduleOrder(context.order, date);

            // No longer suspending refresh, all operations have finished
            schedule.resumeRefresh();

            // Redraw, wihout transitions to not delay dependency drawing
            schedule.refresh();

            // Finalize the drag operation
            context.finalize();
        }
        // Dropped somewhere undesired, abort
        else {
            me.abort();
        }

        schedule.element.classList.remove('b-dragging-event');
        schedule.element.classList.remove('b-mask-incompatible-rows');
        context.order.orderStartMachine.cls = '';
    }
};
