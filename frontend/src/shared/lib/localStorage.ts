export enum LocalStorageKeys {
  USER_ID = 'user_id',
}

export interface LocalStorageItems {
  [LocalStorageKeys.USER_ID]: string;
}

export const getItem = (key: LocalStorageKeys) => {
  return localStorage.getItem(key);
};
export const setItem = (key: LocalStorageKeys, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getParsedItem = (key: LocalStorageKeys) => {
  const itemString = getItem(key);
  if (itemString) return JSON.parse(itemString);
};

export const removeItem = (key: LocalStorageKeys) => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
