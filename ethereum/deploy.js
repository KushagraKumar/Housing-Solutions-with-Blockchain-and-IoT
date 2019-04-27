const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/FactoryLease.json');

const provider = new HDWalletProvider(
  'lemon ancient left sign april casino verify install curve lion mention cram',
  'https://rinkeby.infura.io/v3/35392766664743739eaec8f8e6af63f1'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: '0x' + compiledFactory.bytecode })
    .send({ gas: '2000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
