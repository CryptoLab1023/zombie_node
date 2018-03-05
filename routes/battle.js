var express = require('express');
var router = express.Router();
var bignumber = require('bignumber');
var CryptoJs = require('crypto-js');
var Utf8 = require('utf8');
var Web3 = require('web3');
var $ = require('jquery');
var SHA3 = require('sha3');
var util = require('util');

var url = "http://192.168.99.100:8545";
var web3 = new Web3;
var provider = new web3.providers.HttpProvider(url);
web3.setProvider(provider);

// //web3で接続しているか確認
// web3.eth.defaultAccount = web3.eth.accounts[0];
// var coinbase = web3.eth.coinbase;
// var balance = web3.eth.getBalance(coinbase);
// console.log("balance:", balance);
console.log(web3.eth.defaultAccount);

var ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_zombieId",
				"type": "uint256"
			},
			{
				"name": "_kittyId",
				"type": "uint256"
			}
		],
		"name": "feedOnKitty",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "zombies",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "dna",
				"type": "uint256"
			},
			{
				"name": "level",
				"type": "uint32"
			},
			{
				"name": "readyTime",
				"type": "uint32"
			},
			{
				"name": "winCount",
				"type": "uint16"
			},
			{
				"name": "lossCount",
				"type": "uint16"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "getZombiesByOwner",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "zombieToOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setKittyContractAddress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_zombieId",
				"type": "uint256"
			},
			{
				"name": "_newDna",
				"type": "uint256"
			}
		],
		"name": "changeDna",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			}
		],
		"name": "createRandomZombie",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAllZombies",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_zombieId",
				"type": "uint256"
			},
			{
				"name": "_newName",
				"type": "string"
			}
		],
		"name": "changeName",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_fee",
				"type": "uint256"
			}
		],
		"name": "setLevelUpFee",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_zombieId",
				"type": "uint256"
			},
			{
				"name": "_targetId",
				"type": "uint256"
			}
		],
		"name": "attack",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "zombieId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "dna",
				"type": "uint256"
			}
		],
		"name": "NewZombie",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	}
]

var ZombieBattleContract = web3.eth.contract(ABI);
var contractAddress = "0x1b9701d50c0cf6b10557793fa7c91082d8820242";
var ZombieContract = ZombieBattleContract.at(contractAddress);

web3.eth.contract(ABI).at("0x1b9701d50c0cf6b10557793fa7c91082d8820242")
var getAllZombiesAsync = util.promisify(ZombieContract.getAllZombies);
// var attackAsync = util.promisify(ZombieContract.attack.sendTransaction);
// var createRandomZombieAsync = util.promisify(ZombieContract.createRandomZombie);
var getZombiesByOwnerAsync = util.promisify(ZombieContract.getZombiesByOwner);

router.post('/battling', (req, res) => {
	var fromAccount = req.body.params[0];
	const transactionObject = {
		from: fromAccount,
		to: contractAddress,
		gas: 100000
	};
	ZombieContract.attack.sendTransaction(req.body.params[1], req.body.params[2], transactionObject, (error, result) => {
		if (!error) {
			console.log(result);
		}
	});
	res.send("battle");
});

router.post('/post', (req, res) => {
	var fromAccount = req.body.params[0];
	web3.eth.defaultAccount = fromAccount;
	var name = req.body.params[1];
	const transactionObject = {
		from: fromAccount,
		to: contractAddress,
		gas: 100000
	};
	console.log(transactionObject);
	ZombieContract.createRandomZombie.sendTransaction(name, (error, result) => {
		if (!error) {
			console.log(result);
		}
	});
	res.send(["post"]);
});

router.post('/load', async (req, res) => {
	var fromAccount = req.body.params;
	var myZombies = await getZombiesByOwnerAsync(fromAccount);
	var myZombieArray = myZombies.map(x => x.toNumber());
	console.log(myZombieArray);
	res.send(myZombieArray);
});

router.post('/getallzombie', async (req, res) => {
	var fromAccount = req.body.params;
	var ZombieLists = await getAllZombiesAsync();
	var ZombieArray = ZombieLists.map(x => x.toNumber());
	console.log(ZombieArray);
	res.send(ZombieArray);
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('battle', { title: 'Battle Zombies' });
});

module.exports = router;
