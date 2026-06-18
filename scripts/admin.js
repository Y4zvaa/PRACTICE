document.addEventListener('DOMContentLoaded', function () {
    let addForm = document.getElementById('add-product-form');
    addForm.addEventListener('submit', function (e) {
        let name = document.getElementById('product-name').value;
        let price = document.getElementById('product-price').value;
        let category = document.getElementById('product-category').value;
        let image = document.getElementById('product-image').value;
        let newProduct = {
            id: Date.now(),
            name: name,
            price: Number(price),
            category: category,
            image: image,
            instock: "true"
        };
        let savedProducts = localStorage.getItem('adminProducts');
        let productsList = [];
        if (savedProducts !== null) {
            productsList = JSON.parse(savedProducts);
        }
        productsList.push(newProduct);
        localStorage.setItem('adminProducts', JSON.stringify(productsList));
        alert('Товар "' + name + '" успешно добавлен в каталог!');
        addForm.reset();
    });
});