/**
 * Bilan Modern Work Shop - Cost Calculator & WhatsApp Quote Engine
 * Official Rates:
 * - Daaqad Aluminium: $45 / meter
 * - Daaqad PVC: $70 / meter
 * - Albaab Aluminium: $110 / meter
 * - Albaab PVC: $120 / meter
 * - Decoration (Xafiisyo, Jikooyin, Guryo): $200 / 1 meter
 * WhatsApp / Phone: +252618004826
 */

(function () {
  'use strict';

  // Constants & Rates
  const PHONE_NUMBER = '252618004826';
  const RATES = {
    daaqad_almunim: { name: 'Daaqad Aluminium', price: 45, unit: 'mitir' },
    daaqad_pvc: { name: 'Daaqad PVC', price: 70, unit: 'mitir' },
    albaab_almunim: { name: 'Albaab Aluminium', price: 110, unit: 'mitir' },
    albaab_pvc: { name: 'Albaab PVC', price: 120, unit: 'mitir' },
    decoration: { name: 'Decoration & Habeyn Casri ah', price: 200, unit: 'mitir' }
  };

  // State
  let currentMode = 'direct'; // 'direct' or 'dimensions'
  let cartItems = [];

  // DOM Elements
  const serviceRadios = document.querySelectorAll('input[name="serviceCategory"]');
  const modeDirectBtn = document.getElementById('modeDirectBtn');
  const modeDimensionsBtn = document.getElementById('modeDimensionsBtn');
  const directInputGroup = document.getElementById('directInputGroup');
  const dimensionsInputGroup = document.getElementById('dimensionsInputGroup');

  const meterInput = document.getElementById('meterInput');
  const quantityInput = document.getElementById('quantityInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');

  const widthInput = document.getElementById('widthInput');
  const heightInput = document.getElementById('heightInput');
  const dimensionQtyInput = document.getElementById('dimensionQtyInput');
  const calculatedSqMeters = document.getElementById('calculatedSqMeters');

  // Summary Elements
  const summaryServiceTitle = document.getElementById('summaryServiceTitle');
  const summaryUnitPrice = document.getElementById('summaryUnitPrice');
  const summaryTotalMeters = document.getElementById('summaryTotalMeters');
  const summaryQuantity = document.getElementById('summaryQuantity');
  const summaryGrandTotal = document.getElementById('summaryGrandTotal');

  const custNameInput = document.getElementById('custNameInput');
  const custBranchSelect = document.getElementById('custBranchSelect');
  const orderWhatsAppBtn = document.getElementById('orderWhatsAppBtn');

  // Multi-item Quote Elements
  const addItemBtn = document.getElementById('addItemBtn');
  const resetCurrentBtn = document.getElementById('resetCurrentBtn');
  const projectListCard = document.getElementById('projectListCard');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartCount = document.getElementById('cartCount');
  const cartGrandTotal = document.getElementById('cartGrandTotal');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const sendAllWhatsAppBtn = document.getElementById('sendAllWhatsAppBtn');

  // Helper: Get selected service
  function getSelectedService() {
    const selected = document.querySelector('input[name="serviceCategory"]:checked');
    const val = selected ? selected.value : 'daaqad_almunim';
    return RATES[val] || RATES.daaqad_almunim;
  }

  // Calculate current single item
  function getCurrentCalculation() {
    const service = getSelectedService();
    let meters = 0;
    let qty = 1;

    if (currentMode === 'direct') {
      meters = parseFloat(meterInput.value) || 0;
      qty = parseInt(quantityInput.value, 10) || 1;
    } else {
      const w = parseFloat(widthInput.value) || 0;
      const h = parseFloat(heightInput.value) || 0;
      meters = parseFloat((w * h).toFixed(2));
      qty = parseInt(dimensionQtyInput.value, 10) || 1;
      if (calculatedSqMeters) {
        calculatedSqMeters.textContent = `${meters} m² (${w}m × ${h}m)`;
      }
    }

    if (meters < 0) meters = 0;
    if (qty < 1) qty = 1;

    const total = parseFloat((meters * service.price * qty).toFixed(2));

    return {
      serviceName: service.name,
      unitPrice: service.price,
      meters: meters,
      qty: qty,
      total: total,
      mode: currentMode
    };
  }

  // Update Summary UI and WhatsApp link
  function updateUI() {
    const calc = getCurrentCalculation();

    if (summaryServiceTitle) summaryServiceTitle.textContent = calc.serviceName;
    if (summaryUnitPrice) summaryUnitPrice.textContent = `$${calc.unitPrice} / ${getSelectedService().unit}`;
    if (summaryTotalMeters) summaryTotalMeters.textContent = `${calc.meters} ${calc.mode === 'direct' ? 'm' : 'm²'}`;
    if (summaryQuantity) summaryQuantity.textContent = `${calc.qty} xabo`;
    if (summaryGrandTotal) summaryGrandTotal.textContent = `$${calc.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Build WhatsApp Message
    const customerName = custNameInput ? custNameInput.value.trim() : '';
    const selectedBranch = custBranchSelect ? custBranchSelect.value : 'Isgoyska Siinay';

    let message = `Asc Bilan Modern Work Shop 👋\n`;
    message += `Waxaan rabaa inaan dalbado shaqadan:\n\n`;
    message += `📋 *Adeegga:* ${calc.serviceName}\n`;
    message += `💵 *Qiimaha Mitirkii:* $${calc.unitPrice}\n`;
    message += `📐 *Cabirka:* ${calc.meters} ${calc.mode === 'direct' ? 'mitir' : 'm²'}\n`;
    message += `🔢 *Tirada:* ${calc.qty} xabo\n`;
    message += `💰 *Wadarta Qiimaha:* $${calc.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n`;
    message += `📍 *Xarunta la doortay:* ${selectedBranch}\n`;
    if (customerName) {
      message += `👤 *Magaca Macmiilka:* ${customerName}\n`;
    }
    message += `\nFadlan nala soo xiriira si cabir buuxa ama shaqada loo bilaabo. Mahadsanidiin!`;

    const encodedMsg = encodeURIComponent(message);
    if (orderWhatsAppBtn) {
      orderWhatsAppBtn.href = `https://wa.me/${PHONE_NUMBER}?text=${encodedMsg}`;
    }
  }

  // Mode Switchers
  if (modeDirectBtn && modeDimensionsBtn) {
    modeDirectBtn.addEventListener('click', () => {
      currentMode = 'direct';
      modeDirectBtn.className = 'px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold shadow-sm transition';
      modeDimensionsBtn.className = 'px-3 py-1.5 rounded-lg bg-white text-slate-600 border border-slate-300 font-medium hover:bg-slate-100 transition';
      directInputGroup.classList.remove('hidden');
      directInputGroup.classList.add('grid');
      dimensionsInputGroup.classList.add('hidden');
      dimensionsInputGroup.classList.remove('grid');
      updateUI();
    });

    modeDimensionsBtn.addEventListener('click', () => {
      currentMode = 'dimensions';
      modeDimensionsBtn.className = 'px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold shadow-sm transition';
      modeDirectBtn.className = 'px-3 py-1.5 rounded-lg bg-white text-slate-600 border border-slate-300 font-medium hover:bg-slate-100 transition';
      directInputGroup.classList.add('hidden');
      directInputGroup.classList.remove('grid');
      dimensionsInputGroup.classList.remove('hidden');
      dimensionsInputGroup.classList.add('grid');
      updateUI();
    });
  }

  // Quantity +/- Buttons
  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      let currentVal = parseInt(quantityInput.value, 10) || 1;
      if (currentVal > 1) {
        quantityInput.value = currentVal - 1;
        updateUI();
      }
    });
  }
  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      let currentVal = parseInt(quantityInput.value, 10) || 1;
      quantityInput.value = currentVal + 1;
      updateUI();
    });
  }

  // Event Listeners for inputs
  serviceRadios.forEach(radio => {
    radio.addEventListener('change', updateUI);
  });

  [meterInput, quantityInput, widthInput, heightInput, dimensionQtyInput, custNameInput, custBranchSelect].forEach(el => {
    if (el) {
      el.addEventListener('input', updateUI);
      el.addEventListener('change', updateUI);
    }
  });

  // Reset Button
  if (resetCurrentBtn) {
    resetCurrentBtn.addEventListener('click', () => {
      meterInput.value = '2.5';
      quantityInput.value = '1';
      widthInput.value = '1.5';
      heightInput.value = '1.2';
      dimensionQtyInput.value = '1';
      if (serviceRadios[0]) serviceRadios[0].checked = true;
      updateUI();
    });
  }

  // Add Item to Project Cart
  function renderCart() {
    if (!projectListCard || !cartItemsList) return;

    if (cartItems.length === 0) {
      projectListCard.classList.add('hidden');
      return;
    }

    projectListCard.classList.remove('hidden');
    cartItemsList.innerHTML = '';
    let grandTotal = 0;

    cartItems.forEach((item, index) => {
      grandTotal += item.total;
      const row = document.createElement('div');
      row.className = 'p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2';
      row.innerHTML = `
        <div class="truncate">
          <p class="font-bold text-slate-800 text-xs">${index + 1}. ${item.serviceName}</p>
          <p class="text-[11px] text-slate-500">${item.meters}m × $${item.unitPrice} × ${item.qty} xab.</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="font-bold text-blue-700 text-xs font-mono">$${item.total.toFixed(2)}</span>
          <button type="button" data-index="${index}" class="remove-cart-item text-red-500 hover:text-red-700 p-1 rounded transition" title="Tirtir">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
      cartItemsList.appendChild(row);
    });

    if (cartCount) cartCount.textContent = cartItems.length;
    if (cartGrandTotal) cartGrandTotal.textContent = `$${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Add remove listeners
    document.querySelectorAll('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        cartItems.splice(idx, 1);
        renderCart();
      });
    });
  }

  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      const calc = getCurrentCalculation();
      cartItems.push(calc);
      renderCart();

      // Show temporary badge feedback
      const originalText = addItemBtn.innerHTML;
      addItemBtn.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> Ku Guuleystay!';
      addItemBtn.classList.add('bg-emerald-700');
      setTimeout(() => {
        addItemBtn.innerHTML = originalText;
        addItemBtn.classList.remove('bg-emerald-700');
      }, 1500);
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Ma hubtaa inaad tirtirto dhammaan liiska dalabka?')) {
        cartItems = [];
        renderCart();
      }
    });
  }

  // Send Entire Cart to WhatsApp
  if (sendAllWhatsAppBtn) {
    sendAllWhatsAppBtn.addEventListener('click', () => {
      if (cartItems.length === 0) return;

      const customerName = custNameInput ? custNameInput.value.trim() : '';
      const selectedBranch = custBranchSelect ? custBranchSelect.value : 'Isgoyska Siinay';
      let totalSum = 0;

      let msg = `Asc Bilan Modern Work Shop 👋\n`;
      msg += `Waxaan rabaa inaan dalbado qandaraas/mashruuc ka kooban qodobadan soo socda:\n\n`;

      cartItems.forEach((item, i) => {
        totalSum += item.total;
        msg += `${i + 1}. *${item.serviceName}*\n`;
        msg += `   • Cabirka: ${item.meters} mitir × $${item.unitPrice} | Tirada: ${item.qty}\n`;
        msg += `   • Wadarta Qodobkan: $${item.total.toFixed(2)}\n\n`;
      });

      msg += `========================\n`;
      msg += `💰 *WADARTA GUUD EE MASHRUUCA:* $${totalSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n`;
      msg += `📍 *Xarunta la Doortay:* ${selectedBranch}\n`;
      if (customerName) {
        msg += `👤 *Magaca Macmiilka:* ${customerName}\n`;
      }
      msg += `\nFadlan nala soo xiriira si aan u xaqiijino cabirka rasmiga ah. Mahadsanidiin!`;

      const finalUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(finalUrl, '_blank');
    });
  }

  // Initial Calculation
  updateUI();

})();
