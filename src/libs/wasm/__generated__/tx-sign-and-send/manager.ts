/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { ApiPromise } from '@polkadot/api';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import { txSignAndSend } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/manager';
import type BN from 'bn.js';
// @ts-ignore
import type {EventRecord} from "@polkadot/api/submittable";
import {decodeEvents} from "../shared/utils";


export default class Methods {
	private __nativeContract : ContractPromise;
	private __keyringPair : KeyringPair;
	private __apiPromise: ApiPromise;

	constructor(
		apiPromise: ApiPromise,
		nativeContract : ContractPromise,
		keyringPair : KeyringPair,
	) {
		this.__apiPromise = apiPromise;
		this.__nativeContract = nativeContract;
		this.__keyringPair = keyringPair;
	}

	/**
	* setPriceOracle
	*
	* @param { ArgumentTypes.AccountId } newOracle,
	*/
	"setPriceOracle" (
		newOracle: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::setPriceOracle", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [newOracle], __options);
	}

	/**
	* setController
	*
	* @param { ArgumentTypes.AccountId } address,
	*/
	"setController" (
		address: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::setController", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [address], __options);
	}

	/**
	* supportMarket
	*
	* @param { ArgumentTypes.AccountId } pool,
	*/
	"supportMarket" (
		pool: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::supportMarket", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [pool], __options);
	}

	/**
	* setMintGuardianPaused
	*
	* @param { ArgumentTypes.AccountId } pool,
	* @param { boolean } paused,
	*/
	"setMintGuardianPaused" (
		pool: ArgumentTypes.AccountId,
		paused: boolean,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::setMintGuardianPaused", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [pool, paused], __options);
	}

	/**
	* setBorrowGuardianPaused
	*
	* @param { ArgumentTypes.AccountId } pool,
	* @param { boolean } paused,
	*/
	"setBorrowGuardianPaused" (
		pool: ArgumentTypes.AccountId,
		paused: boolean,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::setBorrowGuardianPaused", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [pool, paused], __options);
	}

	/**
	* setBorrowCap
	*
	* @param { ArgumentTypes.AccountId } pool,
	* @param { (string | number | BN) } newCap,
	*/
	"setBorrowCap" (
		pool: ArgumentTypes.AccountId,
		newCap: (string | number | BN),
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::setBorrowCap", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [pool, newCap], __options);
	}

	/**
	* reduceReserves
	*
	* @param { ArgumentTypes.AccountId } pool,
	* @param { (string | number | BN) } amount,
	*/
	"reduceReserves" (
		pool: ArgumentTypes.AccountId,
		amount: (string | number | BN),
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::reduceReserves", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [pool, amount], __options);
	}

	/**
	* setLiquidationIncentiveMantissa
	*
	* @param { ArgumentTypes.WrappedU256 } newLiquidationIncentiveMantissa,
	*/
	"setLiquidationIncentiveMantissa" (
		newLiquidationIncentiveMantissa: ArgumentTypes.WrappedU256,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::setLiquidationIncentiveMantissa", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [newLiquidationIncentiveMantissa], __options);
	}

	/**
	* setCloseFactorMantissa
	*
	* @param { ArgumentTypes.WrappedU256 } newCloseFactorMantissa,
	*/
	"setCloseFactorMantissa" (
		newCloseFactorMantissa: ArgumentTypes.WrappedU256,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::setCloseFactorMantissa", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [newCloseFactorMantissa], __options);
	}

	/**
	* controller
	*
	*/
	"controller" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "manager::controller", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [], __options);
	}

	/**
	* grantRole
	*
	* @param { (number | string | BN) } role,
	* @param { ArgumentTypes.AccountId } account,
	*/
	"grantRole" (
		role: (number | string | BN),
		account: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "accessControl::grantRole", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [role, account], __options);
	}

	/**
	* getRoleAdmin
	*
	* @param { (number | string | BN) } role,
	*/
	"getRoleAdmin" (
		role: (number | string | BN),
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "accessControl::getRoleAdmin", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [role], __options);
	}

	/**
	* hasRole
	*
	* @param { (number | string | BN) } role,
	* @param { ArgumentTypes.AccountId } address,
	*/
	"hasRole" (
		role: (number | string | BN),
		address: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "accessControl::hasRole", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [role, address], __options);
	}

	/**
	* revokeRole
	*
	* @param { (number | string | BN) } role,
	* @param { ArgumentTypes.AccountId } account,
	*/
	"revokeRole" (
		role: (number | string | BN),
		account: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "accessControl::revokeRole", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [role, account], __options);
	}

	/**
	* renounceRole
	*
	* @param { (number | string | BN) } role,
	* @param { ArgumentTypes.AccountId } account,
	*/
	"renounceRole" (
		role: (number | string | BN),
		account: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "accessControl::renounceRole", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, "manager");
		}, [role, account], __options);
	}

}