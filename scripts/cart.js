document.addEventListener('DOMContentLoaded', function () {
    let cartListContainer = document.getElementById('cart-list-container');
    let cartSummarySection = document.getElementById('cart-summary-section');
    let emptyCartMessage = document.getElementById('empty-cart-message');
    let totalAmountDisplay = document.getElementById('total-amount-display');
    let submitRequestButton = document.getElementById('submit-request-button');
    let orderFormModal = document.getElementById('order-form-modal');
    let closeModalButton = document.querySelector('.close-modal-button');
    let orderSubmissionForm = document.getElementById('order-submission-form');
    function renderCartDisplay() {
        let cartText = localStorage.getItem('userRequest');
        let cartList = [];
        if (cartText !== null) {
            cartList = JSON.parse(cartText);
        }
        cartListContainer.innerHTML = '';
        if (cartList.length === 0) {
            cartSummarySection.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }
        cartSummarySection.style.display = 'flex';
        emptyCartMessage.style.display = 'none';
        let totalAmount = 0;
        for (let i = 0; i < cartList.length; i++) {
            let currentItem = cartList[i];
            let itemTotal = currentItem.price * currentItem.quantity;
            totalAmount = totalAmount + itemTotal;
            let itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML =
                '<div class="item-information">' +
                '<h3>' + currentItem.name + '</h3>' +
                '<span class="item-price">' + currentItem.price + ' ₽ / шт.</span>' +
                '</div>' +
                '<div class="item-controls">' +
                '<button class="quantity-button minus-button" data-index="' + i + '">−</button>' +
                '<span class="quantity-display">' + currentItem.quantity + '</span>' +
                '<button class="quantity-button plus-button" data-index="' + i + '">+</button>' +
                '<button class="remove-item-button" data-index="' + i + '">× </button>' +
                '</div>' +
                '<div class="item-total">' + itemTotal + ' ₽</div>';
            cartListContainer.appendChild(itemElement);
        }
        totalAmountDisplay.textContent = totalAmount + ' ₽';
        attachCartEventHandlers();
    }
    function attachCartEventHandlers() {
        let minusButtons = document.querySelectorAll('.minus-button');
        for (let j = 0; j < minusButtons.length; j++) {
            minusButtons[j].addEventListener('click', function (e) {
                let itemIndex = e.target.dataset.index;
                updateItemQuantity(itemIndex, -1);
            });
        }
        let plusButtons = document.querySelectorAll('.plus-button');
        for (let k = 0; k < plusButtons.length; k++) {
            plusButtons[k].addEventListener('click', function (e) {
                let itemIndex = e.target.dataset.index;
                updateItemQuantity(itemIndex, 1);
            });
        }
        let removeButtons = document.querySelectorAll('.remove-item-button');
        for (let m = 0; m < removeButtons.length; m++) {
            removeButtons[m].addEventListener('click', function (e) {
                let itemIndex = e.target.dataset.index;
                removeItemFromCart(itemIndex);
            });
        }
    }
    function updateItemQuantity(index, change) {
        let cartText = localStorage.getItem('userRequest');
        let cartList = [];
        if (cartText !== null) {
            cartList = JSON.parse(cartText);
        }
        cartList[index].quantity = cartList[index].quantity + change;
        if (cartList[index].quantity <= 0) {
            cartList.splice(index, 1);
        }
        localStorage.setItem('userRequest', JSON.stringify(cartList));
        renderCartDisplay();
    }
    function removeItemFromCart(index) {
        let cartText = localStorage.getItem('userRequest');
        let cartList = [];
        if (cartText !== null) {
            cartList = JSON.parse(cartText);
        }
        cartList.splice(index, 1);
        localStorage.setItem('userRequest', JSON.stringify(cartList));
        renderCartDisplay();
    }
    submitRequestButton.addEventListener('click', function () {
        orderFormModal.classList.add('active');
    });
    function closeModalWindow() {
        orderFormModal.classList.remove('active');
        orderSubmissionForm.reset();
        let allInputs = document.querySelectorAll('.form-group input');
        for (let n = 0; n < allInputs.length; n++) {
            allInputs[n].classList.remove('error');
        }
    }
    closeModalButton.addEventListener('click', closeModalWindow);
    orderFormModal.addEventListener('click', function (e) {
        if (e.target === orderFormModal) {
            closeModalWindow();
        }
    });
    orderSubmissionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let fullNameInput = document.getElementById('full-name-input');
        let phoneNumberInput = document.getElementById('phone-number-input');
        let emailAddressInput = document.getElementById('email-address-input');
        let isFormValid = true;
        let allInputs = [fullNameInput, phoneNumberInput, emailAddressInput];
        for (let p = 0; p < allInputs.length; p++) {
            allInputs[p].classList.remove('error');
        }
        if (fullNameInput.value.trim() === '') {
            fullNameInput.classList.add('error');
            isFormValid = false;
        }
        if (phoneNumberInput.value.trim() === '' || phoneNumberInput.value.trim().length < 10) {
            phoneNumberInput.classList.add('error');
            isFormValid = false;
        }
        if (emailAddressInput.value.trim() === '' || emailAddressInput.value.indexOf('@') === -1) {
            emailAddressInput.classList.add('error');
            isFormValid = false;
        }
        if (isFormValid === true) {
            closeModalWindow();
            alert('Заявка успешно отправлена! Менеджер свяжется с вами в ближайшее время!');
            localStorage.removeItem('userRequest');
            renderCartDisplay();
        }
    });
    renderCartDisplay();
});