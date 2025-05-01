// Функция, которая добаляет класс с ошибкой
const showInputError = (form, element, errorMessage) => {
  const errorElement = form.querySelector(`.${element.id}-error`);
  //добавляем красное подчеркивание инпуту
  element.classList.add('form__input_not_valid');
  //вставляем сообщение об ошибке
  errorElement.textContent = errorMessage;
  //делаем сообщение об ошибке видимым
  errorElement.classList.add('form__input_error_visible');
};

// Функция, которая удаляет класс с ошибкой
const hideInputError = (form, element) => {
  const errorElement = form.querySelector(`.${element.id}-error`);
  //убираем красное подчеркивание инпута
  element.classList.remove('form__input_not_valid');
  //делаем сообщение об ошибке невидимым
  errorElement.classList.remove('form__input_error_visible');
  //очищаем сообщение об ошибке
  errorElement.textContent = '';
};

// Функция, которая проверяет валидность поля
const isValid = (evt) => {
  const inputElement = evt.target;
  // Помечаем поле как "тронутое"
  inputElement.dataset.touched = 'true';
  const form = inputElement.closest('.popup__form');
  const inputList = Array.from(form.querySelectorAll('.popup__input'));
  const buttonElement = form.querySelector('.popup__button');
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }
  if (!inputElement.validity.valid && inputElement.dataset.touched === 'true') {
    showInputError(form, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(form, inputElement, inputElement.validationMessage);
  }
  toggleButtonState(inputList, buttonElement);
};

//----------функция очистки ошибок форм------------
export function clearValidationErrors(form, formElements) {
  // Находим все поля ввода
  const inputs = form.querySelectorAll(formElements.inputSelector);
  // Находим все элементы с сообщениями об ошибках
  const errorSpans = form.querySelectorAll(
    `.${formElements.inputError}, [class$="-error"]`
  );
  // Очищаем сообщения об ошибках
  errorSpans.forEach((element) => {
    element.classList.remove(formElements.errorClass); // 'form__input_error_visible'
    element.textContent = '';
  });

  // Очищаем стили полей ввода
  inputs.forEach((input) => {
    input.classList.remove(formElements.inputNotValid); // 'form__input_not_valid'
    input.setCustomValidity('');
    // Добавляем начальное состояние "нет ошибки"
    input.dataset.touched = 'false'; // маркер "поле не трогали"
    input.value = ''; // Очищаем значение
  });
  // Возвращаем форму для последующего использования
  return form;
}

// Функция, которая проверяет валидность полей формы
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

// Функция, которая дезактивирует кнопку отправки формы
export function toggleButtonState(inputList, buttonElement) {
  // Проверяем валидность всех полей
  const hasError = hasInvalidInput(inputList);

  // Проверяем, что все обязательные поля заполнены
  const isFilled = inputList.every((input) => {
    if (input.required) {
      return input.value.trim() !== '';
    }
    return true; // Необязательные поля считаем заполненными
  });

  if (hasError || !isFilled) {
    buttonElement.setAttribute('disabled', true);
    buttonElement.classList.add('form__button__inactive');
  } else {
    buttonElement.removeAttribute('disabled', true);
    buttonElement.classList.remove('form__button__inactive');
  }
}

// Функция, которая устанавливает слушатели для всех полей формы
function setEventListenersForAllFormsElements(inputList) {
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', isValid);
  });
}

// Функция, которая устанавливает слушатели для всех форм
export function enableValidation(formElements, formList) {
  //Берём список всех форм
  formList.forEach((form) => {
    //получаем список инпутов конкретной формы
    const inputList = Array.from(
      form.querySelectorAll(formElements.inputSelector)
    );
    //получаем кнопоку конкретной формы
    const buttonElement = form.querySelector(formElements.submitButtonSelector);
    setEventListenersForAllFormsElements(inputList);
    // Инициализация состояния кнопки при загрузке
    toggleButtonState(inputList, buttonElement);
  });
}
