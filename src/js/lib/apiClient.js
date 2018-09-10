import * as DataStore from './dataStore.js';

export function getUser(token, devKey) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.trello.com/1/tokens/${token}/member?token=${token}&key=${devKey}&field=username`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(json => {
        resolve(json);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function getBoards(username, token, devKey) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.trello.com/1/members/${username}/boards?token=${token}&key=${devKey}&filter=open&lists=none&memberships=none`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(json => {
        resolve(json);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function getChartData(token, key, boardId, startDate, endDate, holidays) {
  return new Promise((resolve, reject) => {
    fetch(`${localStorage.getItem('baseUrl')}/getSprintPoint?token=${encodeURIComponent(token)}&key=${encodeURIComponent(key)}&boardId=${boardId}&startDate=${startDate}&endDate=${endDate}&holidays=${holidays}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(json => {
        resolve(json);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function registerWebhook(boardId, baseUrl, token, devKey) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.trello.com/1/webhooks/?idModel=${boardId}&callbackURL=${baseUrl}/execRegisterPoint&token=${token}&key=${devKey}`, {
        method: 'POST'
      })
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err));
  });
}

export function unregisterWebhook(webhookId, token, devKey) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.trello.com/1/webhooks/${webhookId}?token=${token}&key=${devKey}`, {
        method: 'DELETE'
      })
      .then(res => res.json)
      .then(json => resolve(json))
      .catch(err => reject(err));
  });
}

export function getWebhook(token, devKey) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.trello.com/1/tokens/${token}/webhooks?key=${devKey}`, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

export function checkServerUrl(value) {
  return new Promise((resolve, reject) => {
    fetch(`${value}/execRegisterPoint`, {
        method: 'HEAD'
      })
      .then(json => {
        resolve(json);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function getUserAndBoards(token, devKey) {
  return new Promise((resolve, reject) => {
    getUser(token, devKey)
      .then(user => getBoards(user.username, token, devKey))
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}
