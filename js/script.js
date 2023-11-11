import { datalistControl } from "./datalistControl.js";
import { financeControl } from "./financeControl.js"
import { reportControl } from "./reportControl.js";

const init = () => {
    financeControl();
    reportControl();
    datalistControl();
};

init();