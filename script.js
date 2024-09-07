//jsPDF desde CDN para exportar en PDF
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js";
document.head.appendChild(script);


//array de precios
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
    'Tranca de Puerco y Chorizo': 45.00,
    'Tranca Surtida Especial': 55.00,
    'Coca Cola': 20.00,
    'Licuado de Chocomilk': 40.00,
    'Licuado de Fresa': 40.00,
    'Licuado de Platano': 40.00
};


//Suma total y array de la orden
let total = 0;
let orderItems = [];



document.getElementById('generateOrderBtn').addEventListener('click', function () {
    document.getElementById('orderSections').style.display = 'block';
});


//Funcion para cambiar de categoria entre 
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
    deleteBtn.id = 'EliminarBtn'; //Id para el boton de elimnar de las ordenes
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

document.getElementById('generatePdfBtn').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;

    const name = prompt('Ingrese el nombre del Titular:');
    if (!name) {
        alert('El nombre es necesario para generar el PDF.');
        return;
    }

    // Crear un PDF temporal para calcular la altura necesaria
    let tempDoc = new jsPDF({ unit: 'mm', format: [80, 150] });
    let yPosition = 10;
    const maxLineWidth = 50;  // Máximo ancho para texto antes de ser dividido
    const itemSpacing = 15;   // Espacio adicional entre nombre del producto y precio

    // Encabezado del negocio
    tempDoc.setFontSize(14);
    tempDoc.setFont('courier', 'bold');
    tempDoc.text('*** TAQUERIA GOMEZ ***', 40, yPosition, { align: 'center' });
    yPosition += 10;

    tempDoc.setFontSize(10);
    tempDoc.setFont('courier', 'normal');
    tempDoc.text('Tel: 982 130 3504', 40, yPosition, { align: 'center' });
    yPosition += 5;

    tempDoc.text('--------------------------------', 40, yPosition, { align: 'center' });
    yPosition += 10;

    tempDoc.text('Orden:', 10, yPosition);
    yPosition += 7;

    orderItems.forEach(item => {
        const productNameLines = tempDoc.splitTextToSize(`${item.quantity} x ${item.product}`, maxLineWidth);

        productNameLines.forEach((line, index) => {
            if (index === 0) {
                tempDoc.text(line, 10, yPosition);
                tempDoc.text(`$${item.price.toFixed(2)}`, 10 + itemSpacing + maxLineWidth, yPosition, { align: 'right' });
            } else {
                tempDoc.text(line, 10, yPosition);
            }
            yPosition += 7;
        });
    });

    yPosition += 5;
    tempDoc.text('--------------------------------', 40, yPosition, { align: 'center' });
    yPosition += 10;

    tempDoc.setFontSize(12);
    tempDoc.setFont('courier', 'bold');
    tempDoc.text(`TOTAL: $${total.toFixed(2)} MXN`, 10, yPosition);

    yPosition += 10;
    tempDoc.setFontSize(10);
    tempDoc.setFont('courier', 'normal');
    tempDoc.text(`Titular: ${name}`, 10, yPosition);

    yPosition += 10;
    tempDoc.text('--------------------------------', 40, yPosition, { align: 'center' });

    yPosition += 10;
    tempDoc.setFontSize(10);
    tempDoc.setFont('courier', 'italic');
    tempDoc.text('Gracias por su compra!', 40, yPosition, { align: 'center' });

    // Determinar la altura final del PDF basado en el contenido
    const finalHeight = yPosition + 20;
    let doc = new jsPDF({ unit: 'mm', format: [80, Math.max(150, finalHeight)] });

    // Reiniciar y recrear el contenido en el documento final
    yPosition = 10;

    doc.setFontSize(14);
    doc.setFont('courier', 'bold');
    doc.text('*** TAQUERIA GOMEZ ***', 40, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.text('Tel: 982 130 3504', 40, yPosition, { align: 'center' });
    yPosition += 5;

    doc.text('--------------------------------', 40, yPosition, { align: 'center' });
    yPosition += 10;

    doc.text('Orden:', 10, yPosition);
    yPosition += 7;

    orderItems.forEach(item => {
        const productNameLines = doc.splitTextToSize(`${item.quantity} x ${item.product}`, maxLineWidth);

        productNameLines.forEach((line, index) => {
            if (index === 0) {
                doc.text(line, 10, yPosition);
                doc.text(`$${item.price.toFixed(2)}`, 10 + itemSpacing + maxLineWidth, yPosition, { align: 'right' });
            } else {
                doc.text(line, 10, yPosition);
            }
            yPosition += 7;
        });
    });

    yPosition += 5;
    doc.text('--------------------------------', 40, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('courier', 'bold');
    doc.text(`TOTAL: $${total.toFixed(2)} MXN`, 10, yPosition);

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.text(`Titular: ${name}`, 10, yPosition);

    yPosition += 10;
    doc.text('--------------------------------', 40, yPosition, { align: 'center' });

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('courier', 'italic');
    doc.text('Gracias por su compra!', 40, yPosition, { align: 'center' });

    // Guardar el PDF 
    const fileName = `ORDEN-TAQUERIA-GOMEZ-${name}.pdf`;
    doc.save(fileName);
});
