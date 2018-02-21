var express = require('express');
var router = express.Router();
var bignumber = require('bignumber');
var CryptoJs = require('crypto-js');
var Utf8 = require('utf8');
var Web3 = require('web3');
var $ = require('jquery');

var url = "http://192.168.99.100:8545";
// var user_name;
var web3 = new Web3;
var provider = new web3.providers.HttpProvider(url);
web3.setProvider(provider);

// //web3で接続しているか確認
// web3.eth.defaultAccount = web3.eth.accounts[0];
// var coinbase = web3.eth.coinbase;
// var balance = web3.eth.getBalance(coinbase);
// console.log("balance:", balance);
console.log(web3.eth.defaultAccount)

// これがコントラクトにアクセスする方法だ：
var ABI = [
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
var ZombieFactoryContract = web3.eth.contract(ABI)
var contractFactoryAddress = "0x692a70d2e424a56d2c6c27aa97d1a86395877b3a";
var ZombieFactory = ZombieFactoryContract.at(contractFactoryAddress);

// `ZombieFactory`はコントラクトのpublic関数とイベントにアクセスできるようになったぞ。
var abi = [
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
var ZombieFeedingContract = web3.eth.contract(abi);
var contractFeedingAddress = "0xbbf289d846208c16edc8474705c748aff07732db";
var ZombieFeeding = ZombieFeedingContract.at(contractFeedingAddress);

var abiBattle = [
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
		"constant": false,
		"inputs": [],
		"name": "withdraw",
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
	}
]

var ZombieBattleContract = web3.eth.contract(abiBattle);
var contractBattleAddress = "0xbbf289d846208c16edc8474705c748aff07732db";
var ZombieBattle = ZombieBattleContract.at(contractBattleAddress);

router.post('/battling', function (req, res) {
	console.log(ZombieBattle.attack);
	var dna = ZombieBattle.attack(req.body.params[0], req.body.params[1]);
	res.send(["noname", dna]);
});

router.post('/post', function (req, res) {
  var name = req.body.params;
  var dna = ZombieFactory.createRandomZombie(name);
  console.log(dna);
  res.send([name,dna]);
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('battle', { title: 'Battle Zombies' });
});

module.exports = router;
