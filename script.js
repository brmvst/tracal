const form = document.getElementById('product-form');
const list = document.getElementById('product-list');
const totals = document.getElementById('totals');
const clearBtn = document.getElementById('clear');

let products = JSON.parse(localStorage.getItem('products') || '[]');

function updateList() {
    list.innerHTML = '';
    let totalCal = 0, totalProt = 0, totalFat = 0, totalCarb = 0;

    products.forEach(p => {
        const item = document.createElement('li');
        item.textContent = `${p.name}: ${p.totalCal.toFixed(1)} ккал, ${p.totalProt.toFixed(1)} Б, ${p.totalFat.toFixed(1)} Ж, ${p.totalCarb.toFixed(1)} У (${p.weight} г)`;
        list.appendChild(item);
        totalCal += p.totalCal;
        totalProt += p.totalProt;
        totalFat += p.totalFat;
        totalCarb += p.totalCarb;
    });

    totals.textContent = `Ккал: ${totalCal.toFixed(1)}, Белки: ${totalProt.toFixed(1)} г, Жиры: ${totalFat.toFixed(1)} г, Углеводы: ${totalCarb.toFixed(1)} г`;
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const cal = parseFloat(document.getElementById('cal').value);
    const prot = parseFloat(document.getElementById('prot').value);
    const fat = parseFloat(document.getElementById('fat').value);
    const carb = parseFloat(document.getElementById('carb').value);
    const weight = parseFloat(document.getElementById('weight').value);

    const factor = weight / 100;
    const product = {
        name,
        weight,
        totalCal: cal * factor,
        totalProt: prot * factor,
        totalFat: fat * factor,
        totalCarb: carb * factor
    };

    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    updateList();
    form.reset();
});

clearBtn.addEventListener('click', () => {
    if (confirm('Очистить все данные за день?')) {
        products = [];
        localStorage.removeItem('products');
        updateList();
    }
});

updateList();