import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, likeCard } from './card.js';
import { openModal, closeModal } from './modal.js';
// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardElement = cardTemplate.querySelector('.places__item');
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
const formEditProfile = document.forms['edit-profile'];
// Находим поля формы редактирования профиля в DOM
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
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
// форма добавления карточки
const popupNewCard = body.querySelector('.popup_type_new-card');

//------------------фунция вывода массива карточек-------------------

function pasteCards(array) {
  array.forEach((item) => {
    const readyElement = createCard(
      item,
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

//----------обработчик редактирования профиля------------

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  currentProfileName.textContent = nameInput.value;
  currentProfileDescription.textContent = jobInput.value;
  closeModal(popupEdit);
}

//----------обработчик добавления карточки------------

function addNewCard(evt) {
  evt.preventDefault();
  const newCard = { name: [placeNameInput.value], link: [urlInput.value] };
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
}

// @todo: Вывести карточки на страницу

pasteCards(initialCards);

//----------слушатель редактирования профиля------------

formEditProfile.addEventListener('submit', handleEditFormSubmit);

//----------редактирование профиля------------

waitForEventToOpenEditForm(popupEdit, editButton);

//----------добaвление карточки------------

waitForEventToOpenAddForm(popupNewCard, addButton);

//----------слушатель добавления карточки------------

formAddNewCard.addEventListener('submit', addNewCard);
