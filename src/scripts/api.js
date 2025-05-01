const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-37',
  headers: {
    authorization: 'b4e853f7-0794-472e-80c0-257846ce47f0',
    'Content-Type': 'application/json',
  },
};

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка получения списка карточек: ${res.status}`);
  });
};

export const getInformationAboutMe = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(
      `Ошибка получения информации о пользователе: ${res.status}`
    );
  });
};

export const initialRequests = [getInitialCards(), getInformationAboutMe()];

export const editMyProfileRequest = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка обновления данных профайла: ${res.status}`);
  });
};

export const addNewCardRequest = (name, link) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name,
            link,
          }),
        }).then((res) => {
          if (res.ok) {
            return res.json();
          }
          // если ошибка, отклоняем промис
          return Promise.reject(`Ошибка добавления карточки: ${res.status}`);
        });
      };