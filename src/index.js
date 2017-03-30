'use strict'

const bs58 = require('bs58')

class PeerBook {
  constructor () {
    this._peers = {}
  }

  /**
   * Stores a peerInfo, if already exist, only adds the multiaddrs
   *
   * @param {PeerInfo} peerInfo
   * @param {replace} boolean
   * @returns {null}
   */
  put (peerInfo, replace) {
    if (this._peers[peerInfo.id.toB58String()] && !replace) {
      // peerInfo.replace merges by default if none to replace are passed
      this._peers[peerInfo.id.toB58String()]
        .multiaddrs.replace([], peerInfo.multiaddrs.toArray())
    }

    this._peers[peerInfo.id.toB58String()] = peerInfo
  }

  getAll () {
    return this._peers
  }

  /**
   * Get the info to the given PeerId.
   *
   * @param {PeerId} id
   * @returns {PeerInfo}
   */
  get (id) {
    return this.getByB58String(id.toB58String())
  }

  getByB58String (b58String) {
    const peerInfo = this._peers[b58String]

    if (peerInfo) {
      return peerInfo
    }
    throw new Error('PeerInfo not found')
  }

  getByMultihash (multihash) {
    const b58multihash = bs58.encode(multihash).toString()
    return this.getByB58String(b58multihash)
  }

  removeByB58String (b58String) {
    if (this._peers[b58String]) {
      delete this._peers[b58String]
    }
  }

  removeByMultihash (multihash) {
    const b58multihash = bs58.encode(multihash).toString()
    this.removeByB58String(b58multihash)
  }

  /**
   * Return all multiaddrs for a given PeerId.
   *
   * @param {PeerId} id
   * @returns {Array<Multiaddr>}
   */
  getAddrs (id) {
    const info = this.get(id)
    return info.multiaddrs
  }
}

module.exports = PeerBook
