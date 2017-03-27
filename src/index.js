'use strict'

const bs58 = require('bs58')

module.exports = PeerBook

function PeerBook () {
  if (!(this instanceof PeerBook)) {
    return new PeerBook()
  }

  const peers = {}

  this.put = (peerInfo, replace) => {
    if (peers[peerInfo.id.toB58String()] && !replace) {
      // peerInfo.replace merges by default
      peers[peerInfo.id.toB58String()].multiaddr.replace([], peerInfo.multiaddrs)
    }
    peers[peerInfo.id.toB58String()] = peerInfo
  }

  this.getAll = () => {
    return peers
  }

  /**
   * Get the info to the given PeerId.
   *
   * @param {PeerId} id
   * @returns {PeerInfo}
   */
  this.get = (id) => {
    return this.getByB58String(id.toB58String())
  }

  this.getByB58String = (b58String) => {
    const peerInfo = peers[b58String]
    if (peerInfo) {
      return peerInfo
    }
    throw new Error('PeerInfo not found')
  }

  this.getByMultihash = (multihash) => {
    const b58multihash = bs58.encode(multihash).toString()
    return this.getByB58String(b58multihash)
  }

  this.removeByB58String = (b58String) => {
    if (peers[b58String]) {
      delete peers[b58String]
    }
  }

  this.removeByMultihash = (multihash) => {
    const b58multihash = bs58.encode(multihash).toString()
    this.removeByB58String(b58multihash)
  }

  /**
   * Return all multiaddrs for a given PeerId.
   *
   * @param {PeerId} id
   * @returns {Array<Multiaddr>}
   */
  this.getAddrs = (id) => {
    const info = this.get(id)
    return info.multiaddrs
  }

  // TODO serialize PeerBook into MerkleDAG Objects
}
