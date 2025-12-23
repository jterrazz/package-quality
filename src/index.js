import oxfmtConfig from "./oxfmt/index.json" with { type: "json" };
import expoConfig from "./oxlint/expo.json" with { type: "json" };
import nextjsConfig from "./oxlint/nextjs.json" with { type: "json" };
import nodeConfig from "./oxlint/node.json" with { type: "json" };

export const oxfmt = oxfmtConfig;

export const oxlint = {
  expo: expoConfig,
  nextjs: nextjsConfig,
  node: nodeConfig,
};

export default { oxfmt, oxlint };
