// If your plugin extends types from another plugin, you should import the plugin here.

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import "hardhat/types/config";
import "hardhat/types/runtime";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    laika?: LaikaConfig;
  }

  export interface LaikaConfig {
    apiKey: string;
  }

  export interface HardhatConfig {
    laika: LaikaConfig;
  }
}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    laikaSync: (
      hre: HardhatRuntimeEnvironment,
      contract: string,
      contractAddress: string
    ) => Promise<void>;
  }
}
