export function initialWebhookState(webhookId, board, isRegistered) {
  return {
    webhookId: webhookId,
    boardId: board.id,
    boardName: board.name,
    backgroundImage: board.prefs.backgroundImageScaled ? board.prefs.backgroundImageScaled[0].url : null,
    "isRegistered": isRegistered,
    isloading: false
  };
}
