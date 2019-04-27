import web3 from './web3';
import FactoryLease from './build/FactoryLease.json';

const instance = new web3.eth.Contract(
  JSON.parse(FactoryLease.interface),
  '0xfd4283d784e5d4496b13EA2748F3BD9d9b361c08'
);

export default instance;
