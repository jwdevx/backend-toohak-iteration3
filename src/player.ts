
export function playerJoin(sessionId: number, name: string): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function playerStatus(playerId: number): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function playerQuestionPositionInfo(playerId: number, questionPosition: number): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function playerQuestionAnswerSubmit(playerId: number, questionPosition: number, answerIds: number[]): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function playerQuestionResults(playerId: number, questionPosition: number): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function playerFinalResults(playerId: number): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function playerReturnAllChat(playerId: number): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export interface message {
    messageBody: string;
  }
export function playerSendChat(playerId: number, message: message): Record<string, never> {
  // TODO update typescript return types
  return {};
}
