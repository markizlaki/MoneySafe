import { animationNumbers, convertStringNumber } from "./helpers.js";
import { getData, postData } from "./service.js";

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');

let amount = 0;

financeAmount.textContent = amount;

const addNewOperation = async (e) => {
        e.preventDefault();
        
        const typeOperation = e.submitter.dataset.typeOperation;

        const financeFormDate = Object.fromEntries(new FormData(financeForm));
        financeFormDate.type = typeOperation;

        const newOperation = await postData("/finance", financeFormDate);
        
        const changeAmount = Math.abs(convertStringNumber(newOperation.amount));
    
        if (typeOperation === 'income') {
            amount += changeAmount;
        }
    
        if (typeOperation === 'expenses') {
            amount -= changeAmount;
        }
        
        animationNumbers(financeAmount, amount);
        financeForm.reset();
    };

export const financeControl = async () => {
    const operations = await getData('/finance');

    amount = operations.reduce((acc, item) => {
        if (item.type === 'income') {
            acc += convertStringNumber(item.amount);
        }

        if (item.type === 'expenses') {
            acc -= convertStringNumber(item.amount);
        }

        return acc;
    }, 0);

    animationNumbers(financeAmount, amount);

    financeForm.addEventListener('submit', addNewOperation);
};
