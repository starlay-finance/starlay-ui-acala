// @ts-nocheck
// @ts-nocheck
// @ts-nocheck
// @ts-nocheck
import type * as EventTypes from '../event-types/manager';
import type {ContractPromise} from "@polkadot/api-contract";
import type {ApiPromise} from "@polkadot/api";
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/manager.json';
import {getEventTypeDescription} from "../shared/utils";
import {handleEventReturn} from "@727-ventures/typechain-types";

export default class EventsClass {
	private __nativeContract : ContractPromise;
	private __api : ApiPromise;

	constructor(
		nativeContract : ContractPromise,
		api : ApiPromise,
	) {
		this.__nativeContract = nativeContract;
		this.__api = api;
	}

	public subscribeOnRoleAdminChangedEvent(callback : (event : EventTypes.RoleAdminChanged) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('RoleAdminChanged', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.RoleAdminChanged);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'RoleAdminChanged');
	}

	public subscribeOnRoleGrantedEvent(callback : (event : EventTypes.RoleGranted) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('RoleGranted', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.RoleGranted);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'RoleGranted');
	}

	public subscribeOnRoleRevokedEvent(callback : (event : EventTypes.RoleRevoked) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('RoleRevoked', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.RoleRevoked);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'RoleRevoked');
	}


	private __subscribeOnEvent(
		callback : (args: any[], event: any) => void,
		filter : (eventName: string) => boolean = () => true
	) {
		// @ts-ignore
		return this.__api.query.system.events((events) => {
			events.forEach((record: any) => {
				const { event } = record;

				if (event.method == 'ContractEmitted') {
					const [address, data] = record.event.data;

					if (address.toString() === this.__nativeContract.address.toString()) {
						const {args, event} = this.__nativeContract.abi.decodeEvent(data);

						if (filter(event.identifier.toString()))
							callback(args, event);
					}
				}
			});
		});
	}

}