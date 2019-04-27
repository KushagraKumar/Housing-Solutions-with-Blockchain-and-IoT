import web3 from './web3';
import LeaseHouse from './build/LeaseHouse.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(LeaseHouse.interface), address);
};
