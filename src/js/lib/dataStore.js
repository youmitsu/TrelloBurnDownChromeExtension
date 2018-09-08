export function set(key, value) {
  return new Promise((resolve, reject) => {
    if(!value) {
      reject();
      return;
    }
    localStorage.setItem(key, value);
    resolve();
  });
}

export function get(key) {
  return localStorage.getItem(key);
}
