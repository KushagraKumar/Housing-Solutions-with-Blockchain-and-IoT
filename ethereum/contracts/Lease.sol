//Write your own contracts here. Currently compiles using solc v0.4.15+commit.bbb8e64f.
pragma solidity ^0.4.17;

contract FactoryLease {
  address[] public contractList;
  mapping(address => address[]) managerContractList;
  mapping(address => bool) managerList;
  uint public managerCount;


  function FactoryLease() public {
    managerCount = 0;
  }

  function createLease(uint scrity, string dscription, uint rnt, string name) public {
    address newLease = new LeaseHouse(scrity,dscription,rnt,name,msg.sender);
    contractList.push(newLease);

    if(!managerList[msg.sender]) {
      managerCount++;
    }

    managerList[msg.sender] = true;
    managerContractList[msg.sender].push(newLease);
  }

  function deleteEntry(address toBeDeleted) public {
    require(managerList[msg.sender]);

    bool found = false;
    for(uint i=0;i<managerContractList[msg.sender].length;i++)
    {
      if(managerContractList[msg.sender][i] == toBeDeleted)
        found = true;
    }

    require(found);

    uint flag = 0;
    for(uint index=0;index<contractList.length;index++)
    {
      if(contractList[i] == toBeDeleted)
        flag = index;
    }

    if(flag == 0) return;

    if(contractList.length > 1)
      contractList[flag] = contractList[contractList.length - 1];

    contractList.length--;
  }

  function returnContractList() public view returns (address[]) {
        return contractList;
  }

  function searchManager(address manager_address) public view returns (bool) {
    return managerList[manager_address];
  }

  function getManagerContracts(address manager_address) public view returns(address[]) {
    return managerContractList[manager_address];
  }
}

contract LeaseHouse {
  address public manager;
  uint public security;
  bool public available;
  string public description;
  address[] public tenants;
  uint public popularity;
  uint public rentPerDay;
  string public rentingTime;
  uint public timeOfStay;
  string public name;
  uint public motorOn;

  //  Constructor Function for LeaseHouse
  function LeaseHouse(uint scrity, string dscription, uint rnt, string nm, address creator) public {
    security = scrity;
    manager = creator;
    description = dscription;
    available = true;
    popularity = 0;
    rentPerDay = rnt;
    rentingTime = '';
    timeOfStay = 0;
    name = nm;
    motorOn = 0;
  }

  modifier restricted() {
       require(msg.sender == manager);
       _;
   }

  function lease(string renting_time, uint time_of_stay) public payable {
    uint totalAmt = security + rentPerDay*time_of_stay;
    require(msg.value >= totalAmt);
    require(available);

    available = false;
    motorOn = 1;
    popularity++;
    tenants.push(msg.sender);
    timeOfStay = time_of_stay;
    rentingTime = renting_time;
  }

  function editDetails(uint new_security, string new_description, uint rent_per_day,string nm, bool new_status) public restricted {
    security = new_security;
    description = new_description;
    rentPerDay = rent_per_day;
    available = new_status;
    name = nm;
  }

  function returnSecurity() public {
    uint len = tenants.length;
    require(tenants[len - 1] == msg.sender);

    msg.sender.transfer(security);
    manager.transfer(this.balance);

    available = true;
    rentingTime = '';
    timeOfStay = 0;
    motorOn = 0;
  }

  function deductSecurity(uint deduction) public {
    uint len = tenants.length;
    require(tenants[len - 1] == msg.sender);

    if(deduction < security) {
      msg.sender.transfer(security - deduction);
    }
    manager.transfer(this.balance);

    available = true;
    rentingTime = '';
    timeOfStay = 0;
    motorOn = 0;
  }

  function getSummary() public view returns (
    address, uint, bool, string, uint, uint,string,uint
    ) {
      return (
        manager,
        security,
        available,
        description,
        popularity,
        rentPerDay,
        name,
        motorOn
        );
    }

    function getMotorValue() public view returns (uint) {
      uint len = tenants.length;
      require(tenants[len - 1] == msg.sender);

      return motorOn;
    }

    function getAvailabilty() public view returns (bool) {
      return available;
    }

    function getName() public view returns(string) {
      return name;
    }
}
