export interface Command {
  id: string
  handler: (...args: any[]) => any
}