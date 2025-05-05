//-----------Функция, которая добаляет класс с ошибкой------------

const showInputError = (formElementsClasses, form, element, errorMessage) => {
  const errorElement = form.querySelector(`.${element.id}-error`);
  //добавляем красное подчеркивание инпуту
  element.classList.add(formElementsClasses.inputNotValid);
  //вставляем сообщение об ошибке
  errorElement.textContent = errorMessage;
  //делаем сообщение об ошибке видимым
  errorElement.classList.add(formElementsClasses.errorClass);
};

//------------Функция, которая удаляет класс с ошибкой---------

const hideInputError = (formElementsClasses, form, element) => {
  const errorElement = form.querySelector(`.${element.id}-error`);
  //убираем красное подчеркивание инпута
  element.classList.remove(formElementsClasses.inputNotValid);
  //делаем сообщение об ошибке невидимым
  errorElement.classList.remove(formElementsClasses.errorClass);
  //очищаем сообщение об ошибке
  errorElement.textContent = '';
};

//----------Функция, которая проверяет валидность поля----------

const isValid = (evt, formElementsClasses) => {
  const inputElement = evt.target;
  // Помечаем поле как "тронутое"
  inputElement.dataset.touched = 'true';
  const form = inputElement.closest(formElementsClasses.formSelector);
  const inputList = Array.from(
    form.querySelectorAll(formElementsClasses.inputSelector)
  );
  const buttonElement = form.querySelector(
    formElementsClasses.submitButtonSelector
  );
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }
  if (!inputElement.validity.valid && inputElement.dataset.touched === 'true') {
    showInputError(
      formElementsClasses,
      form,
      inputElement,
      inputElement.validationMessage
    );
  } else {
    hideInputError(
      formElementsClasses,
      form,
      inputElement,
      inputElement.validationMessage
    );
  }
  toggleButtonState(inputList, formElementsClasses, buttonElement);
};

//----------функция очистки ошибок форм------------

export function clearValidationErrors(form, formElementsClasses) {
  // Находим все поля ввода
  const inputs = form.querySelectorAll(formElementsClasses.inputSelector);
  // Находим все элементы с сообщениями об ошибках
  const errorSpans = form.querySelectorAll(
    `.${formElementsClasses.inputError}, [class$="-error"]`
  );
  // Очищаем сообщения об ошибках
  errorSpans.forEach((element) => {
    element.classList.remove(formElementsClasses.errorClass);
    element.textContent = '';
  });

  // Очищаем стили полей ввода
  inputs.forEach((input) => {
    input.classList.remove(formElementsClasses.inputNotValid);
    input.setCustomValidity('');
    // Добавляем начальное состояние "нет ошибки"
    input.dataset.touched = 'false'; // маркер "поле не трогали"
    input.value = ''; // Очищаем значение
  });
  // Возвращаем форму для последующего использования
  return form;
}

//--------------Функция, которая проверяет валидность полей формы--------

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

//--------Функция, которая дезактивирует кнопку отправки формы---------

export function toggleButtonState(
  inputList,
  formElementsClasses,
  buttonElement
) {
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
    buttonElement.classList.add(formElementsClasses.inactiveButtonClass);
  } else {
    buttonElement.removeAttribute('disabled', true);
    buttonElement.classList.remove(formElementsClasses.inactiveButtonClass);
  }
}

//--------Функция, которая устанавливает слушатели для всех полей формы-------

function setEventListenersForAllFormsElements(inputList, formElementsClasses) {
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', (evt) =>
      isValid(evt, formElementsClasses)
    );
  });
}

//------------Функция, которая устанавливает слушатели для всех форм--------------

export function enableValidation(formElementsClasses, formList) {
  //Берём список всех форм
  formList.forEach((form) => {
    //получаем список инпутов конкретной формы
    const inputList = Array.from(
      form.querySelectorAll(formElementsClasses.inputSelector)
    );
    //получаем кнопоку конкретной формы
    const buttonElement = form.querySelector(
      formElementsClasses.submitButtonSelector
    );
    setEventListenersForAllFormsElements(inputList, formElementsClasses);
    // Инициализация состояния кнопки при загрузке
    toggleButtonState(inputList, formElementsClasses, buttonElement);
  });
}
