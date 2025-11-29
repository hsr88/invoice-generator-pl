// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = today;
    document.getElementById('saleDate').value = today;
    
    // Termin płatności - 14 dni
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
    
    // Event listeners
    document.getElementById('itemsContainer').addEventListener('input', calculateTotals);
    
    // Auto-formatowanie NIP
    document.getElementById('fromNIP').addEventListener('input', formatNIP);
    document.getElementById('toNIP').addEventListener('input', formatNIP);
    
    // Początkowe obliczenia
    calculateTotals();
    updateItemNumbers();
    
    // Inicjalizacja auto-numeracji
    updateNextInvoiceNumber();
    
    // Inicjalizacja bazy klientów
    loadClientsList();
    updateClientSelect();
    
    // Auto-save co 30 sekund
    startAutoSave();
    
    // Wczytaj ostatni draft jeśli istnieje
    loadAutoSavedDraft();
});

// ============================================
// AUTO-NUMERACJA FAKTUR
// ============================================

function updateNextInvoiceNumber() {
    const lastNumber = parseInt(localStorage.getItem('lastInvoiceNumber') || '0');
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const nextNumber = String(lastNumber + 1).padStart(3, '0');
    const nextInvoice = `FV/${nextNumber}/${month}/${year}`;
    
    document.getElementById('nextInvoiceNumber').textContent = nextInvoice;
    return nextInvoice;
}

function useNextInvoiceNumber() {
    const nextNumber = updateNextInvoiceNumber();
    document.getElementById('invoiceNumber').value = nextNumber;
    
    // Zapisz numer jako użyty
    const currentNumber = parseInt(localStorage.getItem('lastInvoiceNumber') || '0');
    localStorage.setItem('lastInvoiceNumber', currentNumber + 1);
    
    // Aktualizuj wyświetlany następny numer
    updateNextInvoiceNumber();
    
    // Pokaż feedback
    showNotification('Numer faktury został ustawiony!', 'success');
}

// ============================================
// AUTO-FORMATOWANIE NIP
// ============================================

function formatNIP(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    if (value.length >= 3) {
        value = value.substring(0, 3) + '-' + value.substring(3);
    }
    if (value.length >= 7) {
        value = value.substring(0, 7) + '-' + value.substring(7);
    }
    if (value.length >= 10) {
        value = value.substring(0, 10) + '-' + value.substring(10);
    }
    
    e.target.value = value;
}

// ============================================
// BAZA KLIENTÓW
// ============================================

let clientDatabase = [];

function loadClientsList() {
    const saved = localStorage.getItem('clientDatabase');
    if (saved) {
        clientDatabase = JSON.parse(saved);
    }
}

function saveClientsList() {
    localStorage.setItem('clientDatabase', JSON.stringify(clientDatabase));
}

function updateClientSelect() {
    const select = document.getElementById('clientSelect');
    select.innerHTML = '<option value="">Wybierz klienta...</option>';
    
    clientDatabase.forEach((client, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = client.name;
        select.appendChild(option);
    });
}

function loadClientData() {
    const select = document.getElementById('clientSelect');
    const index = select.value;
    
    if (index === '') return;
    
    const client = clientDatabase[index];
    
    document.getElementById('toCompany').value = client.name;
    document.getElementById('toNIP').value = client.nip || '';
    document.getElementById('toAddress').value = client.address || '';
    document.getElementById('toZip').value = client.zip || '';
    document.getElementById('toCity').value = client.city || '';
    document.getElementById('toEmail').value = client.email || '';
    
    showNotification('Dane klienta załadowane!', 'success');
}

function openClientDatabase() {
    renderClientList();
    document.getElementById('clientDatabaseModal').style.display = 'block';
}

function closeClientDatabase() {
    document.getElementById('clientDatabaseModal').style.display = 'none';
    document.getElementById('addClientForm').style.display = 'none';
}

function showAddClientForm() {
    document.getElementById('addClientForm').style.display = 'block';
}

function cancelAddClient() {
    document.getElementById('addClientForm').style.display = 'none';
    clearClientForm();
}

function clearClientForm() {
    document.getElementById('newClientName').value = '';
    document.getElementById('newClientNIP').value = '';
    document.getElementById('newClientAddress').value = '';
    document.getElementById('newClientZip').value = '';
    document.getElementById('newClientCity').value = '';
    document.getElementById('newClientEmail').value = '';
}

function saveNewClient() {
    const name = document.getElementById('newClientName').value;
    
    if (!name) {
        alert('Proszę podać nazwę klienta!');
        return;
    }
    
    const newClient = {
        name: name,
        nip: document.getElementById('newClientNIP').value,
        address: document.getElementById('newClientAddress').value,
        zip: document.getElementById('newClientZip').value,
        city: document.getElementById('newClientCity').value,
        email: document.getElementById('newClientEmail').value
    };
    
    clientDatabase.push(newClient);
    saveClientsList();
    updateClientSelect();
    renderClientList();
    cancelAddClient();
    
    showNotification('Klient został dodany!', 'success');
}

function renderClientList() {
    const container = document.getElementById('clientList');
    container.innerHTML = '';
    
    if (clientDatabase.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-text-dim); padding: 40px;">Brak zapisanych klientów</p>';
        return;
    }
    
    clientDatabase.forEach((client, index) => {
        const item = document.createElement('div');
        item.className = 'client-item';
        item.innerHTML = `
            <div class="client-info">
                <h4>${client.name}</h4>
                ${client.nip ? `<p>NIP: ${client.nip}</p>` : ''}
                ${client.city ? `<p>${client.city}</p>` : ''}
                ${client.email ? `<p>${client.email}</p>` : ''}
            </div>
            <div class="client-actions">
                <button class="btn-client-action use" onclick="useClient(${index})">Użyj</button>
                <button class="btn-client-action delete" onclick="deleteClient(${index})">Usuń</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function useClient(index) {
    const client = clientDatabase[index];
    
    document.getElementById('toCompany').value = client.name;
    document.getElementById('toNIP').value = client.nip || '';
    document.getElementById('toAddress').value = client.address || '';
    document.getElementById('toZip').value = client.zip || '';
    document.getElementById('toCity').value = client.city || '';
    document.getElementById('toEmail').value = client.email || '';
    
    closeClientDatabase();
    showNotification('Dane klienta załadowane!', 'success');
}

function deleteClient(index) {
    if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
        clientDatabase.splice(index, 1);
        saveClientsList();
        updateClientSelect();
        renderClientList();
        showNotification('Klient został usunięty!', 'success');
    }
}

// ============================================
// AUTO-SAVE
// ============================================

let autoSaveInterval;
let lastSaveData = null;

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        autoSaveCurrentState();
    }, 30000); // 30 sekund
}

function autoSaveCurrentState() {
    const currentData = {
        from: {
            company: document.getElementById('fromCompany').value,
            nip: document.getElementById('fromNIP').value,
            address: document.getElementById('fromAddress').value,
            zip: document.getElementById('fromZip').value,
            city: document.getElementById('fromCity').value,
            email: document.getElementById('fromEmail').value,
            phone: document.getElementById('fromPhone').value,
            bank: document.getElementById('fromBank').value
        },
        to: {
            company: document.getElementById('toCompany').value,
            nip: document.getElementById('toNIP').value,
            address: document.getElementById('toAddress').value,
            zip: document.getElementById('toZip').value,
            city: document.getElementById('toCity').value,
            email: document.getElementById('toEmail').value
        },
        invoice: {
            number: document.getElementById('invoiceNumber').value,
            date: document.getElementById('invoiceDate').value,
            saleDate: document.getElementById('saleDate').value,
            dueDate: document.getElementById('dueDate').value,
            paymentMethod: document.getElementById('paymentMethod').value
        },
        notes: document.getElementById('notes').value,
        timestamp: Date.now()
    };
    
    // Sprawdź czy są jakieś zmiany
    const dataString = JSON.stringify(currentData);
    if (dataString === lastSaveData) {
        return; // Brak zmian
    }
    
    // Zapisz
    updateAutoSaveStatus('saving');
    localStorage.setItem('invoiceDraft', dataString);
    lastSaveData = dataString;
    
    // Aktualizuj UI
    setTimeout(() => {
        updateAutoSaveStatus('saved');
        updateLastSaveTime();
    }, 500);
}

function loadAutoSavedDraft() {
    const saved = localStorage.getItem('invoiceDraft');
    if (!saved) return;
    
    if (confirm('Znaleziono zapisany draft. Czy chcesz go wczytać?')) {
        const data = JSON.parse(saved);
        
        // Wczytaj dane
        document.getElementById('fromCompany').value = data.from.company || '';
        document.getElementById('fromNIP').value = data.from.nip || '';
        document.getElementById('fromAddress').value = data.from.address || '';
        document.getElementById('fromZip').value = data.from.zip || '';
        document.getElementById('fromCity').value = data.from.city || '';
        document.getElementById('fromEmail').value = data.from.email || '';
        document.getElementById('fromPhone').value = data.from.phone || '';
        document.getElementById('fromBank').value = data.from.bank || '';
        
        document.getElementById('toCompany').value = data.to.company || '';
        document.getElementById('toNIP').value = data.to.nip || '';
        document.getElementById('toAddress').value = data.to.address || '';
        document.getElementById('toZip').value = data.to.zip || '';
        document.getElementById('toCity').value = data.to.city || '';
        document.getElementById('toEmail').value = data.to.email || '';
        
        document.getElementById('invoiceNumber').value = data.invoice.number || '';
        document.getElementById('invoiceDate').value = data.invoice.date || '';
        document.getElementById('saleDate').value = data.invoice.saleDate || '';
        document.getElementById('dueDate').value = data.invoice.dueDate || '';
        document.getElementById('paymentMethod').value = data.invoice.paymentMethod || '';
        
        document.getElementById('notes').value = data.notes || '';
        
        showNotification('Draft został wczytany!', 'success');
    }
}

function updateAutoSaveStatus(status) {
    const dot = document.getElementById('autoSaveDot');
    const text = document.getElementById('autoSaveStatus');
    
    dot.className = 'status-dot';
    
    switch(status) {
        case 'saving':
            dot.classList.add('saving');
            text.textContent = 'Zapisywanie...';
            break;
        case 'saved':
            text.textContent = 'Zapisano';
            setTimeout(() => {
                text.textContent = 'Gotowy';
            }, 2000);
            break;
        case 'error':
            dot.classList.add('error');
            text.textContent = 'Błąd';
            break;
    }
}

function updateLastSaveTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('lastSaveTime').textContent = timeString;
}

// ============================================
// POWIADOMIENIA
// ============================================

function showNotification(message, type = 'info') {
    // Prosta notyfikacja - możesz później dodać ładniejsze
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#5b7cff'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Dodaj style dla animacji
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// RESZTA KODU (bez zmian)
// ============================================


let itemCounter = 1;

// Dodaj pozycję
function addItem() {
    itemCounter++;
    const container = document.getElementById('itemsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item-card';
    newItem.innerHTML = `
        <div class="item-header">
            <span class="item-number">${itemCounter}</span>
            <button type="button" class="item-remove" onclick="removeItem(this)">×</button>
        </div>
        <div class="item-grid">
            <div class="input-group span-full">
                <label>Nazwa Towaru / Usługi *</label>
                <input type="text" class="item-name" placeholder="np. Usługi programistyczne">
            </div>
            <div class="input-group">
                <label>J.M.</label>
                <select class="item-unit">
                    <option value="szt.">szt.</option>
                    <option value="godz.">godz.</option>
                    <option value="usł.">usł.</option>
                    <option value="m">m</option>
                    <option value="m²">m²</option>
                    <option value="kg">kg</option>
                </select>
            </div>
            <div class="input-group">
                <label>Ilość</label>
                <input type="number" class="item-quantity" value="1" min="0" step="0.01">
            </div>
            <div class="input-group">
                <label>Cena Netto (PLN)</label>
                <input type="number" class="item-price" value="0" min="0" step="0.01">
            </div>
            <div class="input-group">
                <label>VAT (%)</label>
                <select class="item-vat">
                    <option value="23">23%</option>
                    <option value="8">8%</option>
                    <option value="5">5%</option>
                    <option value="0">0%</option>
                    <option value="zw">zw.</option>
                </select>
            </div>
            <div class="input-group">
                <label>Wartość Netto</label>
                <input type="text" class="item-netto" readonly>
            </div>
            <div class="input-group">
                <label>Kwota VAT</label>
                <input type="text" class="item-vat-amount" readonly>
            </div>
            <div class="input-group">
                <label>Wartość Brutto</label>
                <input type="text" class="item-brutto" readonly>
            </div>
        </div>
    `;
    container.appendChild(newItem);
    
    // Dodaj event listenery
    newItem.querySelector('.item-quantity').addEventListener('input', calculateTotals);
    newItem.querySelector('.item-price').addEventListener('input', calculateTotals);
    newItem.querySelector('.item-vat').addEventListener('change', calculateTotals);
}

// Usuń pozycję
function removeItem(button) {
    const container = document.getElementById('itemsContainer');
    if (container.children.length > 1) {
        button.closest('.item-card').remove();
        updateItemNumbers();
        calculateTotals();
    } else {
        alert('Faktura musi zawierać przynajmniej jedną pozycję!');
    }
}

// Aktualizuj numery pozycji
function updateItemNumbers() {
    const items = document.querySelectorAll('.item-number');
    items.forEach((item, index) => {
        item.textContent = index + 1;
    });
}

// Oblicz sumy
function calculateTotals() {
    let totalNetto = 0;
    let totalVAT = 0;
    
    const items = document.querySelectorAll('.item-card');
    items.forEach(item => {
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const vatRate = item.querySelector('.item-vat').value;
        
        const netto = quantity * price;
        let vat = 0;
        
        if (vatRate !== 'zw') {
            vat = (netto * parseFloat(vatRate)) / 100;
        }
        
        const brutto = netto + vat;
        
        // Aktualizuj pola
        item.querySelector('.item-netto').value = formatPLN(netto);
        item.querySelector('.item-vat-amount').value = formatPLN(vat);
        item.querySelector('.item-brutto').value = formatPLN(brutto);
        
        totalNetto += netto;
        totalVAT += vat;
    });
    
    const totalBrutto = totalNetto + totalVAT;
    
    // Aktualizuj podsumowanie
    document.getElementById('totalNetto').textContent = formatPLN(totalNetto);
    document.getElementById('totalVAT').textContent = formatPLN(totalVAT);
    document.getElementById('totalBrutto').textContent = formatPLN(totalBrutto);
}

// Formatowanie PLN
function formatPLN(amount) {
    return amount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' PLN';
}

// Formatowanie daty
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Walidacja
function validateForm() {
    const required = [
        { id: 'fromCompany', name: 'Nazwa firmy (sprzedawca)' },
        { id: 'fromNIP', name: 'NIP sprzedawcy' },
        { id: 'toCompany', name: 'Nazwa nabywcy' },
        { id: 'invoiceNumber', name: 'Numer faktury' },
        { id: 'invoiceDate', name: 'Data wystawienia' }
    ];
    
    for (let field of required) {
        if (!document.getElementById(field.id).value) {
            alert(`Proszę wypełnić pole: ${field.name}`);
            document.getElementById(field.id).focus();
            return false;
        }
    }
    
    // Sprawdź czy są pozycje
    const hasItems = Array.from(document.querySelectorAll('.item-name'))
        .some(input => input.value.trim() !== '');
    
    if (!hasItems) {
        alert('Dodaj przynajmniej jedną pozycję faktury!');
        return false;
    }
    
    return true;
}

// Pobierz dane
function getFormData() {
    const items = [];
    document.querySelectorAll('.item-card').forEach(item => {
        const name = item.querySelector('.item-name').value;
        const unit = item.querySelector('.item-unit').value;
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const vatRate = item.querySelector('.item-vat').value;
        
        if (name) {
            const netto = quantity * price;
            const vat = vatRate !== 'zw' ? (netto * parseFloat(vatRate)) / 100 : 0;
            const brutto = netto + vat;
            
            items.push({
                name, unit, quantity, price, vatRate, netto, vat, brutto
            });
        }
    });
    
    const totalNetto = items.reduce((sum, item) => sum + item.netto, 0);
    const totalVAT = items.reduce((sum, item) => sum + item.vat, 0);
    const totalBrutto = totalNetto + totalVAT;
    
    return {
        from: {
            company: document.getElementById('fromCompany').value,
            nip: document.getElementById('fromNIP').value,
            address: document.getElementById('fromAddress').value,
            zip: document.getElementById('fromZip').value,
            city: document.getElementById('fromCity').value,
            email: document.getElementById('fromEmail').value,
            phone: document.getElementById('fromPhone').value,
            bank: document.getElementById('fromBank').value
        },
        to: {
            company: document.getElementById('toCompany').value,
            nip: document.getElementById('toNIP').value,
            address: document.getElementById('toAddress').value,
            zip: document.getElementById('toZip').value,
            city: document.getElementById('toCity').value,
            email: document.getElementById('toEmail').value
        },
        invoice: {
            number: document.getElementById('invoiceNumber').value,
            date: document.getElementById('invoiceDate').value,
            saleDate: document.getElementById('saleDate').value,
            dueDate: document.getElementById('dueDate').value,
            paymentMethod: document.getElementById('paymentMethod').value
        },
        items: items,
        totals: { totalNetto, totalVAT, totalBrutto },
        notes: document.getElementById('notes').value
    };
}

// Podgląd
function previewInvoice() {
    if (!validateForm()) return;
    
    const data = getFormData();
    const preview = generateInvoiceHTML(data);
    
    document.getElementById('previewContainer').innerHTML = preview;
    document.getElementById('previewModal').style.display = 'block';
}

// Zamknij podgląd
function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

// Generuj HTML faktury
function generateInvoiceHTML(data) {
    let itemsHTML = '';
    data.items.forEach((item, index) => {
        itemsHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td style="text-align: center;">${item.unit}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${item.price.toFixed(2).replace('.', ',')} PLN</td>
                <td style="text-align: right;">${item.netto.toFixed(2).replace('.', ',')} PLN</td>
                <td style="text-align: center;">${item.vatRate === 'zw' ? 'zw.' : item.vatRate + '%'}</td>
                <td style="text-align: right;">${item.vat.toFixed(2).replace('.', ',')} PLN</td>
                <td style="text-align: right;"><strong>${item.brutto.toFixed(2).replace('.', ',')} PLN</strong></td>
            </tr>
        `;
    });
    
    return `
        <div class="invoice-preview">
            <div class="invoice-header">
                <div>
                    <div class="invoice-title">FAKTURA VAT</div>
                    <div class="invoice-number">${data.invoice.number}</div>
                </div>
                <div style="text-align: right;">
                    <div><strong>Data wystawienia:</strong> ${formatDate(data.invoice.date)}</div>
                    <div><strong>Data sprzedaży:</strong> ${formatDate(data.invoice.saleDate)}</div>
                    <div><strong>Termin płatności:</strong> ${formatDate(data.invoice.dueDate)}</div>
                </div>
            </div>
            
            <div class="invoice-parties">
                <div class="party-box">
                    <h3>Sprzedawca:</h3>
                    <p>
                        <strong>${data.from.company}</strong><br>
                        NIP: ${data.from.nip}<br>
                        ${data.from.address ? data.from.address + '<br>' : ''}
                        ${data.from.zip ? data.from.zip + ' ' : ''}${data.from.city || ''}<br>
                        ${data.from.email ? 'Email: ' + data.from.email + '<br>' : ''}
                        ${data.from.phone ? 'Tel: ' + data.from.phone + '<br>' : ''}
                        ${data.from.bank ? 'Konto: ' + data.from.bank : ''}
                    </p>
                </div>
                <div class="party-box">
                    <h3>Nabywca:</h3>
                    <p>
                        <strong>${data.to.company}</strong><br>
                        ${data.to.nip ? 'NIP: ' + data.to.nip + '<br>' : ''}
                        ${data.to.address ? data.to.address + '<br>' : ''}
                        ${data.to.zip ? data.to.zip + ' ' : ''}${data.to.city || ''}<br>
                        ${data.to.email ? 'Email: ' + data.to.email : ''}
                    </p>
                </div>
            </div>
            
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Lp.</th>
                        <th>Nazwa</th>
                        <th>J.m.</th>
                        <th>Ilość</th>
                        <th>Cena netto</th>
                        <th>Wartość netto</th>
                        <th>VAT</th>
                        <th>Kwota VAT</th>
                        <th>Wartość brutto</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
            
            <div class="invoice-totals">
                <div class="total-line">
                    <span>Suma netto:</span>
                    <strong>${data.totals.totalNetto.toFixed(2).replace('.', ',')} PLN</strong>
                </div>
                <div class="total-line">
                    <span>Suma VAT:</span>
                    <strong>${data.totals.totalVAT.toFixed(2).replace('.', ',')} PLN</strong>
                </div>
                <div class="total-line final">
                    <span>Do zapłaty:</span>
                    <strong>${data.totals.totalBrutto.toFixed(2).replace('.', ',')} PLN</strong>
                </div>
            </div>
            
            <div style="margin-top: 30px;">
                <p><strong>Sposób płatności:</strong> ${data.invoice.paymentMethod}</p>
                ${data.notes ? '<p><strong>Uwagi:</strong> ' + data.notes.replace(/\n/g, '<br>') + '</p>' : ''}
            </div>
            
            <div style="margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div style="text-align: center; border-top: 2px solid #000; padding-top: 10px;">
                    Podpis osoby upoważnionej<br>do wystawienia faktury
                </div>
                <div style="text-align: center; border-top: 2px solid #000; padding-top: 10px;">
                    Podpis osoby upoważnionej<br>do odbioru faktury
                </div>
            </div>
        </div>
    `;
}

// Generuj PDF
async function generatePDF() {
    if (!validateForm()) return;
    
    const data = getFormData();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let y = 20;
    
    // Nagłówek
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('FAKTURA VAT', 20, y);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(data.invoice.number, 20, y + 8);
    
    // Daty
    doc.setFontSize(10);
    doc.text(`Data wystawienia: ${formatDate(data.invoice.date)}`, 150, y, { align: 'right' });
    doc.text(`Data sprzedaży: ${formatDate(data.invoice.saleDate)}`, 150, y + 6, { align: 'right' });
    doc.text(`Termin płatności: ${formatDate(data.invoice.dueDate)}`, 150, y + 12, { align: 'right' });
    
    y += 30;
    
    // Sprzedawca
    doc.setFont(undefined, 'bold');
    doc.text('Sprzedawca:', 20, y);
    doc.setFont(undefined, 'normal');
    y += 6;
    doc.text(data.from.company, 20, y);
    y += 5;
    doc.text(`NIP: ${data.from.nip}`, 20, y);
    y += 5;
    if (data.from.address) { doc.text(data.from.address, 20, y); y += 5; }
    if (data.from.zip || data.from.city) {
        doc.text(`${data.from.zip} ${data.from.city}`, 20, y);
        y += 5;
    }
    if (data.from.email) { doc.text(`Email: ${data.from.email}`, 20, y); y += 5; }
    if (data.from.phone) { doc.text(`Tel: ${data.from.phone}`, 20, y); y += 5; }
    if (data.from.bank) { doc.text(`Konto: ${data.from.bank}`, 20, y); }
    
    // Nabywca
    y = 50;
    doc.setFont(undefined, 'bold');
    doc.text('Nabywca:', 110, y);
    doc.setFont(undefined, 'normal');
    y += 6;
    doc.text(data.to.company, 110, y);
    y += 5;
    if (data.to.nip) { doc.text(`NIP: ${data.to.nip}`, 110, y); y += 5; }
    if (data.to.address) { doc.text(data.to.address, 110, y); y += 5; }
    if (data.to.zip || data.to.city) {
        doc.text(`${data.to.zip} ${data.to.city}`, 110, y);
        y += 5;
    }
    if (data.to.email) { doc.text(`Email: ${data.to.email}`, 110, y); }
    
    // Tabela pozycji
    y = 100;
    
    // Nagłówek tabeli
    doc.setFillColor(0, 0, 0);
    doc.rect(15, y, 180, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    
    doc.text('Lp', 17, y + 5);
    doc.text('Nazwa', 27, y + 5);
    doc.text('Ilość', 95, y + 5);
    doc.text('J.m.', 110, y + 5);
    doc.text('Cena netto', 125, y + 5);
    doc.text('Netto', 150, y + 5);
    doc.text('VAT', 167, y + 5);
    doc.text('Brutto', 180, y + 5);
    
    // Pozycje
    y += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    
    data.items.forEach((item, index) => {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        doc.text((index + 1).toString(), 17, y);
        doc.text(item.name.substring(0, 35), 27, y);
        doc.text(item.quantity.toString(), 95, y);
        doc.text(item.unit, 110, y);
        doc.text(item.price.toFixed(2), 125, y);
        doc.text(item.netto.toFixed(2), 150, y);
        doc.text(item.vatRate === 'zw' ? 'zw.' : item.vatRate + '%', 167, y);
        doc.text(item.brutto.toFixed(2), 180, y);
        y += 7;
    });
    
    // Podsumowanie
    y += 10;
    const summaryX = 130;
    
    doc.setFont(undefined, 'bold');
    doc.text('Suma netto:', summaryX, y);
    doc.text(`${data.totals.totalNetto.toFixed(2)} PLN`, 185, y, { align: 'right' });
    y += 6;
    
    doc.text('Suma VAT:', summaryX, y);
    doc.text(`${data.totals.totalVAT.toFixed(2)} PLN`, 185, y, { align: 'right' });
    y += 6;
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(summaryX, y, 190, y);
    y += 6;
    
    doc.setFontSize(12);
    doc.text('DO ZAPŁATY:', summaryX, y);
    doc.text(`${data.totals.totalBrutto.toFixed(2)} PLN`, 185, y, { align: 'right' });
    
    // Dodatkowe info
    y += 15;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Sposób płatności: ${data.invoice.paymentMethod}`, 20, y);
    
    if (data.notes) {
        y += 8;
        doc.text('Uwagi:', 20, y);
        y += 5;
        const lines = doc.splitTextToSize(data.notes, 170);
        doc.text(lines, 20, y);
    }
    
    // Zapisz
    doc.save(`Faktura-${data.invoice.number.replace(/\//g, '-')}.pdf`);
}

// Zapisz szablon
function saveTemplate() {
    const data = {
        from: {
            company: document.getElementById('fromCompany').value,
            nip: document.getElementById('fromNIP').value,
            address: document.getElementById('fromAddress').value,
            zip: document.getElementById('fromZip').value,
            city: document.getElementById('fromCity').value,
            email: document.getElementById('fromEmail').value,
            phone: document.getElementById('fromPhone').value,
            bank: document.getElementById('fromBank').value
        }
    };
    
    localStorage.setItem('invoiceTemplatePL', JSON.stringify(data));
    alert('Szablon został zapisany!');
}

// Wczytaj szablon
function loadTemplate() {
    const saved = localStorage.getItem('invoiceTemplatePL');
    if (!saved) {
        alert('Brak zapisanego szablonu!');
        return;
    }
    
    const data = JSON.parse(saved);
    
    document.getElementById('fromCompany').value = data.from.company;
    document.getElementById('fromNIP').value = data.from.nip;
    document.getElementById('fromAddress').value = data.from.address;
    document.getElementById('fromZip').value = data.from.zip;
    document.getElementById('fromCity').value = data.from.city;
    document.getElementById('fromEmail').value = data.from.email;
    document.getElementById('fromPhone').value = data.from.phone;
    document.getElementById('fromBank').value = data.from.bank;
    
    alert('Szablon został wczytany!');
}