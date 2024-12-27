const IVA_RATE = 0.16;

interface IVAResult {
  baseAmount: number;
  ivaAmount: number;
  totalAmount: number;
}

export function addIVA(baseAmount: number): IVAResult {
  const ivaAmount = baseAmount * IVA_RATE;
  const totalAmount = baseAmount + ivaAmount;
  
  return {
    baseAmount: Number(baseAmount.toFixed(2)),
    ivaAmount: Number(ivaAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2))
  };
}

export function removeIVA(totalAmount: number): IVAResult {
  const baseAmount = totalAmount / (1 + IVA_RATE);
  const ivaAmount = totalAmount - baseAmount;
  
  return {
    baseAmount: Number(baseAmount.toFixed(2)),
    ivaAmount: Number(ivaAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2))
  };
}