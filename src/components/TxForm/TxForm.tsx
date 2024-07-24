import React, {useCallback, useState} from 'react';
import ReactJson from 'react-json-view';
import './style.scss';
import {SendTransactionRequest, useTonConnectUI, useTonWallet, Wallet} from "@tonconnect/ui-react";
import TonWeb from 'tonweb'
import { JettonWallet } from 'tonweb/dist/types/contract/token/ft/jetton-wallet';

// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.
const defaultTx: SendTransactionRequest = {
	// The transaction is valid for 10 minutes from now, in unix epoch seconds.
	validUntil: Math.floor(Date.now() / 1000) + 600,
	messages: [
		{
			address: 'UQCCJjwbdw9gXLnV9jOmNspqYKhzcVKVlUxShkTHLisynVrW',
			amount: '500000',
		},
	],
};

const toAddress = "UQCCJjwbdw9gXLnV9jOmNspqYKhzcVKVlUxShkTHLisynVrW";



async function sendSignData() {
	try {
		console.log("start signData")
		const Cell = TonWeb.boc.Cell;
		const cell = new Cell();
		cell.bits.writeString("hello world")   
		var cellBytes = await cell.toBoc()    
		
		var payload = {
			"schema_crc": 0x754bf91b,
			"cell": TonWeb.utils.bytesToBase64(cellBytes),
			"publicKey": null
		};
		(window as any).gatetonwallet.tonconnect.signData(payload)
		.then((res: any) => {
			console.log(JSON.stringify(res))
		})
		.catch((error: any) => {
			console.log(error)
		})
	} catch(e) {
		console.log("error: ", e)
	}
}

async function  sendJettonWithComment(wallet: Wallet) {
	const Cell = TonWeb.boc.Cell;
	const cell = new Cell();
	cell.bits.writeUint(0, 32)
	cell.bits.writeString("hello, ton")
	const cellBody = new Cell();
	cellBody.bits.writeUint(0xf8a7ea5, 32)
	cellBody.bits.writeUint(0, 64)
	cellBody.bits.writeCoins(1000000)
	cellBody.bits.writeAddress(new TonWeb.Address(toAddress))
	cellBody.bits.writeAddress(new TonWeb.Address(wallet.account.address))
	cellBody.bits.writeBit(0)
	cellBody.bits.writeCoins(100000000)
	cellBody.bits.writeBit(1)
	cellBody.writeCell(cell)
	var payload = TonWeb.utils.bytesToBase64(await cellBody.toBoc());

	var transaction = 
	{
		// The transaction is valid for 10 minutes from now, in unix epoch seconds.
		validUntil: Math.floor(Date.now() / 1000) + 600,
		messages: [
			{
				address: 'EQC_Jg1ChQp363bEV7fKPMQ_aJQv1xwOKZs-Ygds8rvyjFFC',
				amount: '500000',
				payload: payload
			},
		],
	}
	return transaction;
}

async function test() {
	try {
		console.log("start signData")
		const Cell = TonWeb.boc.Cell;
		const cell = new Cell();
		cell.bits.writeString("hello world"); 
		var cellBytes = await cell.toBoc(); 
		
		var payload = {
			"schema_crc": 0x754bf91b,
			"cell": TonWeb.utils.bytesToBase64(cellBytes),
			"publicKey": null
		};
		console.log("payload:", JSON.stringify(payload));
		(window as any).gatetonwallet.tonconnect.signData(payload)
		.then((res: any) => {
			console.log("result:", JSON.stringify(res))
		})
		.catch((error: any) => {
			console.log(error)
		})
	} catch(e) {
		console.log("error: ", e)
	}
}


async function switchTest() {
	(window as any).ethereum.request({
		method: 'wallet_switchEthereumChain',
		params: [{ chainId: 0x89 }],
	}).then((res: any) => {
		console.log("siwtch gogogo");


		(window as any).ethereum.request({
			method: 'eth_chainId',
			params: [],
		}).then((res: any) => {
			console.log("chain id: ", res);
		}).catch((e:any) => {
			console.log("chain error: ", e)
		})
	}).catch((e:any) => {
		console.log("e:", e)
	})


}

export function TxForm() {
	const [tx, setTx] = useState(defaultTx);
	const wallet = useTonWallet();
	const [tonConnectUi] = useTonConnectUI();

	if(wallet) {
		console.log("pub:", JSON.stringify(wallet.account.publicKey));
		console.log("address:", JSON.stringify(wallet.account.address));
	}

	const onChange = useCallback((value: object) => setTx((value as { updated_src: typeof defaultTx }).updated_src), []);

	return (
		<div className="send-tx-form">
			<h3>Configure and send transaction</h3>
			<ReactJson src={defaultTx} theme="ocean" onEdit={onChange} onAdd={onChange} onDelete={onChange} />
			{wallet ? (
				<button onClick={() => tonConnectUi.sendTransaction(tx)}>
					Send transaction
				</button>
			) : (
				<button onClick={() => tonConnectUi.openModal()}>Connect wallet to send the transaction</button>
			)}
			
			<button onClick={() => { test()}}>signData test</button>

			<button onClick={async () => { tonConnectUi.sendTransaction(await sendJettonWithComment(wallet!))}}>send usdt test</button>

			<button onClick={() => switchTest()}></button>
		</div>
	);
}
