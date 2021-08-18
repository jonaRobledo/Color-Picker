/* Constantes */
const MAX_PALETTES = 10,
    MAX_COLORS = 10,
    COLOR_SET = '#ffffff';

/* Variables, Arreglos y Objetos */
let palette = [];
const config = {
    change: false,
    idColor: -1,
};

/* Elemetos HTML */
const $colorPicker = document.querySelector('#color-picker'),
    $nameColor = document.querySelector('#name-color'),
    $gridColors = document.querySelector('#grid-colors'),
    $cardTemplate = document.querySelector('#card-template').content;

/* Funciones */
const saveNewColor = () => {
    if (palette.length >= MAX_COLORS) return alertErrorMsg('No se pueden agregar mas Colores a esta Paleta');
    //
    return !config.change ? palette.push($colorPicker.value) : (palette[config.idColor] = $colorPicker.value);
};

const renderPalette = () => {
    $gridColors.innerHTML = '';
    if (!palette.length) return;
    palette.forEach((color) => {
        $cardTemplate.querySelector('div.color-view').style.backgroundColor = color;
        $cardTemplate.querySelector('p').textContent = color;
        $cardTemplate.querySelector('i.config').dataset.colorName = color;
        $cardTemplate.querySelector('i.trash').dataset.colorName = color;
        let clone = document.importNode($cardTemplate, true);
        $gridColors.appendChild(clone);
    });
};

const alertErrorMsg = (message = '') => {
    alert(message);
};

const changeInputAndName = (color = undefined) => {
    $colorPicker.value = color || COLOR_SET;
    $nameColor.textContent = $colorPicker.value;
    $nameColor.style.backgroundColor = $colorPicker.value;
};

const retrievePalette = () => {
    if (!localStorage.getItem('palette')) {
        localStorage.setItem('palette', JSON.stringify(palette));
        console.log(localStorage.getItem('palette'));
    }
    if (localStorage.getItem('palette')) {
        palette = JSON.parse(localStorage.getItem('palette'));
        console.log(localStorage.getItem('palette'));
    }
};

const printPalette = (element) => {
    const colorPrint = document.createDocumentFragment();
    element.innerHTML = '';
    palette.forEach((color) => {
        console.log(color);
        const colorCard = document.createElement('div');
        colorCard.innerHTML = `
            <div class="card col-7 mx-auto my-2 text-center border-2 border-dark print-card">
                <img class="card-img-top py-4 border-bottom" style="background-color: ${color};"></img>
                <div class="card-body p-1">
                    <p class="card-text my-0 py-0 text-uppercase">${color}</p>
                </div>
            </div>
        `;
        colorPrint.appendChild(colorCard);
    });
    console.log(colorPrint);
    element.appendChild(colorPrint);
};

/* Eventos */
document.addEventListener('DOMContentLoaded', () => {
    changeInputAndName();
    retrievePalette();
    renderPalette();

    /* Cambio del Input */
    $colorPicker.addEventListener('change', () => {
        $nameColor.textContent = $colorPicker.value;
        $nameColor.style.backgroundColor = $colorPicker.value;
    });

    /* Click en los Botones */
    document.addEventListener('click', (e) => {
        /* Guardar Color */
        if (e.target.matches('#btn-save')) {
            saveNewColor();
            renderPalette();
            config.change = false;
            config.idColor = -1;
        }

        /* Reiniciar Input */
        if (e.target.matches('#btn-reset')) {
            changeInputAndName();
        }

        /* Change Color */
        if (e.target.matches('i.config')) {
            const colorOld = e.target.dataset.colorName;
            changeInputAndName(colorOld);
            config.change = true;
            config.idColor = palette.findIndex((color) => colorOld === color);
        }

        /* Delete Color */
        if (e.target.matches('i.trash')) {
            const { colorName } = e.target.dataset;
            palette = palette.filter((color) => color !== colorName);
            renderPalette();
        }

        /* Save Palette */
        if (e.target.matches('#save-palette')) {
            if (palette.length) {
                localStorage.setItem('palette', JSON.stringify(palette));
                console.log(localStorage.getItem('palette'));
            } else {
                alert('No puedes guardar una Paleta vacía');
            }
        }

        /* Reset Palette */
        if (e.target.matches('#reset-palette')) {
            if (confirm('Seguro que quieres VACIAR la Paleta?')) {
                palette = [];
                localStorage.setItem('palette', JSON.stringify(palette));
                console.log(localStorage.getItem('palette'));
                renderPalette();
            }
        }

        /* Generate Palette */
        if (e.target.matches('#print-btn')) {
            console.log(e.target);
            printPalette(document.querySelector('#modal-body'));
        }

        /* Print PDF */
        if (e.target.matches('#save-pdf')) {
            if (palette.length >= 3) {
                window.print();
            } else {
                alert('Tu Paleta contiene menos de 3 Colores');
            }
        }
    });
});
