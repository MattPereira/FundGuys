import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Mycologuys", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  const mycologuys = await hre.ethers.getContract<Contract>("Mycologuys", deployer);

  await deploy("PublicGoodsFunding", {
    from: deployer,
    args: [mycologuys.target],
    log: true,
    autoMine: true,
  });
  const publicGoodsFunding = await hre.ethers.getContract<Contract>("PublicGoodsFunding", deployer);

  // transfer ownership to restrict nft minting to only the PublicGoodsFunding contract
  await mycologuys.transferOwnership(publicGoodsFunding.target);

  // create example projects
  const fundGuys = {
    title: "FundGuys",
    description: "A public goods funding platform on Base that rewards funders with Mycologuys NFTs",
    wethContractAddress: "0x4200000000000000000000000000000000000006".toLowerCase(), // wETH on Base
    targetAmount: hre.ethers.parseEther("0.05"),
    deadline: Math.floor(new Date("2024-04-20").getTime() / 1000),
    image: "https://fund-guys.vercel.app/thumbnail.jpg",
  };

  const buidlGuidl = {
    title: "BuidlGuild",
    description:
      "A curated group of Ethereum builders creating products, prototypes, and tutorials to enrich the web3 ecosystem",
    daiContractAddress: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb".toLowerCase(), // DAI on Base
    targetAmount: hre.ethers.parseEther("10.00"),
    deadline: Math.floor(new Date("2024-06-09").getTime() / 1000),
    image: "https://buidlguidl.com/assets/hero.png",
  };

  await publicGoodsFunding.createProject(
    fundGuys.title,
    fundGuys.description,
    fundGuys.wethContractAddress,
    fundGuys.targetAmount,
    fundGuys.deadline,
    fundGuys.image,
  );

  await publicGoodsFunding.createProject(
    buidlGuidl.title,
    buidlGuidl.description,
    buidlGuidl.daiContractAddress,
    buidlGuidl.targetAmount,
    buidlGuidl.deadline,
    buidlGuidl.image,
  );
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["main"];
