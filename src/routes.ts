import {
  assignRole,
  createRole,
  deleteRole,
  listRoles,
  listUsersWithRole,
  removeRole,
} from './feature/role';
import {
  sendStatus,
  setupBot,
  startWatching,
  stopWatching,
} from './feature/status';
import { CommandArgObj } from './helpers/command';

type RouteCallback = (command: CommandArgObj) => Promise<string>;
type Routes = {
  [key: string]: RouteCallback | { [key: string]: RouteCallback };
};

export const routes: Routes = {
  setup: setupBot,
  watch: startWatching,
  stop: stopWatching,
  poripori: sendStatus,
  role: {
    create: createRole,
    delete: deleteRole,
    list: listRoles,
    user: listUsersWithRole,
    as: assignRole,
    remove: removeRole,
  },
};

export function handleRoute(commandObj: CommandArgObj) {
  const { command, args } = commandObj;
  if (typeof routes[command] === 'function') return routes[command];
  const hasNestedRoutes = Object.keys(routes[command]).length > 0;
  if (!hasNestedRoutes)
    throw new Error(`No route found for command: ${command}`);
  const firstArg = args[0];
  return routes[command][firstArg];
}
