import {
  ClaimType,
  AuthType,
  SignatureRequest,
  AuthRequest,
  ClaimRequest,
  SismoConnectConfig,
} from "@sismo-core/sismo-connect-client";

export { ClaimType, AuthType };

// using impersonate for development purposes
// Never use this in production
export const CONFIG: SismoConnectConfig = {
  appId: "0xbc8550f1e4b1ba0f47296aa5feff6692",
  vault: {
    // Never use this in production
    impersonate: [
      // EVM Data Sources
      "dhadrien.sismo.eth",
      // Github Data Source
      "github:dhadrien",
      // Twitter Data Source
      "twitter:dhadrien_",
      // Telegram Data Source
      "telegram:dhadrien",
    ],
  },
  //displayRawResponse: true
};


export const AUTHS: AuthRequest[] = [
  // Anonymous identifier of the vault for this app
  // vaultId = hash(vaultSecret, appId)
  { authType: AuthType.VAULT },
  {
    authType: AuthType.EVM_ACCOUNT,
  },
  //{ authType: AuthType.GITHUB, isOptional: true, isSelectableByUser: true },
];

