'use strict'

const bs58 = require('bs58')

module.exports = PeerBook

/**
 * Peer storage for libp2p and IPFS.
 *
 * @class PeerBook
 */
function PeerBook () {
  if (!(this instanceof PeerBook)) {
    return new PeerBook()
  }

  const peers = {}

  /**
   * Add a new peer.
   *
   * @param {PeerInfo} peerInfo
   * @param {boolean} [replace=false] - Should this replace an existing entry.
   * @returns {undefined}
   */
  this.put = (peerInfo, replace) => {
    if (peers[peerInfo.id.toB58String()] && !replace) {
      // peerInfo.replace merges by default
      peers[peerInfo.id.toB58String()].multiaddr.replace([], peerInfo.multiaddrs)
    }
    peers[peerInfo.id.toB58String()] = peerInfo
  }

  /**
   * List all currently available peers.
   *
   * @returns {Object} A map of `base58` encoded peer ids to the full `PeerInfo`.
   */
  this.getAll = () => {
    return peers
  }

  /**
   * Get a peer by `base58` encoded id.
   *
   * @param {string} b58String - A `base58` encoded peer id.
   * @returns {PeerInfo}
   */
  this.getByB58String = (b58String) => {
    const peerInfo = peers[b58String]
    if (peerInfo) {
      return peerInfo
    }
    throw new Error('PeerInfo not found')
  }

  /**
   * Get a peer by multihash.
   *
   * @param {Buffer} multihash - A peer id as multihash.
   * @returns {PeerInfo}
   */
  this.getByMultihash = (multihash) => {
    const b58multihash = bs58.encode(multihash).toString()
    return this.getByB58String(b58multihash)
  }

  /**
   * Remove a peer by `base58` encoded id.
   *
   * @param {string} b58String - A `base58` encoded peer id.
   * @returns {undefined}
   */
  this.removeByB58String = (b58String) => {
    if (peers[b58String]) {
      delete peers[b58String]
    }
  }

  /**
   * Remove a peer by multihash.
   *
   * @param {Buffer} multihash - A peer id as multihash.
   * @returns {undefined}
   */
  this.removeByMultihash = (multihash) => {
    const b58multihash = bs58.encode(multihash).toString()
    this.removeByB58String(b58multihash)
  }

  // TODO serialize PeerBook into MerkleDAG Objects
}
