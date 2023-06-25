import crypto from 'crypto'
import fs from 'fs'

export const cryptoHelper = {
  async getKeyString (pathToKey: string) {
    return fs.readFileSync(pathToKey, 'utf-8')
  },

  async getKeyObject (keyString: string) {
    return crypto.createPrivateKey({
      key: keyString,
      format: 'pem',
      type: 'pkcs8',
      encoding: 'aes-256-cbc',
      passphrase: process.env.JWT_KEY_PASSPHRASE
    })
  }
}
