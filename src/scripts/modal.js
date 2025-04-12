export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  popup.addEventListener('click', waitForEventToClose);
  document.addEventListener('keydown', closePopupWithEsc);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  popup.removeEventListener('click', waitForEventToClose);
  document.removeEventListener('keydown', closePopupWithEsc);
}

//---------функции событий закрытия карточек------------

function waitForEventToClose(evt) {
  if (
    evt.target.classList.contains('popup__close') ||
    evt.target.classList.contains('popup')
  ) {
    closeModal(evt.currentTarget);
  }
}

function closePopupWithEsc(evt) {
  if (evt.key === 'Escape') {
    const currentPopup = document.querySelector('.popup_is-opened');
    closeModal(currentPopup);
  }
}
