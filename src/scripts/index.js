import '../pages/index.css';
import { createCard } from './card.js';
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
  changeMyAvatarRequest,
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
const viewingImg = popupImage.querySelector('.popup__image');
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
// Создаём массив полей формы редактирования профиля в DOM
const formEditProfileInputList = Array.from(
  formEditProfile.querySelectorAll('.popup__input')
);
// Находим форму добавления карточки в DOM
const formAddNewCard = document.forms['new-place'];
// Находим поля формы добавления карточки в DOM
const placeNameInput = formAddNewCard.elements['place-name'];
const urlInput = formAddNewCard.elements.link;
// Создаём массив полей формы добавления карточки
const formAddNewCardInputList = Array.from(
  formAddNewCard.querySelectorAll('.popup__input')
);
// кнопка-submit формы добавления карточки
const formAddNewCardButtonElement =
  formAddNewCard.querySelector('.popup__button');
// кнопка вызова формы добавления карточки
const addButton = pageContent.querySelector('.profile__add-button');
// попап добавления карточки
const popupNewCard = body.querySelector('.popup_type_new-card');
// кнопка вызова изменения аватара
const editAvatarButton = pageContent.querySelector(
  '.profile__edit-avatar-button'
);
// попап изменения аватара
const popupChangeAvatar = body.querySelector('.popup_type_change-avatar');
// Находим форму изменения аватара в DOM
const formEditAvatar = document.forms['new-avatar'];
// Находим полe формы добавления карточки в DOM
const avatarInput = formEditAvatar.elements.avatar;
// Создаём массив  с полем формы изменения аватара
const formEditAvatarInputList = Array.from(
  formEditAvatar.querySelectorAll('.popup__input')
);
// кнопка-submit формы изменения аватара
const formEditAvatarButtonElement =
  formEditAvatar.querySelector('.popup__button');
// массив со списком имеющихся форм
const formList = [formEditProfile, formAddNewCard, formEditAvatar];
// объект-конфиг
export const formElementsClasses = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'form__button__inactive',
  inputNotValid: 'form__input_not_valid', // красное подчеркивание
  errorClass: 'form__input_error_visible', // видимость сообщения
  inputError: 'form__input_type-error', // стиль сообщения
};

// объект c id.user-------------
const userId = { _id: '' };

//------------------функция вывода моих данных------------------------

function showInformationAboutMe(object) {
  profileAvatar.style.setProperty('background-image', `url(${object.avatar})`);
  currentProfileName.textContent = object.name;
  currentProfileDescription.textContent = object.about;
}

//------------------функция вывода массива карточек-------------------

function pasteCards(array) {
  array.forEach((object) => {
    const readyElement = createCard(object, cardElement, viewImage, userId._id);
    placesList.append(readyElement);
  });
}

//------------------фунция просмотра фото-------------------

function viewImage(sorce, name) {
  viewingImg.setAttribute('src', sorce);
  viewingImg.setAttribute('alt', name);
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
      formEditProfileInputList.forEach((input) =>
        input.dispatchEvent(new Event('input'))
      );
    }
    // 4. Открываем попап
    openModal(popup);
  });
}

//----------функция события окрытия попапа для добавления новой карточки------------

function waitForEventToOpenAddForm(popup, button) {
  button.addEventListener('click', function () {
    if (!formAddNewCard.checkValidity()) {
      clearValidationErrors(formAddNewCard, formElementsClasses);
      // Обновляем состояние кнопки для новой формы
      toggleButtonState(
        formAddNewCardInputList,
        formElementsClasses,
        formAddNewCardButtonElement
      );
    }
    openModal(popup);
  });
}

//----------функция события окрытия попапа для изменения аватара------------

function waitForEventToOpenEditAvatar(popup, button) {
  button.addEventListener('click', function () {
    if (!formEditAvatar.checkValidity()) {
      clearValidationErrors(formEditAvatar, formElementsClasses);
      // Обновляем состояние кнопки для новой формы
      toggleButtonState(
        formEditAvatarInputList,
        formElementsClasses,
        formEditAvatarButtonElement
      );
    }
    openModal(popup);
  });
}

//функции изменения текста кнопки при отправке запроса

function changeTextSubmitButton(button, newText) {
  const currentButton = button;
  currentButton.setAttribute('disabled', true);
  currentButton.textContent = newText;
}

function returnInitialTextSubmitButton(button, initialText) {
  const currentButton = button;
  currentButton.removeAttribute('disabled');
  currentButton.textContent = initialText;
}

//----------обработчик редактирования профиля------------

function handleEditFormSubmit(evt) {
  evt.preventDefault(evt.target);
  changeTextSubmitButton(evt.target.lastElementChild, 'Сохранение...');
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
    })
    .finally(() => {
      returnInitialTextSubmitButton(evt.target.lastElementChild, 'Сохранить');
    });
}

//----------обработчик добавления карточки------------

function addNewCard(evt) {
  evt.preventDefault();
  changeTextSubmitButton(evt.target.lastElementChild, 'Сохранение...');
  addNewCardRequest(placeNameInput.value, urlInput.value)
    .then((object) => {
      const clonedNewElement = createCard(
        object,
        cardElement,
        viewImage,
        userId._id
      );
      placesList.prepend(clonedNewElement);
      closeModal(popupNewCard);
      formAddNewCard.reset();
    })
    .catch((error) => {
      console.error(error);
      alert('Не удалось добавить карточку. Попробуйте снова.');
    })
    .finally(() => {
      returnInitialTextSubmitButton(evt.target.lastElementChild, 'Сохранить');
    });
}

//----------обработчик изменения аватара------------

function editAvatar(evt) {
  evt.preventDefault();
  changeTextSubmitButton(evt.target.lastElementChild, 'Сохранение...');
  changeMyAvatarRequest(avatarInput.value)
    .then((object) => {
      profileAvatar.style.setProperty(
        'background-image',
        `url(${object.avatar})`
      );
      closeModal(popupChangeAvatar);
      formEditAvatar.reset();
    })
    .catch((error) => {
      console.error(error);
      alert('Не удалось изменить аватар. Попробуйте снова.');
    })
    .finally(() => {
      returnInitialTextSubmitButton(evt.target.lastElementChild, 'Сохранить');
    });
}

//----------вывод карточек и инф.профайла после удачного запроса------------

Promise.all(initialRequests)
  .then(([cards, userInfo]) => {
    // сохранение _id пользователя в объект
    userId._id = userInfo._id;
    // Обрабатываем результат второго промиса (информация о пользователе)
    showInformationAboutMe(userInfo);
    // Обрабатываем результат первого промиса (карточки)
    pasteCards(cards);
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

//----------изменение аватара------------

waitForEventToOpenEditAvatar(popupChangeAvatar, editAvatarButton);

//----------слушатель изменение аватара------------

formEditAvatar.addEventListener('submit', editAvatar);

//----------Валидация------------

enableValidation(formElementsClasses, formList);
