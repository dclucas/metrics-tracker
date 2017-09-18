const maximumSignificantDigits = 3;
const maximumFractionDigits = 2;
// fixme: fix the 0.x case -- text is showing 3 digits instead of 2
export const formatPercentage = (x) => Number(x).toLocaleString(undefined,{style: 'percent', maximumSignificantDigits, maximumFractionDigits})
export const formatFraction = (x) => Number(x).toLocaleString(undefined,{maximumSignificantDigits, maximumFractionDigits})
