import '../pages/index.css';
import { initialCards, createCard, deleteCard, likeCard } from './cards.js';
import { openModal, closeModal } from './modal.js';
// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
export const cardElement = cardTemplate.querySelector('.places__item');
const body = document.querySelector('.page');
const pageContent = body.querySelector('.page__content');
// профиль
const profileInfo = pageContent.querySelector('.profile__info');
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
const formElement = document.forms['edit-profile'];
// Находим поля формы редактирования профиля в DOM
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
// Находим форму добавления карточки в DOM
export const formAddNewCard = document.forms['new-place'];
// Находим поля формы добавления карточки в DOM
export const placeNameInput = formAddNewCard.elements['place-name'];
export const urlInput = formAddNewCard.elements.link;
// кнопка вызова формы добавления карточки
const addButton = pageContent.querySelector('.profile__add-button');
// форма добавления карточки
const popupNewCard = body.querySelector('.popup_type_new-card');

//------------------фунция вывода массива карточек-------------------

function pasteCards(array) {
  array.forEach((item) => {
    const readyElement = createCard(item, deleteCard, viewImage, likeCard);
    placesList.append(readyElement);
  });
}

// @todo: Вывести карточки на страницу

pasteCards(initialCards);

//------------------фунция просмотра фото-------------------

function viewImage(sorce, name) {
  img.setAttribute('src', sorce);
  text.textContent = name;
  openModal(popupImage);
  waitForEventToClose(popupImage);
}

//----------функции событий окрытия карточек------------
function waitForEventToOpenEditForm(popup, button) {
  button.addEventListener('click', function () {
    openModal(popup);
    nameInput.value = currentProfileName.textContent;
    jobInput.value = currentProfileDescription.textContent;
  });
}

function waitForEventToOpenAddForm(popup, button) {
  button.addEventListener('click', function () {
    openModal(popup);
  });
}

//---------функции событий закрытия карточек------------
function waitForEventToClose(popup) {
  popup.addEventListener('click', function (evt) {
    if (
      evt.target.classList.contains('popup__close') ||
      evt.target.classList.contains('popup')
    ) {
      closeModal(evt.currentTarget);
    }
  });
}

export function closePopupWithEsc(evt) {
  if (evt.key === 'Escape') {
    const currentPopup = document.querySelector('.popup_is-opened');
    closeModal(currentPopup);
  }
}

//----------обработчик редактирования профиля------------

function handleFormSubmit(evt) {
  evt.preventDefault();
  currentProfileName.textContent = nameInput.value;
  currentProfileDescription.textContent = jobInput.value;
  closeModal(popupEdit);
}

//----------слушатель редактирования профиля------------

formElement.addEventListener('submit', handleFormSubmit);

//----------редактирование профиля------------

waitForEventToOpenEditForm(popupEdit, editButton);
waitForEventToClose(popupEdit);

//----------добaвление карточки------------

waitForEventToOpenAddForm(popupNewCard, addButton);
waitForEventToClose(popupNewCard);

//----------обработчик добавления карточки------------

function addNewCard(evt) {
  evt.preventDefault();
  const newCard = { name: [placeNameInput.value], link: [urlInput.value] };
  const clonedNewElement = createCard(newCard, deleteCard, viewImage, likeCard);
  placesList.prepend(clonedNewElement);
  closeModal(popupNewCard);
}

//----------слушатель добавления карточки------------

popupNewCard.addEventListener('submit', addNewCard);
