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

export const routes = {
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
