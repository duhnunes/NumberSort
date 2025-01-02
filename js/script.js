const form = document.querySelector('form');
const numbers = document.querySelectorAll('#number');
const noRepeatCheckbox = document.getElementById('toggleButton');

// CheckInputValue Min/Max
function MinMaxInputValue() {
  // Configura os listeners de eventos de input uma vez
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

form.onsubmit = (e) => {
  e.preventDefault();
  let firstEmptyInput = null;

  // Verifica se algum input está vazio
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
  
  // Foca no primeiro input vazio
  if (firstEmptyInput) {
    firstEmptyInput.focus();
  } else {
    const number = parseInt(numbers[0].value);
    const min = parseInt(numbers[1].value);
    const max = parseInt(numbers[2].value);
    const noRepeat = noRepeatCheckbox.checked;

    if(isNaN(number) || isNaN(min) || isNaN(max)) {
      alert('Por favor, preencha os campos corretamente.');
      return;
    }

    const result = sortNumber(number, min, max, noRepeat);
    showResult(result);
  }
}

function sortNumber(number, min, max, noRepeat) {
  const numbersSorted = new Set();
  while (numbersSorted.size < number) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if(noRepeat) {
      numbersSorted.add(num);
    } else {
      numbersSorted.add(num);
      if (numbersSorted.size >= number) break;
    }
  }
  return Array.from(numbersSorted);
}

function showResult(result) {
  const main = document.querySelector('main');
  const form = document.querySelector('form.content');
  const resultContainer = document.createElement('section');
  resultContainer.classList.add('resultContainer');
  main.appendChild(resultContainer);
  form.remove();

  const header = document.createElement('header');
  header.classList.add('resultHeader');
  header.innerHTML = '<h2>Resultado do Sorteio</h2> <p>1º Resultado</p>';
  const numbersContainer = document.createElement('div');
  numbersContainer.classList.add('numbersContainer');
  const sortAgain = document.createElement('button');
  const textButton = document.createElement('span');
  textButton.textContent = 'Sortear novamente';
  const iconSortAgain = document.createElement('i');
  iconSortAgain.classList.add('arrow-circle');
  sortAgain.append(textButton, iconSortAgain);
  sortAgain.setAttribute('type', 'button');
  sortAgain.classList.add('sortAgainBtn');

  // Adiciona os elementos na tela
  resultContainer.append(header, numbersContainer, sortAgain);
  
  // Adiciona os números na tela
  result.forEach(num => {
    const numbElement = document.createElement('span');
    numbElement.textContent = num;
    numbElement.classList.add('number');
    numbersContainer.appendChild(numbElement);
  })
}

MinMaxInputValue();
