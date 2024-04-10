import { message } from './dataStore';
import { PlayerJoinReturn } from './returnInterfaces';

/**
 * To do comment
 */
export function playerJoin(sessionId: number, name: string): PlayerJoinReturn {
  return {playerId: randomIdGenertor()};
}

/**
 * To do comment
 */
export function playerStatus(playerId: number): Record<string, never> {
  return {};
}

/**
 * To do comment
 */
export function playerQuestionPositionInfo(playerId: number, questionPosition: number): Record<string, never> {
  return {};
}

/**
 * To do comment
 */
export function playerQuestionAnswerSubmit(playerId: number, questionPosition: number, answerIds: number[]): Record<string, never> {
  return {};
}

/**
 * To do comment
 */
export function playerQuestionResults(playerId: number, questionPosition: number): Record<string, never> {
  return {};
}

/**
 * To do comment
 */
export function playerFinalResults(playerId: number): Record<string, never> {
  return {};
}

/**
 * To do comment
 */
export function playerReturnAllChat(playerId: number): Record<string, never> {
  return {};
}

/**
 * To do comment
 */
export function playerSendChat(playerId: number, message: message): Record<string, never> {
  return {};
}

// ------------------------------------------------------------------------------
