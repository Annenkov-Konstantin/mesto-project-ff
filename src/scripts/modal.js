import {
  closePopupWithEsc,
  formAddNewCard,
  placeNameInput,
  urlInput,
} from './index.js';

export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closePopupWithEsc);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  checkForm();
  document.removeEventListener('keydown', closePopupWithEsc);
}

function checkForm() {
  if (placeNameInput.value.length > 0 || urlInput.value.length > 0) {
    formAddNewCard.reset();
  }
}
