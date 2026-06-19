document.addEventListener('DOMContentLoaded', function () {
    let inStockCheckbox = document.getElementById('in-stock-checkbox');
    let priceMinInput = document.getElementById('price-min-input');
    let priceMaxInput = document.getElementById('price-max-input');
    let applyFilterButton = document.getElementById('apply-filter-button');
    let categoryLinks = document.querySelectorAll('.category-navigation a');
    let requestCounter = document.getElementById('request-counter');
    let productsGrid = document.querySelector('.products-grid');
    let currentCategory = 'all';

    // Функция для получения актуальных карточек
    function getProductCards() {
        return document.querySelectorAll('.product-card');
    }

    function applyFilters() {
        let productCards = getProductCards();
        let minPrice = priceMinInput.value === '' ? 0 : Number(priceMinInput.value);
        let maxPrice = priceMaxInput.value === '' ? 10000 : Number(priceMaxInput.value);
        let onlyInStock = inStockCheckbox.checked;

        for (let i = 0; i < productCards.length; i++) {
            let card = productCards[i];
            let price = Number(card.dataset.price);
            let category = card.dataset.category;
            let inStock = card.dataset.instock;
            let categoryOk = (currentCategory === 'all' || category === currentCategory);
            let priceOk = (price >= minPrice && price <= maxPrice);
            let stockOk = (!onlyInStock || inStock === 'true');

            if (categoryOk && priceOk && stockOk) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    }

    if (applyFilterButton) {
        applyFilterButton.addEventListener('click', function () {
            applyFilters();
        });
    }

    for (let i = 0; i < categoryLinks.length; i++) {
        categoryLinks[i].addEventListener('click', function (e) {
            e.preventDefault();
            for (let j = 0; j < categoryLinks.length; j++) {
                categoryLinks[j].classList.remove('active');
            }
            this.classList.add('active');
            let text = this.textContent.trim();
            if (text === 'Вся продукция') {
                currentCategory = 'all';
            } else if (text === 'Мясные консервы') {
                currentCategory = 'conserves';
            } else if (text === 'Колбасные изделия') {
                currentCategory = 'sausages';
            } else if (text === 'Полуфабрикаты') {
                currentCategory = 'semi';
            } else if (text === 'Деликатесы') {
                currentCategory = 'delicacies';
            }
            applyFilters();
        });
    }

    function updateRequestCounter() {
        if (!requestCounter) return;
        let data = localStorage.getItem('userRequest');
        let list = data ? JSON.parse(data) : [];
        let total = 0;
        for (let i = 0; i < list.length; i++) {
            total += list[i].quantity;
        }
        requestCounter.textContent = total;
    }

    function handleAddToRequest(button) {
        let card = button.closest('.product-card');
        let id = card.dataset.id;
        let name = card.querySelector('.product-name').textContent;
        let price = Number(card.dataset.price);
        let data = localStorage.getItem('userRequest');
        let list = data ? JSON.parse(data) : [];
        let found = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                list[i].quantity += 1;
                found = true;
                break;
            }
        }
        if (!found) {
            list.push({ id: id, name: name, price: price, quantity: 1 });
        }
        localStorage.setItem('userRequest', JSON.stringify(list));
        updateRequestCounter();
        button.textContent = 'Добавлено!';
    }

    // Привязываем обработчики к существующим кнопкам
    let addButtons = document.querySelectorAll('.add-to-request-button');
    for (let i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener('click', function () {
            handleAddToRequest(this);
        });
    }

    // Добавляем товары из админки
    let adminData = localStorage.getItem('adminProducts');
    if (adminData && productsGrid) {
        let adminList = JSON.parse(adminData);
        for (let i = 0; i < adminList.length; i++) {
            let prod = adminList[i];
            let newCard = document.createElement('article');
            newCard.className = 'product-card';
            newCard.dataset.id = prod.id;
            newCard.dataset.category = prod.category;
            newCard.dataset.price = prod.price;
            newCard.dataset.instock = prod.instock;
            newCard.innerHTML =
                '<div class="product-image-container">' +
                '<img src="images/' + prod.image + '" alt="' + prod.name + '">' +
                '</div>' +
                '<div class="product-information">' +
                '<h3 class="product-name">' + prod.name + '</h3>' +
                '<p class="product-description">Новинка от комбината.</p>' +
                '<div class="price-information">' +
                '<span class="price">' + prod.price + ' ₽</span>' +
                '<span class="unit">/ шт.</span>' +
                '</div>' +
                '<button class="add-to-request-button">В заявку</button>' +
                '</div>';
            productsGrid.appendChild(newCard);
            newCard.querySelector('.add-to-request-button').addEventListener('click', function () {
                handleAddToRequest(this);
            });
        }
    }

    updateRequestCounter();
    applyFilters();
});

// ========== СМЕНА ТЕМ ==========
(function () {
    // Объект с темами
    const themes = {
        light: {
            '--main': '#F4F4F4',
            '--text-v': '#333333',
            '--header': '#C41E24',
            '--text-in': '#FFFFFF',
            '--footer': '#2E2E2E',
            '--info': '#ffffff',
            '--title': '#222',
            '--desc': '#777',
            '--ppp': '#555',
            '--border': '#eee',
            '--price': '#C41E24',
            '--thead': '#d0d0d0',
            '--focus': '#C41E24',
        },
        dark: {
            '--main': '#3f090c',
            '--text-v': '#F2F2F2',
            '--header': '#220102',
            '--text-in': '#F2F2F2',
            '--footer': '#220102',
            '--info': '#4e181b',
            '--title': '#F4F4F4',
            '--desc': '#c6c6c6',
            '--ppp': '#e7e7e7',
            '--border': '#220102',
            '--price': '#e7e7e7',
            '--thead': '#350e11',
            '--focus': '#754e50',
        }
    };

    // Применение темы
    function applyTheme(themeName) {
        const theme = themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        for (const [property, value] of Object.entries(theme)) {
            root.style.setProperty(property, value);
        }

        localStorage.setItem('selectedTheme', themeName);

        // Обновляем активный класс в настройках
        const themeItems = document.querySelectorAll('.settingsList_Item');
        themeItems.forEach(item => {
            if (item.getAttribute('data-theme') === themeName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Меняем иконки в зависимости от темы
        changeIcons(themeName);
    }

    // Функция смены иконок
    function changeIcons(themeName) {
        const isDark = themeName === 'dark';

        // Меняем иконки настроек темы (dark.png / light.png)
        const themeSettingIcons = document.querySelectorAll('.settingsList_Item img');
        themeSettingIcons.forEach(icon => {
            const parentItem = icon.closest('.settingsList_Item');
            if (parentItem) {
                const theme = parentItem.getAttribute('data-theme');
                if (theme === 'light') {
                    icon.src = isDark ? 'images/lightW.png' : 'images/light.png';
                } else if (theme === 'dark') {
                    icon.src = isDark ? 'images/darkW.png' : 'images/dark.png';
                }
            }
        });

        // Меняем иконки преимуществ по data-icon
        const featureIcons = document.querySelectorAll('.feature-icon img');
        featureIcons.forEach(icon => {
            const iconName = icon.getAttribute('data-icon');
            if (iconName) {
                icon.src = isDark ? `images/${iconName}W.png` : `images/${iconName}.png`;
            }
        });
    } // <-- ЭТА СКОБКА БЫЛА ПРОПУЩЕНА!

    // Загрузка сохранённой темы
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && themes[savedTheme]) {
            applyTheme(savedTheme);
        } else {
            applyTheme('light');
        }
    }

    // Инициализация переключателей тем
    function initThemeSwitcher() {
        const themeItems = document.querySelectorAll('.settingsList_Item');
        themeItems.forEach(item => {
            item.removeEventListener('click', themeClickHandler);
            item.addEventListener('click', themeClickHandler);
        });
    }

    // Обработчик клика
    function themeClickHandler(e) {
        let targetItem = e.currentTarget;
        if (!targetItem || !targetItem.getAttribute('data-theme')) {
            targetItem = e.target.closest('.settingsList_Item');
        }
        if (targetItem && targetItem.getAttribute('data-theme')) {
            const themeName = targetItem.getAttribute('data-theme');
            applyTheme(themeName);
        }
    }

    // Запускаем после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadSavedTheme();
            initThemeSwitcher();
        });
    } else {
        loadSavedTheme();
        initThemeSwitcher();
    }
})();