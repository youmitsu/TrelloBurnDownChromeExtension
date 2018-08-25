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

export function getChartData(params) {
  return new Promise((resolve, reject) => {
    $.get(`${localStorage.getItem('baseUrl')}/getSprintPoint`, params, function(data) {
      //TODO: APIリクエストがエラーだった場合のエラーハンドリング
      var result = {
        status: "OK",
        "data": data
      };
      var data = JSON.parse(result.data);
      resolve(data);
    });
  });
}

export function registerWebhook(boardId, baseUrl, token, devKey) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.trello.com/1/webhooks/?idModel=${boardId}&callbackURL=${baseUrl}/execRegisterPoint&token=${token}&key=${devKey}`, {
        method: 'POST'
      })
      .then(res => res.json)
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
