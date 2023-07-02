import crypto from 'crypto'
import fg from 'fast-glob'
import fs from 'fs'

export const cryptoHelper = {
  getKeyString (pathToKey: string) {
    const paths = fg.sync(pathToKey)
    return fs.readFileSync(paths[0], 'utf-8')
  },

  getPrivateKeyObject (keyString: string) {
    return crypto.createPrivateKey({
      key: keyString,
      format: 'pem',
      type: 'pkcs8',
      passphrase: process.env.JWT_KEY_PASSPHRASE
    })
  },

  getPublicKeyObject (keyString: string) {
    return crypto.createPublicKey({
      key: keyString,
      format: 'pem',
      type: 'pkcs1'
    })
  }
}
