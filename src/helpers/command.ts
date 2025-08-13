export type ParsedCommand = {
  command: string;
  args: string[];
};

export function parseCommand(commandString: string): ParsedCommand {
  const [command, ...args] = commandString.split(' ');
  return { command, args };
}

// リミット制限に達しているかどうかを確認する
export function isLimitReached(currentCount: number, limit: number): boolean {
  return currentCount >= limit;
}

// 応答機能が有効になっているかどうかを確認する
export function isResponseEnabled(): boolean {
  // ここに応答機能が有効かどうかのロジックを実装
  return true; // 仮の実装
}
