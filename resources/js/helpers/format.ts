const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};
const formatCurrency = (val?: string | number) => {
    if (val === undefined || val === null) return '-';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
};
const formatPercent = (num?: number | string) => {
    if (num === undefined || num === null) return '-';
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(n)) return '-';
    return `${n.toFixed(2)}%`;
};

export { formatCurrency, formatDate, formatPercent };
