function setLocalItem(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

function getLocalItem(key: string) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    console.error(error);
  }
}

function deleteLocalItem(key: string) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export { setLocalItem, getLocalItem, deleteLocalItem };
