import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { CreateCollectionParams, ImmutableXClient, UpdateCollectionParams } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );
  const projectId = requireEnvironmentVariable('COLLECTION_PROJECT_ID');

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);
  const ownerPublicKey = wallet.publicKey;

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Creating collection...', collectionContractAddress);

  /**
   * Edit your values here
   */
  const params: CreateCollectionParams = {
    name: 'Crystale Season 0 Pass',
    description: 'With a Season 0 pass you get access to the demo of the Crystale video game! Visit https://www.crystale.io for more information',
    contract_address: collectionContractAddress,
    owner_public_key: ownerPublicKey,
    icon_url: 'https://red-improved-cod-476.mypinata.cloud/ipfs/QmQKYyBfjpHgTATvuRGM77vYQU9dUw9LdgsuDDuvPym77Y',
    metadata_api_url: 'https://red-improved-cod-476.mypinata.cloud/ipfs/QmUCdiq324H83w7ZZAYKa5DDowbT1dzgwnW67GiKpJwmH3',
    collection_image_url: 'https://red-improved-cod-476.mypinata.cloud/ipfs/QmP1EwA6kFMDs3CVcaobEQj6g59nv3YLyhpMXwo9ABVNjz',
    project_id: parseInt(projectId, 10),
  };

  // const paramsUpdate: UpdateCollectionParams = {
  //   name: 'Crystale Season 0 Pass',
  //   description: 'With a Season 0 pass you get access to the demo of the Crystale video game! Visit https://www.crystale.io for more information',
  //   icon_url: 'https://red-improved-cod-476.mypinata.cloud/ipfs/QmQKYyBfjpHgTATvuRGM77vYQU9dUw9LdgsuDDuvPym77Y',
  //   metadata_api_url: 'https://gateway.pinata.cloud/ipfs/QmQ1SvmuHrMCJYtdH7vpMKetL5PYXknQZc3VKih6HryK8E',
  //   collection_image_url: 'https://red-improved-cod-476.mypinata.cloud/ipfs/QmUYAX1AYZmGL8guAPRvxdkV7ePwXXxXf5RHcX8uWgbUCz',
  // };

  let collection;
  try {
    collection = await user.createCollection(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  // try {
  //   collection = await user.updateCollection(
  //     collectionContractAddress,
  //     paramsUpdate); 
  // } catch (error) {
  //     throw new Error(JSON.stringify(error, null, 2));
  // }

  log.info(component, 'Created collection');
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});