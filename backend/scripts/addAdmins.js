// scripts/addAdmin.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const carMaintenanceLoyalty = await hre.ethers.getContractFactory("CarMaintenanceLoyalty");
  const contract = carMaintenanceLoyalty.attach(contractAddress)

  
  try {
    await contract.addAdmins('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'); // Contract 'CarMaintenanceBook'
    await contract.addAdmins(deployer.address); // Owner
    await contract.addAdmins('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'); // Other Address
  } catch(error) {
    console.log(error)
  }
  console.log('Admin added successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
