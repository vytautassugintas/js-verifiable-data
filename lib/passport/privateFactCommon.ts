import { ECIES } from '../crypto/ecies/ecies';
import { ec } from 'elliptic';
import keccak256 from 'keccak256';

export const ipfsFileNames = {
  /**
   * Public key in IPFS
   */
  publicKey: 'public_key',

  /**
   * Encrypted message
   */
  encryptedMessage: 'encrypted_message',

  /**
   * Hashed MAC (Message Authentication Code)
   */
  messageHMAC: 'hmac',
};

export const ellipticCurveAlg = 'secp256k1';

export function deriveSecretKeyringMaterial(
  ecies: ECIES,
  publicKey: ec.KeyPair,
  passAddress: string,
  factProviderAddress: string,
  factKey: string,
) {
  const seed = createSKMSeed(passAddress, factProviderAddress, factKey);

  const skm = ecies.deriveSecretKeyringMaterial(publicKey, seed);

  // take only part of MAC otherwise EncryptionKey + MACKey won't fit into 32 bytes array
  skm.macKey = skm.macKey.slice(0, skm.encryptionKey.length);

  const skmBytes = [...skm.encryptionKey, ...skm.macKey];

  const skmHash = Array.from<number>(keccak256(Buffer.from(skmBytes)));

  return {
    skm: skmBytes,
    skmHash,
  };
}

/**
 * Returns seed using [Provider Address + Passport Address + factKey] to derive secret keyring material and HMAC
 */
function createSKMSeed(passportAddress: string, factProviderAddress: string, factKey: string) {
  return Buffer.concat([
    Buffer.from(factProviderAddress, 'hex'),
    Buffer.from(passportAddress, 'hex'),
    Buffer.from(factKey, 'utf8')]);
}
