/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const Multiaddr = require('multiaddr')
const PeerInfo = require('peer-info')
const async = require('async')
const utils = require('./utils')
const createPeerInfo = utils.createPeerInfo

const PeerBook = require('../src')

describe('peer-book', () => {
  let pb
  let p1
  let p2
  let p3
  let p4

  let p1fullAddr

  before((done) => {
    async.parallel([
      (cb) => createPeerInfo([
        '/tcp/1000',
        '/tcp/1001'
      ], cb),
      (cb) => createPeerInfo([
        '/tcp/2000',
        '/tcp/2001'
      ], cb),
      (cb) => createPeerInfo([
        '/tcp/3000',
        '/tcp/3001'
      ], cb),
      (cb) => createPeerInfo([
        '/tcp/4000',
        '/tcp/4001'
      ], cb)
    ], (err, infos) => {
      if (err) {
        return done(err)
      }

      p1 = infos[0]
      p2 = infos[1]
      p3 = infos[2]
      p4 = infos[3]

      p1fullAddr = p1.multiaddrs.toArray()[0].encapsulate('/ipfs/' + p1.id.toB58String())

      done()
    })
  })

  it('create PeerBook', () => {
    pb = new PeerBook()
    expect(pb).to.exist()
  })

  it('.put', () => {
    expect(pb.put(p1)).to.eql(p1)
    expect(pb.put(p2)).to.eql(p2)
    expect(pb.put(p3)).to.eql(p3)
  })

  it('.getAll', () => {
    const peers = pb.getAll()
    expect(Object.keys(peers).length).to.equal(3)
  })

  it('.getAllArray', () => {
    expect(pb.getAllArray()).to.have.length(3)
  })

  it('.get by PeerId', () => {
    const peer = pb.get(p1.id)
    expect(peer).to.eql(p1)
  })

  it('.get by multiaddr string', () => {
    const peer = pb.get(String(p1fullAddr))
    expect(peer).to.eql(p1)
  })

  it('.get by multiaddr', () => {
    const peer = pb.get(p1fullAddr)
    expect(peer).to.eql(p1)
  })

  it('.get by B58String ', () => {
    const b58Str = p1.id.toB58String()
    const peer = pb.get(b58Str)
    expect(peer).to.eql(p1)
  })

  it('.get by B58String non existent', (done) => {
    try {
      pb.get(p4.id.toB58String())
    } catch (err) {
      expect(err).to.exist()
      done()
    }
  })

  it('.get by Multihash', () => {
    const mh = p1.id.toBytes()
    const peer = pb.get(mh)
    expect(peer).to.eql(p1)
  })

  it('.get by Multihash non existent', (done) => {
    try {
      pb.getByMultihash(p4.id.toBytes())
    } catch (err) {
      expect(err).to.exist()
      done()
    }
  })

  it('.remove by B58String', () => {
    const b58Str = p1.id.toB58String()

    pb.remove(b58Str)
    expect(pb.has(b58Str)).to.equal(false)
  })

  it('.remove by Multihash', () => {
    const mh = p1.id.toBytes()

    pb.remove(mh)
    expect(pb.has(mh)).to.equal(false)
  })

  it('.put repeated Id, merge info', () => {
    const peer3A = new PeerInfo(p3.id)
    peer3A.multiaddrs.add(new Multiaddr('/ip4/127.0.0.1/tcp/4001'))

    pb.put(peer3A)
    const peer3B = pb.get(p3.id.toBytes())

    expect(peer3B.multiaddrs.toArray()).to.have.length(3)
  })

  it('.put repeated Id, replace info', () => {
    const peer3A = new PeerInfo(p3.id)
    peer3A.multiaddrs.add(new Multiaddr('/ip4/188.0.0.1/tcp/5001'))

    pb.put(peer3A, true)
    const peer3B = pb.get(p3.id.toB58String())
    expect(peer3A.multiaddrs.toArray()).to.eql(peer3B.multiaddrs.toArray())
  })

  it('.getMultiaddrs', () => {
    const pb = new PeerBook()
    const peer = new PeerInfo(p3.id)
    peer.multiaddrs.add(new Multiaddr('/ip4/127.0.0.1/tcp/1234'))

    pb.put(peer)
    expect(pb.getMultiaddrs(p3.id)).to.be.eql(peer.multiaddrs.toArray())
  })
})
