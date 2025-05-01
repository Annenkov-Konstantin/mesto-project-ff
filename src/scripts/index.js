import '../pages/index.css';
//import { initialCards } from './cards.js';
import { createCard, deleteCard, likeCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import {
  clearValidationErrors,
  toggleButtonState,
  enableValidation,
} from './validation.js';
import {
  initialRequests,
  editMyProfileRequest,
  addNewCardRequest,
} from './api.js';
// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardElement = cardTemplate.querySelector('.places__item');
const body = document.querySelector('.page');
const pageContent = body.querySelector('.page__content');
// профиль
const profile = body.querySelector('.profile');
const profileAvatar = profile.querySelector('.profile__image');
const profileInfo = profile.querySelector('.profile__info');
const currentProfileName = profileInfo.querySelector('.profile__title');
const currentProfileDescription = profileInfo.querySelector(
  '.profile__description'
);
// список кaрточек
const placesList = document.querySelector('.places__list');
// окно просмотра фото
const popupImage = document.querySelector('.popup_type_image');
const img = popupImage.querySelector('.popup__image');
const text = popupImage.querySelector('.popup__caption');
// кнопка вызова формы  редактирования профиля
const editButton = profileInfo.querySelector('.profile__edit-button');
// окно редактирования профиля
const popupEdit = body.querySelector('.popup_type_edit');

// Находим форму редактирования профиля  в DOM
const formEditProfile = document.forms['edit-profile'];
// Находим поля формы редактирования профиля в DOM
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
// Находим поля формы редактирования профиля в DOM
const jobInput = formEditProfile.querySelector(
  '.popup__input_type_description'
);
// Находим форму добавления карточки в DOM
const formAddNewCard = document.forms['new-place'];
// Находим поля формы добавления карточки в DOM
const placeNameInput = formAddNewCard.elements['place-name'];
const urlInput = formAddNewCard.elements.link;
// кнопка вызова формы добавления карточки
const addButton = pageContent.querySelector('.profile__add-button');
// попап добавления карточки
const popupNewCard = body.querySelector('.popup_type_new-card');
// массив со списком форм
const formList = [formEditProfile, formAddNewCard];
const formElementsClasses = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'form__button__inactive',
  inputNotValid: 'form__input_not_valid', // красное подчеркивание
  errorClass: 'form__input_error_visible', // видимость сообщения
  inputError: 'form__input_type-error', // стиль сообщения
};

//------------------функция вывода моих данных------------------------

function showInformationAboutMe(object) {
  profileAvatar.style.setProperty('background-image', object.avatar);
  currentProfileName.textContent = object.name;
  currentProfileDescription.textContent = object.about;
}

//------------------функция вывода массива карточек-------------------

function pasteCards(array) {
  array.forEach((object) => {
    const readyElement = createCard(
      object,
      cardElement,
      deleteCard,
      viewImage,
      likeCard
    );
    placesList.append(readyElement);
  });
}

//------------------фунция просмотра фото-------------------

function viewImage(sorce, name) {
  img.setAttribute('src', sorce);
  img.setAttribute('alt', name);
  text.textContent = name;
  openModal(popupImage);
}

//----------функции событий окрытия попапов------------

//----------функция события окрытия попапа редактирования профиля------------

function waitForEventToOpenEditForm(popup, button) {
  button.addEventListener('click', function () {
    if (!formEditProfile.checkValidity()) {
      // 1. Сначала очищаем ошибки
      clearValidationErrors(formEditProfile, formElementsClasses);

      // 2. Заполняем поля значениями профиля
      nameInput.value = currentProfileName.textContent;
      jobInput.value = currentProfileDescription.textContent;

      // 3. Запускаем проверку валидности
      const inputList = Array.from(
        formEditProfile.querySelectorAll('.popup__input')
      );
      inputList.forEach((input) => input.dispatchEvent(new Event('input')));
    }
    // 4. Открываем попап
    openModal(popup);
  });
}

//----------функция события окрытия попапа для добавления новой карточки------------

function waitForEventToOpenAddForm(popup, button) {
  button.addEventListener('click', function () {
    if (!formAddNewCard.checkValidity()) {
      const form = clearValidationErrors(formAddNewCard, formElementsClasses);
      // Обновляем состояние кнопки для новой формы
      const inputList = Array.from(form.querySelectorAll('.popup__input'));
      const buttonElement = form.querySelector('.popup__button');
      toggleButtonState(inputList, buttonElement);
    }
    openModal(popup);
  });
}

//----------обработчик редактирования профиля------------

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  editMyProfileRequest(nameInput.value, jobInput.value)
    .then((object) => {
      // Обновляем данные на странице из ответа сервера
      currentProfileName.textContent = object.name;
      currentProfileDescription.textContent = object.about;
      // Закрываем попап только после успешного обновления
      closeModal(popupEdit);
    })
    .catch((error) => {
      console.error(error); // Логируем ошибку
      alert('Не удалось обновить данные профиля. Попробуйте снова.');
    });
}

//----------обработчик добавления карточки------------

function addNewCard(evt) {
  evt.preventDefault();
  addNewCardRequest(placeNameInput.value, urlInput.value)
    .then((object) => {
      const newCard = { name: object.name, link: object.link };
      const clonedNewElement = createCard(
        newCard,
        cardElement,
        deleteCard,
        viewImage,
        likeCard
      );
      placesList.prepend(clonedNewElement);
      closeModal(popupNewCard);
      formAddNewCard.reset();
    })
    .catch((error) => {
      console.error(error);
      alert('Не удалось добавить карточку. Попробуйте снова.');
    });
}

//----------вывод карточек и инф.профайла после удачного запроса------------

Promise.all(initialRequests)
  .then(([cards, userInfo]) => {
    // Обрабатываем результат первого промиса (карточки)
    pasteCards(cards);
    // Обрабатываем результат второго промиса (информация о пользователе)
    showInformationAboutMe(userInfo);
  })
  .catch((error) => {
    console.error('Ошибка при выполнении запросов:', error);
  });

//----------слушатель редактирования профиля------------

formEditProfile.addEventListener('submit', handleEditFormSubmit);

//----------редактирование профиля------------

waitForEventToOpenEditForm(popupEdit, editButton);

//----------добaвление карточки------------

waitForEventToOpenAddForm(popupNewCard, addButton);

//----------слушатель добавления карточки------------

formAddNewCard.addEventListener('submit', addNewCard);

//----------Валидация------------

enableValidation(formElementsClasses, formList);

//----------Запросы------------
