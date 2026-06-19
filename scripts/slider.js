// Массив объектов с изображениями для слайдера
const images = [
    { id: 1, src: 'images/sl1.png', alt: 'первая' },
    { id: 2, src: 'images/sl2.png', alt: 'вторая' },
    { id: 2, src: 'images/sl3.png', alt: 'третья' },
    { id: 2, src: 'images/sl4.png', alt: 'четвертыя'},
];

const sliderImage = document.querySelector('#slider-img');
const btnPrev = document.querySelector('#slider-btn_prev');
const btnNext = document.querySelector('#slider-btn_next');
let currentIndex = 0;

// Обработчик кнопки «Назад»
btnPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
        sliderImage.style.opacity = '0'; // исчезает
    setTimeout(() => {
        sliderImage.src = images[currentIndex].src;
        sliderImage.alt = images[currentIndex].alt;
        sliderImage.style.opacity = '1'; // появляется
    }, 300);
});
// Обработчик кнопки «Вперёд»
btnNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    sliderImage.style.opacity = '0'; // исчезает
    setTimeout(() => {
        sliderImage.src = images[currentIndex].src;
        sliderImage.alt = images[currentIndex].alt;
        sliderImage.style.opacity = '1'; // появляется
    }, 300);
});
// Инициализация при загрузке
sliderImage.src = images[0].src;
sliderImage.alt = images[0].alt;