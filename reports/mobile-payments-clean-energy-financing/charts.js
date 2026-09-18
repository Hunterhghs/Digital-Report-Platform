/* Report 2026-19: illustrative cash-flow model.
 * Independent of Chart.js; the reach chart uses accessible HTML bars.
 */
(function () {
  "use strict";
const collectionInput=document.querySelector('#collection');
const feeInput=document.querySelector('#fee');
const capitalInput=document.querySelector('#capital-rate');
const dollars=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
function modelValues(collection,fee,rate){let factor=0;for(let month=1;month<=18;month++)factor+=1/Math.pow(1+rate,month/12);const monthly=240/18*collection*(1-fee)-1;return{contribution:-165+monthly*factor,receipts:30+240*collection,fees:240*collection*fee,breakEven:(165+factor)/(240/18*(1-fee)*factor)};}
function updateModel(){const collection=Number(collectionInput.value)/100;const fee=Number(feeInput.value)/100;const rate=Number(capitalInput.value)/100;const value=modelValues(collection,fee,rate);document.querySelector('#collection-value').textContent=Math.round(collection*100)+'%';document.querySelector('#fee-value').textContent=(fee*100).toFixed(1)+'%';document.querySelector('#capital-value').textContent=Math.round(rate*100)+'%';document.querySelector('#contribution').textContent=(value.contribution>=0?'+':'−')+dollars(Math.abs(value.contribution));document.querySelector('#viability').textContent=value.contribution>=0?'Positive before central overhead, taxes and unmodelled risks.':'Negative at the selected assumptions, before central overhead and taxes.';document.querySelector('#receipts').textContent=dollars(value.receipts);document.querySelector('#fees').textContent=dollars(value.fees);document.querySelector('#break-even').textContent=(value.breakEven*100).toFixed(1)+'%'+(value.breakEven>1?' · above 100%':'');}
if(collectionInput){for(const input of [collectionInput,feeInput,capitalInput])input.addEventListener('input',updateModel);document.querySelector('#reset-model').addEventListener('click',()=>{collectionInput.value='90';feeInput.value='1.5';capitalInput.value='18';updateModel();});updateModel();}

})();
