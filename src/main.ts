import './style.css'
import { addIVA, removeIVA } from './iva-calculator'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Calculadora de IVA</h1>
    
    <div class="calculator-section">
      <div>
        <h2>Sumar IVA</h2>
        <div class="input-group">
          <div class="input-wrapper amount">
            <label>Precio sin IVA:</label>
            <input type="number" id="baseAmount" value="100" step="1" min="0" />
          </div>
          <div class="input-wrapper">
            <label>Porcentaje de IVA:</label>
            <input type="number" id="addIvaRate" value="16" step="1" min="0" max="100" />
          </div>
        </div>
      </div>
      <div id="addResult" class="result-box">
        <h3>Resultado</h3>
      </div>
    </div>

    <div class="calculator-section">
      <div>
        <h2>Quitar IVA</h2>
        <div class="input-group">
          <div class="input-wrapper amount">
            <label>Precio con IVA:</label>
            <input type="number" id="totalAmount" value="100" step="1" min="0" />
          </div>
          <div class="input-wrapper">
            <label>Porcentaje de IVA:</label>
            <input type="number" id="removeIvaRate" value="16" step="1" min="0" max="100" />
          </div>
        </div>
      </div>
      <div id="removeResult" class="result-box">
        <h3>Resultado</h3>
      </div> 
    </div>
  </div>
`

const baseAmountInput = document.querySelector<HTMLInputElement>('#baseAmount')!
const totalAmountInput = document.querySelector<HTMLInputElement>('#totalAmount')!
const addIvaRateInput = document.querySelector<HTMLInputElement>('#addIvaRate')!
const removeIvaRateInput = document.querySelector<HTMLInputElement>('#removeIvaRate')!
const addResultDiv = document.querySelector<HTMLDivElement>('#addResult')!
const removeResultDiv = document.querySelector<HTMLDivElement>('#removeResult')!

function formatCurrency(amount: number): string {
  return `${amount.toFixed(3)}`
}

async function copyToClipboard(text: string, button: HTMLElement) {
  try {
    await navigator.clipboard.writeText(text);
    button.classList.add('copied');
    button.innerHTML = '✓';
    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = '⧉';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

function calculateAddIVA() {
  const amount = Number(baseAmountInput.value)
  const rate = Number(addIvaRateInput.value) / 100
  const ratePercentage = Number(addIvaRateInput.value)
  
  if (amount >= 0 && rate >= 0) {
    const ivaAmount = Number((amount * rate).toFixed(2))
    const total = Number((amount + ivaAmount).toFixed(2))
    const createCopyButton = (value: number) => `<span>${value.toFixed(2)} $<button class="copy-button" onclick="window.copyToClipboard('${value.toFixed(2)}', this)">⧉</button></span>`
    
    addResultDiv.innerHTML = `
      <div class="result-item">
        <span class="result-label">Cantidad sin IVA:</span>
        ${createCopyButton(amount)}
      </div>
      <div class="result-item">
        <span class="result-label">IVA (${ratePercentage}%):</span>
        ${createCopyButton(ivaAmount)}
      </div>
      <div class="result-item">
        <span class="result-label">Total:</span>
        ${createCopyButton(total)}
      </div>
    `
  }
}

function calculateRemoveIVA() {
  const total = Number(totalAmountInput.value)
  const rate = Number(removeIvaRateInput.value) / 100
  const ratePercentage = Number(removeIvaRateInput.value)
  
  if (total >= 0 && rate >= 0) {
    const baseAmount = Number((total / (1 + rate)).toFixed(2))
    const ivaAmount = Number((total - baseAmount).toFixed(2))
    const createCopyButton = (value: number) => `<span>${value.toFixed(2)} $<button class="copy-button" onclick="window.copyToClipboard('${value.toFixed(2)}', this)">⧉</button></span>`
    
    removeResultDiv.innerHTML = `
      <div class="result-item">
        <span class="result-label">Total:</span>
        ${createCopyButton(total)}
      </div>
      <div class="result-item">
        <span class="result-label">IVA (${ratePercentage}%):</span>
        ${createCopyButton(ivaAmount)}
      </div>
      <div class="result-item">
        <span class="result-label">Cantidad sin IVA:</span>
        ${createCopyButton(baseAmount)}
      </div>
    `
  }
}

// Make copyToClipboard available globally
declare global {
  interface Window {
    copyToClipboard: (text: string, button: HTMLElement) => Promise<void>;
  }
}
window.copyToClipboard = copyToClipboard;
baseAmountInput.addEventListener('input', calculateAddIVA)
addIvaRateInput.addEventListener('input', calculateAddIVA)
totalAmountInput.addEventListener('input', calculateRemoveIVA)
removeIvaRateInput.addEventListener('input', calculateRemoveIVA)

// Handle arrow keys
function handleArrowKeys(event: KeyboardEvent, input: HTMLInputElement) {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()
    const currentValue = Number(input.value)
    const step = event.key === 'ArrowUp' ? 1 : -1    
    input.value = Math.max(0, Math.round(currentValue + step)).toString()
    input.dispatchEvent(new Event('input'))
  }
}

baseAmountInput.addEventListener('keydown', (e) => handleArrowKeys(e, baseAmountInput))
totalAmountInput.addEventListener('keydown', (e) => handleArrowKeys(e, totalAmountInput))
addIvaRateInput.addEventListener('keydown', (e) => handleArrowKeys(e, addIvaRateInput))
removeIvaRateInput.addEventListener('keydown', (e) => handleArrowKeys(e, removeIvaRateInput))

// Calculate initial results
calculateAddIVA()
calculateRemoveIVA()