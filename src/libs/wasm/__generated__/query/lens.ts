/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import type { QueryReturnType } from '@727-ventures/typechain-types';
import { queryJSON, queryOkJSON, handleReturnType } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/lens';
import type * as ReturnTypes from '../types-returns/lens';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@727-ventures/typechain-types';
import {getTypeDescription} from './../shared/utils';


export default class Methods {
	private __nativeContract : ContractPromise;
	private __apiPromise: ApiPromise;
	private __callerAddress : string;

	constructor(
		nativeContract : ContractPromise,
		nativeApi : ApiPromise,
		callerAddress : string,
	) {
		this.__nativeContract = nativeContract;
		this.__callerAddress = callerAddress;
		this.__apiPromise = nativeApi;
	}

	/**
	* poolMetadata
	*
	* @param { ArgumentTypes.AccountId } pool,
	* @returns { Result<ReturnTypes.PoolMetadata, ReturnTypes.LangError> }
	*/
	"poolMetadata" (
		pool: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.PoolMetadata, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "poolMetadata", [pool], __options , (result) => { return handleReturnType(result, getTypeDescription(6, 'lens')); });
	}

	/**
	* poolMetadataAll
	*
	* @param { Array<ArgumentTypes.AccountId> } pools,
	* @returns { Result<Array<ReturnTypes.PoolMetadata>, ReturnTypes.LangError> }
	*/
	"poolMetadataAll" (
		pools: Array<ArgumentTypes.AccountId>,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Array<ReturnTypes.PoolMetadata>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "poolMetadataAll", [pools], __options , (result) => { return handleReturnType(result, getTypeDescription(16, 'lens')); });
	}

	/**
	* poolBalances
	*
	* @param { ArgumentTypes.AccountId } pool,
	* @param { ArgumentTypes.AccountId } account,
	* @returns { Result<ReturnTypes.PoolBalances, ReturnTypes.LangError> }
	*/
	"poolBalances" (
		pool: ArgumentTypes.AccountId,
		account: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.PoolBalances, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "poolBalances", [pool, account], __options , (result) => { return handleReturnType(result, getTypeDescription(18, 'lens')); });
	}

	/**
	* poolBalancesAll
	*
	* @param { Array<ArgumentTypes.AccountId> } pools,
	* @param { ArgumentTypes.AccountId } account,
	* @returns { Result<Array<ReturnTypes.PoolBalances>, ReturnTypes.LangError> }
	*/
	"poolBalancesAll" (
		pools: Array<ArgumentTypes.AccountId>,
		account: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Array<ReturnTypes.PoolBalances>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "poolBalancesAll", [pools, account], __options , (result) => { return handleReturnType(result, getTypeDescription(20, 'lens')); });
	}

	/**
	* poolUnderlyingPrice
	*
	* @param { ArgumentTypes.AccountId } pool,
	* @returns { Result<ReturnTypes.PoolUnderlyingPrice, ReturnTypes.LangError> }
	*/
	"poolUnderlyingPrice" (
		pool: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.PoolUnderlyingPrice, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "poolUnderlyingPrice", [pool], __options , (result) => { return handleReturnType(result, getTypeDescription(22, 'lens')); });
	}

	/**
	* poolUnderlyingPriceAll
	*
	* @param { Array<ArgumentTypes.AccountId> } pools,
	* @returns { Result<Array<ReturnTypes.PoolUnderlyingPrice>, ReturnTypes.LangError> }
	*/
	"poolUnderlyingPriceAll" (
		pools: Array<ArgumentTypes.AccountId>,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Array<ReturnTypes.PoolUnderlyingPrice>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "poolUnderlyingPriceAll", [pools], __options , (result) => { return handleReturnType(result, getTypeDescription(24, 'lens')); });
	}

}