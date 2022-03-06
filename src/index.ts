import { extendEnvironment, extendConfig } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import laikaSync from "./tasks/laika-sync";
import "./tasks/laika-sync";

import "./type-extensions";

extendEnvironment((hre) => {
  hre.laikaSync = laikaSync;
});

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    if (userConfig.laika) {
      config.laika = userConfig.laika;
    }
  }
);
