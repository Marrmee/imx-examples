import {
    ImmutableX,
    Config,
    CreateMetadataRefreshRequest,
  } from '@imtbl/core-sdk';
import { ethers } from 'ethers';

  
  (async () => {
    const collectionContractAddress = '0xe4fd7b800F30Fe7985023ed457902aF5D0Eb9eA6';
    const privateKey: string = process.env.REACT_APP_MINTER_PK ?? '';
    const ethSigner = new ethers.Wallet(privateKey);
    const client = new ImmutableX(Config.PRODUCTION);

    const response = await client.listAssets({
        collection: collectionContractAddress,
        orderBy: 'updated_at',
        pageSize: 200
    });
    const tokenIds: string[] = response.result.map((asset) => asset.token_id);
    console.log(tokenIds);
  
    const metadataRefreshParams: CreateMetadataRefreshRequest = {
      collection_address: collectionContractAddress,
      token_ids: tokenIds, // The tokens to refresh
    };

    try {
      const metadataRefreshResponse = await client.createMetadataRefresh(
        ethSigner,
        metadataRefreshParams,
      );
  
      console.log('metadataRefreshResponse', metadataRefreshResponse);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();