const setItem = (key, value) => {
  if (value === undefined || value === null) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key) => {
  const stored = localStorage.getItem(key);

  if (!stored || stored === "undefined") return null;

  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

export { setItem, getItem, removeItem };
