import { extendEnvironment } from "hardhat/config";
import laikaSync from "./tasks/laika-sync";
import "./tasks/laika-sync";

import "./type-extensions";

extendEnvironment((hre) => {
  hre.laikaSync = laikaSync;
});
