const bs58 = require('bs58')

module.exports = PeerBook

function PeerBook () {
  if (!(this instanceof PeerBook)) {
    return new PeerBook()
  }

  const peers = {}

  this.put = (peerInfo) => {
    if (peers[peerInfo.id.toB58String()]) {
      // TODO update the current(merge)
    }
    peers[peerInfo.id.toB58String()] = peerInfo
  }

  this.getAll = () => {
    return peers
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
    this.getByB58String(b58multihash)
  }

  this.removeByB58String = (b58String) => {}
  this.removeByMultihash = (multihash) => {}
}
