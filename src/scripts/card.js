import {
  deleteCardRequest,
  likeCardRequest,
  disLikeCardRequest,
} from './api.js';
import { openModal, closeModal } from './modal.js';
// попап подтверждения удаления
const popUpAskBeforeDeleteCard = document.querySelector(
  '.popup_type_ask_before_delete_card'
);
// кнопка попапа подтверждения удаления
const confirmButton = popUpAskBeforeDeleteCard.querySelector(
  '.popup__button-delete'
);

export function createCard(object, cardElement, showImageFunction, userId) {
  const clonedElement = cardElement.cloneNode(true);
  clonedElement._id = object._id;
  const cardImage = clonedElement.querySelector('.card__image');
  cardImage.src = object.link;
  cardImage.alt = object.name;
  cardImage.addEventListener('click', function () {
    showImageFunction(object.link, object.name);
  });
  const likeButton = clonedElement.querySelector('.card__like-button');

  if (
    object.likes.find((myInformationId) => {
      return myInformationId._id === userId;
    })
  ) {
    likeButton.classList.add('card__like-button_is-active');
  }
  likeButton.addEventListener('click', likeCard);
  clonedElement.querySelector('.card__title').textContent = object.name;
  const deleteButton = clonedElement.querySelector('.card__delete-button');
  if (object.owner._id === userId) {
    deleteButton.addEventListener('click', askBeforeDeleteCard);
  } else {
    deleteButton.classList.add('card__delete-button-inactive');
    deleteButton.setAttribute('disabled', true);
  }
  const likesQuantitySpan = clonedElement.querySelector('.likesQuantity');
  if (object.likes.length > 0) {
    likesQuantitySpan.textContent = object.likes.length;
  }
  return clonedElement;
}

//----------функция события окрытия попапа для удаления карточки------------

function askBeforeDeleteCard(evt) {
  const deleteButton = evt.target;
  const card = deleteButton.closest('.card');
  openModal(popUpAskBeforeDeleteCard);
  confirmButton.addEventListener('click', function deleteCard() {
    deleteCardRequest(card._id)
      .then(() => {
        card.remove();
        closeModal(popUpAskBeforeDeleteCard);
      })
      .catch((error) => {
        console.error(error); // Логируем ошибку
        alert('Не удалось удалить карточку. Попробуйте снова.');
      });
  });
}

// фунция лайка
function likeCard(evt) {
  const likeButton = evt.target;
  const likeContainer = likeButton.parentElement;
  const card = likeContainer.closest('.card');
  if (!likeButton.classList.contains('card__like-button_is-active')) {
    likeCardRequest(card._id)
      .then((object) => {
        const likesQuantitySpan = likeContainer.querySelector('.likesQuantity');
        if (object.likes.length > 0) {
          likesQuantitySpan.textContent = object.likes.length;
        }
        likeButton.classList.toggle('card__like-button_is-active');
      })
      .catch((error) => {
        console.error(error); // Логируем ошибку
        alert(
          'Не удалось получить данные о количестве лайков после лайка. Попробуйте снова.'
        );
      });
  } else {
    disLikeCardRequest(card._id)
      .then((object) => {
        const likesQuantitySpan = likeContainer.querySelector('.likesQuantity');
        if (object.likes.length > 0) {
          likesQuantitySpan.textContent = object.likes.length;
        } else {
          likesQuantitySpan.textContent = '';
        }
        likeButton.classList.toggle('card__like-button_is-active');
      })
      .catch((error) => {
        console.error(error); // Логируем ошибку
        alert(
          'Не удалось получить данные о количестве лайков после дизлайка. Попробуйте снова.'
        );
      });
  }
}
