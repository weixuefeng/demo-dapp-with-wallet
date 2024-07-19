import React, {useCallback, useState} from 'react';
import ReactJson from 'react-json-view';
import './style.scss';
import {SendTransactionRequest, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import TonWeb from 'tonweb'

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
