import React, {useCallback, useState} from 'react';
import ReactJson from 'react-json-view';
import './style.scss';
import {SendTransactionRequest, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import { beginCell, toNano, Address } from '@ton/core'

// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.
const defaultTx: SendTransactionRequest = {
	// The transaction is valid for 10 minutes from now, in unix epoch seconds.
	validUntil: Math.floor(Date.now() / 1000) + 600,
	messages: [

		{
			// The receiver's address.
			address: 'UQCCJjwbdw9gXLnV9jOmNspqYKhzcVKVlUxShkTHLisynVrW',
			// Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
			amount: '500000',
		},

		// Uncomment the following message to send two messages in one transaction.
		/*
    {
      // Note: Funds sent to this address will not be returned back to the sender.
      address: 'UQAuz15H1ZHrZ_psVrAra7HealMIVeFq0wguqlmFno1f3B-m',
      amount: toNano('0.01').toString(),
    }
    */

	],
};

const toAddress = "UQCCJjwbdw9gXLnV9jOmNspqYKhzcVKVlUxShkTHLisynVrW";


function getTranserJettonContent(from: string) {
	var jettonWalletContract = ""
	var body = beginCell()
	.storeUint(0, 32)                         // query_id:uint64
	.storeStringTail("hello worl")                       // forward_payload:(Either Cell ^Cell)
	.endCell();

	return {
		validUntil: Math.floor(Date.now() / 1000) + 600,
		messages: [
		{
			// The receiver's address.
			address: jettonWalletContract,
			// Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
			amount: toNano(0.05).toString(),
			payload: body.toBoc().toString("base64") 
		},
	],
	}
}

function sendSignData() {
	var body = beginCell()
	.storeUint(0, 32)                         // query_id:uint64
	.storeStringTail("hello world")                       // forward_payload:(Either Cell ^Cell)
	.endCell();

	var payload = {
		"schema_crc": 0x754bf91b,
		"cell": body.toBoc().toString('base64'),
		"publicKey": null
	};

	var requestMessage = {
		"method": "signData",
		"params": [JSON.stringify(payload)],
		"id": "12312312",
	};
	console.log(requestMessage);
	(window as any).tonkeeper.tonconnect.send(requestMessage)
	.then((res: any) => {
		console.log(res)
	})
	.catch((error: any) => {
		console.log(error)
	})
}


export function TxForm() {
	const [tx, setTx] = useState(defaultTx);
	const wallet = useTonWallet();
	const [tonConnectUi] = useTonConnectUI();

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
			
			<button onClick={() => { sendSignData()}}>send usdt test</button>
		</div>
	);
}
