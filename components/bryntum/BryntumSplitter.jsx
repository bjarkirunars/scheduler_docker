import { BryntumSplitter } from "@bryntum/schedulerpro-react";

export default function Scheduler({ schedulerRef, ...props }) {
  return <BryntumSplitter {...props} ref={schedulerRef} />;
}
