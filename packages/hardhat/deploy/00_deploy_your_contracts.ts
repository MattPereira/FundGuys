import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Mycologuys", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const mycologuys = await hre.ethers.getContract<Contract>("Mycologuys", deployer);

  await deploy("PublicGoodsFunding", {
    from: deployer,
    // Contract constructor arguments
    args: [mycologuys.target],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const publicGoodsFunding = await hre.ethers.getContract<Contract>("PublicGoodsFunding", deployer);

  // transfer ownership to restrict nft minting to only the PublicGoodsFunding contract
  await mycologuys.transferOwnership(publicGoodsFunding.target);

  // Convert date "2024-05-05" to Unix timestamp
  const title = "FundGuys";
  const description = "A public goods funding platform on Base that rewards funders with Mycologuys NFTs";
  const usdcContractAddress = "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359";
  const targetAmount = hre.ethers.formatUnits(420, 6);
  const date = new Date("2024-05-05");
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  const imageUrl =
    "https://lirp.cdn-website.com/73732851/dms3rep/multi/opt/defi-for-good-logo-circle-blue-white-text-v1-432w.png";

  await publicGoodsFunding.createProject(
    title,
    description,
    usdcContractAddress,
    targetAmount,
    unixTimestamp,
    imageUrl,
  );
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["main"];
