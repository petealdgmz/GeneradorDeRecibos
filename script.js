// Cargar la librería jsPDF desde CDN
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js";
document.head.appendChild(script);

const prices = {
    'Tacos': 15.00,
    'Tacos Surtidos': 20.00,
    'Tacos de Puerco y Chistorra': 18.00,
    'Tacos de Puerco y Chorizo': 18.00,
    'Gringa de Puerco': 30.00,
    'Gringa Surtida': 40.00,
    'Gringa de Puerco y Chistorra': 35.00,
    'Gringa de Puerco y Chorizo': 35.00,
    'Torta': 25.00,
    'Torta Surtida': 35.00,
    'Torta de Puerco y Chistorra': 30.00,
    'Torta de Puerco y Chorizo': 30.00,
    'Torta Surtida Especial': 40.00,
    'Tranca': 40.00,
    'Tranca Surtida': 50.00,
    'Tranca de Puerco y Chistorra': 45.00,
    'Tranca de Puertco y Chorizo': 45.00,
    'Tranca Surtida Especial': 55.00,
    'Coca Cola': 20.00,
    'Licuado de Chocomilk': 40.00,
    'Licuado de Fresa': 40.00,
    'Licuado de Platano': 40.00
};

let total = 0;
let orderItems = [];

document.getElementById('generateOrderBtn').addEventListener('click', function() {
    document.getElementById('orderSections').style.display = 'block';
});

function showCategory(category) {
    document.getElementById('comidaSection').style.display = 'none';
    document.getElementById('bebidaSection').style.display = 'none';
    
    if (category === 'comida') {
        document.getElementById('comidaSection').style.display = 'block';
    } else if (category === 'bebida') {
        document.getElementById('bebidaSection').style.display = 'block';
    }
}

function addProduct(category) {
    const productList = document.getElementById('orderList');
    let selectedProduct, quantity, price;

    if (category === 'comida') {
        selectedProduct = document.getElementById('comidaOptions').value;
        quantity = parseInt(document.getElementById('comidaQuantity').value, 10);
    } else if (category === 'bebida') {
        selectedProduct = document.getElementById('bebidaOptions').value;
        quantity = parseInt(document.getElementById('bebidaQuantity').value, 10);
    }

    price = prices[selectedProduct] * quantity;
    total += price;

    const orderItem = { product: selectedProduct, quantity: quantity, price: price };
    orderItems.push(orderItem);

    const listItem = document.createElement('li');
    listItem.textContent = `${quantity} x ${selectedProduct} - $${price.toFixed(2)}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.onclick = () => deleteProduct(orderItem, listItem);
    listItem.appendChild(deleteBtn);

    productList.appendChild(listItem);

    updateTotal();
}

function deleteProduct(orderItem, listItem) {
    total -= orderItem.price;
    orderItems = orderItems.filter(item => item !== orderItem);
    listItem.remove();
    updateTotal();
}

function updateTotal() {
    const totalElement = document.getElementById('total');
    if (!totalElement) {
        const totalContainer = document.createElement('div');
        totalContainer.id = 'totalContainer';
        totalContainer.innerHTML = `<h3>Total: $<span id="total">${total.toFixed(2)}</span></h3>`;
        document.getElementById('orderSummary').appendChild(totalContainer);
    } else {
        totalElement.textContent = total.toFixed(2);
    }
}

document.getElementById('generatePdfBtn').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;

    const name = prompt('Ingrese el nombre del Titular:');
    if (!name) {
        alert('El nombre es necesario para generar el PDF.');
        return;
    }

    const doc = new jsPDF({ unit: 'mm', format: [80, 150] }); // Ajuste del tamaño del ticket
    let yPosition = 10;

    // Encabezado del negocio
    doc.setFontSize(14);
    doc.setFont('courier', 'bold'); // Fuente monoespaciada
    doc.text('*** TAQUERIA GOMEZ ***', 40, yPosition, { align: 'center' });
    yPosition += 10;

    // Número de contacto
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.text('Tel: 982 130 3504', 40, yPosition, { align: 'center' });
    yPosition += 5;

    // Línea separadora
    doc.text('--------------------------------', 40, yPosition, { align: 'center' });
    yPosition += 10;

    // Detalles de la orden
    doc.text('Orden:', 10, yPosition);
    yPosition += 7;

    orderItems.forEach(item => {
        doc.text(`${item.quantity} x ${item.product}`, 10, yPosition);
        doc.text(`$${item.price.toFixed(2)}`, 70, yPosition, { align: 'right' });
        yPosition += 7;
    });

    // Línea separadora
    yPosition += 5;
    doc.text('--------------------------------', 40, yPosition, { align: 'center' });
    yPosition += 10;

    // Total de la compra
    doc.setFontSize(12);
    doc.setFont('courier', 'bold');
    doc.text(`TOTAL: $${total.toFixed(2)} MXN`, 10, yPosition);

    // Nombre de la persona que ordenó
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.text(`Titular: ${name}`, 10, yPosition);

    // Línea separadora
    yPosition += 10;
    doc.text('--------------------------------', 40, yPosition, { align: 'center' });

    // Mensaje de agradecimiento
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('courier', 'italic');
    doc.text('Gracias por su compra!', 40, yPosition, { align: 'center' });

    // Guardar el PDF con el nombre en el formato solicitado
    const fileName = `ORDEN-TAQUERIA-${name}.pdf`;
    doc.save(fileName);
});
