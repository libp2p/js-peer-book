/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const waterfall = require('async/waterfall')

function createPeerInfo (multiaddrs, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  if (!Array.isArray(multiaddrs)) {
    multiaddrs = [multiaddrs]
  }

  waterfall([
    (cb) => PeerId.create({ bits: 1024 }, cb),
    (peerId, cb) => PeerInfo.create(peerId, cb),
    (peerInfo, cb) => {
      multiaddrs.map((ma) => peerInfo.multiaddrs.add(ma))
      cb(null, peerInfo)
    }
  ], callback)
}

module.exports = {
  createPeerInfo: createPeerInfo
}
