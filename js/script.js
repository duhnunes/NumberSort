const main = document.querySelector('main');
let form;

document.addEventListener('DOMContentLoaded', () => {
  createForm();
  MinMaxInputValue();
});

// CheckInputValue Min/Max
function MinMaxInputValue() {
  const numbers = document.querySelectorAll('#number');
  numbers.forEach((input, index) => {
    input.addEventListener('input', () => {
      if ((index === 0 && input.value > 16) || input.value < 0) {
        input.value = 16;
      } else if (index !== 0 && input.value > 255) {
        input.value = 255;
      }
      if (input.value !== "") {
        input.classList.remove('error');
      }
    });
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const numbers = document.querySelectorAll('#number');
  const noRepeatCheckbox = document.getElementById('toggleButton');
  let firstEmptyInput = null;

  numbers.forEach(input => {
    if (input.value === "") {
      input.classList.add('error');
      if (!firstEmptyInput) {
        firstEmptyInput = input;
      }
    } else {
      input.classList.remove('error');
    }
  });
  
  if (firstEmptyInput) {
    firstEmptyInput.focus();
  } else {
    const number = parseInt(numbers[0].value);
    const min = parseInt(numbers[1].value);
    const max = parseInt(numbers[2].value);
    const noRepeat = noRepeatCheckbox.checked;

    if (isNaN(number) || isNaN(min) || isNaN(max)) {
      alert('Por favor, preencha os campos corretamente.');
      return;
    }

    if (noRepeat && number > (max - min + 1)) {
      alert('O número de sorteios não pode ser maior que a diferença entre o mínimo e o máximo quando a opção de não repetir números está marcada.');
      console.error('Número de sorteios maior que intervalo disponível:', { number, min, max, noRepeat });
      return;
    }

    console.log('Parâmetros válidos para sorteio:', { number, min, max, noRepeat });
    const result = sortNumber(number, min, max, noRepeat);
    showResult(result);
  }
}

function sortNumber(number, min, max, noRepeat) {
  const range = max - min + 1;
  if (noRepeat && number > range) {
    alert('O número de sorteios não pode ser maior que a diferença entre o mínimo e o máximo quando a opção de não repetir números está marcada.');
    console.error('Número de sorteios maior que intervalo disponível:', { number, min, max, noRepeat });
    return [];
  }
  const numbersSorted = [];
  const numbersSet = new Set();
  while (numbersSorted.length < number) {
    const num = Math.floor(Math.random() * range) + min;
    if (noRepeat) {
      if (!numbersSet.has(num)) {
        numbersSet.add(num);
        numbersSorted.push(num);
      }
    } else {
      numbersSorted.push(num);
    }
  }
  console.log('Números sorteados:', numbersSorted);
  return numbersSorted;
}

function showResult(result) {
  // Remove any existing form
  if (form) form.remove();

  // Create the result container section
  const resultContainer = document.createElement('section');
  resultContainer.classList.add('resultContainer');
  
  // Create the header for the result section
  const header = document.createElement('header');
  header.classList.add('resultHeader');
  header.innerHTML = '<h2>Resultado do Sorteio</h2> <p>1º Resultado</p>';

  // Create the numbers container
  const numbersContainer = document.createElement('div');
  numbersContainer.classList.add('numbersContainer');

  // Create the "sort again" button
  const sortAgain = document.createElement('button');
  const textButton = document.createElement('span');
  textButton.textContent = 'Sortear novamente';
  const iconSortAgain = document.createElement('i');
  iconSortAgain.classList.add('arrow-circle');
  sortAgain.append(textButton, iconSortAgain);
  sortAgain.setAttribute('type', 'button');
  sortAgain.classList.add('sortAgainBtn');

  sortAgain.addEventListener('click', () => {
    createForm();
    MinMaxInputValue();
  });

  // Append header, numbers container, and button to result container
  resultContainer.append(header, numbersContainer, sortAgain);
  
  // Append numbers to the numbers container
  result.forEach(num => {
    const numbElement = document.createElement('span');
    numbElement.textContent = num;
    numbElement.classList.add('number');
    numbersContainer.appendChild(numbElement);
  });

  // Append the result container to the main element
  main.appendChild(resultContainer);
}

function createForm() {
  // Remove any existing result container
  const resultContainer = document.querySelector('.resultContainer');
  if (resultContainer) resultContainer.remove();

  // Create Form Element
  form = document.createElement('form');
  form.className = 'content';

  // Create Header Element
  const header = document.createElement('header');
  const h2 = document.createElement('h2');
  h2.textContent = 'Quero sortear:';
  const p = document.createElement('p');
  p.textContent = 'Defina o intervalo e a quantidade de números, clique em "Sortear" e veja os resultados na tela. É rápido e fácil!';
  
  header.appendChild(h2);
  header.appendChild(p);

  // Create Div Element
  const entries = document.createElement('div');
  entries.className = 'entries';

  // Create Numbers Section
  const numbersSection = document.createElement('section');
  numbersSection.className = 'numbers';

  const labels = [
    { text: 'Números', min: 1, max: 16, maxlength: 2, id: 'number' },
    { text: 'de', max: 255, maxlength: 3, id: 'number' },
    { text: 'de', max: 255, maxlength: 3, id: 'number' }
  ];

  labels.forEach(label => {
    const labelElement = document.createElement('label');
    const span = document.createElement('span');
    span.textContent = label.text;
    const div = document.createElement('div');
    div.className = 'bg-input';
    const input = document.createElement('input');
    input.type = 'number';
    if (label.min) input.min = label.min;
    input.max = label.max;
    input.maxLength = label.maxlength;
    input.id = label.id;
    div.appendChild(input);
    labelElement.appendChild(span);
    labelElement.appendChild(div);
    numbersSection.appendChild(labelElement);
  });

  // Create No Repeat Section
  const noRepeatSection = document.createElement('section');
  noRepeatSection.className = 'no-repeat';

  const toggleArea = document.createElement('div');
  toggleArea.className = 'toggle-area';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'toggleButton';
  checkbox.tabIndex = 0;

  const labelButton = document.createElement('label');
  labelButton.htmlFor = 'toggleButton';
  labelButton.className = 'btn-bg';

  const spanButton = document.createElement('span');
  spanButton.className = 'button';

  labelButton.appendChild(spanButton);
  toggleArea.appendChild(checkbox);
  toggleArea.appendChild(labelButton);

  const labelNoRepeat = document.createElement('label');
  labelNoRepeat.htmlFor = 'toggleButton';
  labelNoRepeat.textContent = 'Não repetir número';

  noRepeatSection.appendChild(toggleArea);
  noRepeatSection.appendChild(labelNoRepeat);

  entries.appendChild(numbersSection);
  entries.appendChild(noRepeatSection);

  // Create Button Element
  const button = document.createElement('button');
  button.type = 'submit';
  button.id = 'btnSort';
  button.innerHTML = '<span>Sortear</span><i class="arrow-right"></i>';

  // Add the elements to the form
  form.appendChild(header);
  form.appendChild(entries);
  form.appendChild(button);

  // Add submit event listener to the form
  form.addEventListener('submit', handleFormSubmit);

  // Append the form to the main element
  main.appendChild(form);
}
