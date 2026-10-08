export const lineTotal=i=>Number(i.quantity)*Number(i.unit_price)*(1-Number(i.discount_pct||0)/100)*(1+Number(i.tax_pct||0)/100);
export const quoteTotal=items=>Number(items.reduce((n,i)=>n+lineTotal(i),0).toFixed(2));
export const canConvert=(status,alreadyConverted)=>status==='ACCEPTED'&&!alreadyConverted;
export const canCancel=status=>status==='PENDING'||status==='CONFIRMED';
export const hasRole=(user,roles)=>Boolean(user&&roles.includes(user.role));
export function reserve(physical,reserved,quantity){if(quantity<=0||physical-reserved<quantity)throw Error('Insufficient available inventory');return{physical,reserved:reserved+quantity,available:physical-reserved-quantity}}
export function dispatch(physical,reserved,quantity){if(quantity<=0||physical<quantity||reserved<quantity)throw Error('Stock reservation mismatch');return{physical:physical-quantity,reserved:reserved-quantity,available:physical-reserved}}
export function canTransition(from,to){return(from==='DRAFT'&&['SENT','REJECTED'].includes(to))||(from==='SENT'&&['ACCEPTED','REJECTED'].includes(to))}
