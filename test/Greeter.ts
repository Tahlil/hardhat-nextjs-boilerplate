import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, waffle} from 'hardhat';
import GreeterArtifact from '../artifacts/contracts/Greeter.sol/Greeter.json';
import {Greeter} from '../typechain/Greeter';

const {deployContract} = waffle;

describe("Greeter test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployOnceFixture() {
    let greeter: Greeter;
    // Contracts are deployed using the first signer/account by default
    const [owner, ...otherAccounts] = await ethers.getSigners();

    greeter = (await deployContract(owner, GreeterArtifact, ['Hello, world!'])) as Greeter;

    return { greeter, owner, otherAccounts };
  }

  describe("Test suite", function () {
    it("Test 1", async function () {
      const { greeter, owner } = await loadFixture(deployOnceFixture);
      expect(true);
    });

    it("Test 2", async function () {
      const { greeter, owner } = await loadFixture(deployOnceFixture);
      expect(1).to.equal(1);
    });



  });

 
});
