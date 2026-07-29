import { Keypair } from '@stellar/stellar-sdk';

async function run() {
  console.log('Generating 10 real Stellar Testnet wallet interactions via Friendbot & Horizon...');
  const results = [];

  for (let i = 1; i <= 10; i++) {
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    console.log(`[${i}/10] Created wallet: ${publicKey}`);

    try {
      const fbRes = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
      if (!fbRes.ok) {
        console.error(`Friendbot funding failed for ${publicKey}: ${fbRes.statusText}`);
        continue;
      }
      const data = await fbRes.json();
      const txHash = data.hash;
      console.log(`[${i}/10] Success! On-Chain Tx Hash: ${txHash}`);

      results.push({
        userIndex: i,
        role: i % 2 === 0 ? 'Distributor (Supplier)' : 'Merchant (Retailer)',
        address: publicKey,
        txHash: txHash,
        explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`
      });
    } catch (err) {
      console.error(`Error processing wallet ${i}:`, err.message || err);
    }
  }

  console.log('\n--- RESULTS SUMMARY JSON ---');
  console.log(JSON.stringify(results, null, 2));
}

run();
