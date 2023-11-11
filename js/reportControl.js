import { financeControl } from "./financeControl.js";
import { clearChart, generateChart } from "./generateChart.js";
import { reformatDate } from "./helpers.js";
import { OverlayScrollbars } from "./overlayscrollbars.esm.min.js";
import { delData, getData } from "./service.js";
import { storage } from "./storage.js";

const typesOperation = {
    income: 'доход',
    expenses: 'расход',
}

let actualData = [];

const report = document.querySelector('.report');
const financeReport = document.querySelector('.finance__report');
const reportTable = document.querySelector('.report__table');
const reportOperationList = document.querySelector('.report__operation-list');
const reportDates = document.querySelector('.report__dates');
const generateChartButton = document.querySelector('#generateChartButton');

OverlayScrollbars(report, {})

const closeReport = ({ target }) => {
    if (
        target.closest('.report__close') ||
    (!target.closest('.report') && target !== financeReport)
    ) {
        
    gsap.to(report, {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        ease: "power1.in",
        onComplete() {
            report.style.visibility = 'hidden';
        }
    });

        document.removeEventListener('click', closeReport);
    }
};

const openReport = () => {
    report.style.visibility = 'visible';

    gsap.to(report, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power1.out",
    });

    document.addEventListener('click', closeReport);
};


const renderReport = (data) => {
    reportOperationList.textContent = '';

    const reportRows = data.map(
        ({ category, amount, description, date, type, id }) => {
        const reportRow = document.createElement('tr');
        reportRow.classList.add('report__row');

        reportRow.innerHTML = `
            <td class="report__cell">${category}</td>
            <td class="report__cell" style="text-align: right">${amount.toLocaleString()}&nbsp;₽</td>
            <td class="report__cell">${description}</td>
            <td class="report__cell">${reformatDate(date)}</td>
            <td class="report__cell">${typesOperation[type]}</td>
            <td class="report__action-cell">
                <button
                    class="report__button report__button_table" data-del=${id}>&#10006;</button>
            </td>
        `;

        return reportRow;
    });

    reportOperationList.append(...reportRows);
};

export const reportControl = () => {
    reportTable.addEventListener('click', async ({ target }) => {
        const targetDel = target.closest('.report__button_table');

        if (targetDel) {
            await delData(`/finance/${targetDel.dataset.del}`);

            const reportRow = targetDel.closest('.report__row');
            reportRow.remove();
            financeControl();
            clearChart();
        };

        const targetSort = target.closest('[data-sort]');
        if (targetSort) {
            const sortField = targetSort.dataset.sort;
            
            renderReport(
                [...storage.data].sort((a, b) => {
                    if (targetSort.dataset.dir === 'up') {
                        [a, b] = [b, a];
                    }

                    if (sortField === 'amount') {
                    return parseFloat(a[sortField]) < parseFloat(b[sortField]) ? -1 : 1;
                    }
                    return a[sortField] < b[sortField] ? -1 : 1;
                }),
            );
            
            if (targetSort.dataset.dir === 'up') {
                targetSort.dataset.dir = 'down'
            } else {
                targetSort.dataset.dir = 'up'
            }
        }
    });

    financeReport.addEventListener('click', async () => {
        const textContent = financeReport.textContent;
        financeReport.textContent = 'Loading';
        financeReport.disabled = true;
    
        actualData = await getData('/finance');

        storage.actualData = actualData;
    
        financeReport.textContent = textContent;
        financeReport.disabled = false;
    
        renderReport(actualData);
        openReport();
    });
    
    reportDates.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const formData = Object.fromEntries(new FormData(reportDates));
    
        const searchParams = new URLSearchParams();
    
        if (formData.startDate) {
            searchParams.append('startDate', formData.startDate);
        }
    
        if (formData.endDate) {
            searchParams.append('endDate', formData.endDate);
        }
    
        const queryString = searchParams.toString();
    
        const url = queryString ? `/finance?${queryString}` : "/finance";
    
        actualData = await getData(url);
        renderReport(actualData);
        clearChart();
    });
};

generateChartButton.addEventListener('click', () => {
    generateChart(actualData);
});