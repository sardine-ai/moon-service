// import { Operation, TransactionState } from "../../src/types/models";
// import { TestOpenSeaClient } from "../../src/clients/openSea";
// import { buildBuyNftBundleUninjected } from "../../src/commands/buy-nft";

// describe('Testing Build Buy NFT Bundle', () => {
//   const openSea = new TestOpenSeaClient();
//   const buildBuyNftBundle = buildBuyNftBundleUninjected(openSea);

//   test('it builds buy nft bundle', async () => {
//     const bundle = await buildBuyNftBundle({
//       nftId: "1",
//       collectionName: "A fun collection",
//       contractAddress: "0xcontractAddress",
//       chain: "ethereum",
//       recipientAddress: "0xrecipientAddress",
//       platform: "opensea",
//     })
//     bundle.id = "0";
//     bundle.transactions[0].bundleId = "0";
//     expect(bundle).toEqual({
//       id: "0",
//       operation: Operation.BUY_NFT,
//       transactions: [
//         {
//           id: "0",
//           isStarting: true,
//           state: TransactionState.CREATED,
//           to: "0xcontractAddress",
//           value: "1",
//           callData: "0xcallData",
//           chain: "ethereum",
//           assetSymbol: "ethereum",
//           operation: Operation.BUY_NFT,
//           bundleId: "0"
//         }
//       ]
//     });
//   });
// });