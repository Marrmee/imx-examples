import { ethers } from 'ethers';
import { ImmutableX, Config, CreateMetadataRefreshRequest } from '@imtbl/core-sdk';

(async () => {

  const collectionContractAddress = '0xe4fd7b800F30Fe7985023ed457902aF5D0Eb9eA6';
  const ethSigner = new ethers.Wallet("0x8613e7ffe090c1c070ea51128f4d13fa0d66cc291d277edab3283a2abaa340a2");
  const client = new ImmutableX(Config.PRODUCTION);

  const response = await client.listAssets({
      collection: collectionContractAddress,
      orderBy: 'updated_at',
      pageSize: 200
  });

  if(response.remaining > 0) {
    for(let i = 0; i < response.remaining; i++) {
      await client.listAssets({
        collection: collectionContractAddress,
        orderBy: 'updated_at',
        pageSize: 200,
        cursor: response.cursor
      });
    }
  }
  const tokenIds: string[] = response.result.map((asset) => asset.token_id);
  console.log(tokenIds);

  const metadataRefreshParams: CreateMetadataRefreshRequest = {
      collection_address: collectionContractAddress,
      token_ids: tokenIds,
    };

  try {
    const metadataRefreshResponse = await client.createMetadataRefresh(ethSigner, metadataRefreshParams);
    console.log('metadataRefreshResponse', metadataRefreshResponse);
    const refresh_id = metadataRefreshResponse.refresh_id;
    const getMetadataRefreshResultsResponse = await client.getMetadataRefreshResults(ethSigner, refresh_id);
    const log = JSON.stringify(getMetadataRefreshResultsResponse);
    console.log(log);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
})