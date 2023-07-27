import { ImmutableX, Config, CreateMetadataRefreshRequest } from '@imtbl/core-sdk';


  const component = '[IMX-REFRESH-METADATA]';

  const collectionContractAddress = '0xe4fd7b800F30Fe7985023ed457902aF5D0Eb9eA6';
  const client = new ImmutableX(Config.PRODUCTION);
(async() => {
    const response = await client.listAssets({
        collection: collectionContractAddress,
        orderBy: 'updated_at'
    });
})
