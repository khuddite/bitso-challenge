const formatGasFee = (gasFee: string, ethPrice: number) => {
  return `${Intl.NumberFormat(undefined, {
    style: "decimal",
    maximumFractionDigits: 6,
  }).format(Number(gasFee))} ETH / ${Intl.NumberFormat(undefined, {
    style: "decimal",
    maximumFractionDigits: 2,
  }).format(Number(gasFee) * ethPrice)} USD`;
};

export default formatGasFee;
