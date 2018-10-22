export function set(key, value) {
  return new Promise((resolve, reject) => {
    if(!value) {
      localStorage.setItem(key, "");
    } else {
      localStorage.setItem(key, value);
    }
    resolve();
  });
}

export function get(key) {
  return !localStorage.getItem(key) ? "" : localStorage.getItem(key);
}

export function remove() {
  
}
