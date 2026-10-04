import type pg from "pg";
import type { Config } from "../../config.js";
import { changeAlias, ownAliases } from "./aliases.js";
import { changeDependent, dependentState } from "./dependents.js";
import { enroll, joinExisting } from "./enrollment.js";
import { changeHousehold, householdState } from "./household.js";
import type { Principal } from "./policy.js";
import { transaction } from "./repository.js";
import {
  assertCurrent,
  changeDevice,
  currentPrincipal,
  listDevices,
} from "./sessions.js";
import { currentAdult, updateSettings } from "./settings.js";
export function createIdentity(
  pool: pg.Pool,
  config: Config,
  clock = () => new Date(),
) {
  const read = <T>(
    principal: Principal,
    work: (db: pg.PoolClient) => Promise<T>,
  ) =>
    transaction(pool, async (db) => {
      await assertCurrent(db, principal, clock());
      return work(db);
    });
  return {
    join: (headers: Headers, input: Parameters<typeof joinExisting>[3]) =>
      joinExisting(pool, config, headers, input, clock()),
    pool,
    config,
    clock,
    principal: (headers: Headers) =>
      currentPrincipal(pool, config, headers, clock()),
    enroll: (input: Parameters<typeof enroll>[2]) =>
      enroll(pool, config, input, clock()),
    me: (p: Principal) => read(p, (db) => currentAdult(db, p)),
    settings: (p: Principal, input: Parameters<typeof updateSettings>[2]) =>
      updateSettings(pool, p, input, clock()),
    household: (p: Principal) =>
      read(p, (db) => householdState(db, p, clock())),
    householdCommand: (
      p: Principal,
      input: Parameters<typeof changeHousehold>[3],
    ) => changeHousehold(pool, config, p, input, clock()),
    devices: (p: Principal) => read(p, (db) => listDevices(db, p, clock())),
    deviceCommand: (p: Principal, input: Parameters<typeof changeDevice>[2]) =>
      changeDevice(pool, p, input, clock),
    dependents: (p: Principal) =>
      read(p, (db) => dependentState(db, p, clock())),
    dependentCommand: (
      p: Principal,
      input: Parameters<typeof changeDependent>[2],
    ) => changeDependent(pool, p, input, clock()),
    aliases: (p: Principal) => read(p, (db) => ownAliases(db, p)),
    aliasCommand: (p: Principal, input: Parameters<typeof changeAlias>[2]) =>
      changeAlias(pool, p, input, clock()),
  };
}
export type Identity = ReturnType<typeof createIdentity>;
export type { Principal } from "./policy.js";
export { canUseDependent } from "./policy.js";
