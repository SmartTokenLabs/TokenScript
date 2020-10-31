export interface EthersData {
  provider: any;
  signer: any;
  userAddress: string;
  chainID: string;
}

export interface EthereumCallParams {
  params: [any];
  ethCallAttributtes: {contract?: string, function?: string};
}

export interface ContractAddress {
  contractAddress: string;
  contractInterface?: string;
}

export interface ERC20Props {
  decimals?: number;
  ownerBalance?: number;
  tokenId?: string;
}

