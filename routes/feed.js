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
var ZombieFactoryContract = web3.eth.contract(ABI)
var contractFactoryAddress = "0xf45345de5d10ed56a562b997c095b16383071d1c";
var ZombieFactory = ZombieFactoryContract.at(contractFactoryAddress);
// `ZombieFactory`はコントラクトのpublic関数とイベントにアクセスできるようになったぞ。

var abi = [
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
		"constant": false,
		"inputs": [
			{
				"name": "_zombieId",
				"type": "uint256"
			},
			{
				"name": "_targetDna",
				"type": "uint256"
			},
			{
				"name": "_species",
				"type": "string"
			}
		],
		"name": "feedAndMultiply",
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
var ZombieFeedingContract = web3.eth.contract(abi);
var contractFeedingAddress = "0x0b622341b8329c00247738856602eaa19c6bc651";
var ZombieFeeding = ZombieFeedingContract.at(contractFeedingAddress);

// ゾンビのIDと捕食したい子猫のIDをすでに持っているものとする。
let zombieId = 1;
let kittyId = 1;

// クリプトキティの画像を取得するにはweb APIに照会する必要がある。
// この情報はブロックチェーンにはない。ウェブサーバーにあるだけだ。
// もし全ての情報がブロックチェーン上に格納されていれば、サーバーの
// 障害を心配することはなくなるがな。まぁこのゾンビゲームを気に入ってもらえなければ、
// APIを変更するか我々のアクセスをブロックするだけだ。問題ない ;)
let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId

// コントラクトのNewZombieイベントをリッスンして表示できるようにする部分だ：
ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  // この関数はレッスン1でやったのと同じようにゾンビを表示するものだ：
  generateZombie(result.zombieId, result.name, result.dna)
})



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Feeding human' });
});

module.exports = router;
