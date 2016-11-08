/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const Multiaddr = require('multiaddr')
const PeerInfo = require('peer-info')
const async = require('async')

const PeerBook = require('../src')

describe('peer-book', function () {
  this.timeout(50000)
  let pb
  let p1
  let p2
  let p3
  let p4

  before((done) => {
    async.parallel([
      (cb) => PeerInfo.create(cb),
      (cb) => PeerInfo.create(cb),
      (cb) => PeerInfo.create(cb),
      (cb) => PeerInfo.create(cb)
    ], (err, infos) => {
      if (err) {
        return done(err)
      }

      p1 = infos[0]
      p2 = infos[1]
      p3 = infos[2]
      p4 = infos[3]

      done()
    })
  })

  it('create PeerBook', (done) => {
    pb = new PeerBook()
    expect(pb).to.exist
    done()
  })

  it('put peerInfo', (done) => {
    pb.put(p1)
    pb.put(p2)
    pb.put(p3)

    done()
  })

  it('get all peerInfo', (done) => {
    const peers = pb.getAll()
    expect(Object.keys(peers).length).to.equal(3)
    done()
  })

  it('getByB58String', (done) => {
    const p1Id = p1.id.toB58String()
    const peer = pb.getByB58String(p1Id)
    expect(peer).to.deep.equal(p1)
    done()
  })

  it('getByB58String non existent', (done) => {
    try {
      pb.getByB58String(p4.id.toB58String())
    } catch (err) {
      expect(err).to.exist
      done()
    }
  })

  it('getByMultihash', (done) => {
    const p1Id = p1.id.toBytes()
    const peer = pb.getByMultihash(p1Id)
    expect(peer).to.deep.equal(p1)
    done()
  })

  it('getByMultihash non existent', (done) => {
    try {
      pb.getByMultihash(p4.id.toBytes())
    } catch (err) {
      expect(err).to.exist
      done()
    }
  })

  it('removeByB58String', (done) => {
    const p1Id = p1.id.toB58String()
    pb.removeByB58String(p1Id)
    try {
      pb.getByB58String(p1Id)
    } catch (err) {
      expect(err).to.exist
      done()
    }
  })

  it('removeByMultihash', (done) => {
    const p1Id = p1.id.toBytes()
    pb.removeByMultihash(p1Id)
    try {
      pb.getByMultihash(p1Id)
    } catch (err) {
      expect(err).to.exist
      done()
    }
  })

  it('add repeated Id, merge info', (done) => {
    const peerA = new PeerInfo(p3.id)
    peerA.multiaddr.add(new Multiaddr('/ip4/127.0.0.1/tcp/4001'))
    pb.put(peerA)
    const peerB = pb.getByB58String(p3.id.toB58String())
    expect(peerA).to.deep.equal(peerB)
    done()
  })

  it('add repeated Id, replace info', (done) => {
    const peerA = new PeerInfo(p3.id)
    peerA.multiaddr.add(new Multiaddr('/ip4/188.0.0.1/tcp/5001'))
    pb.put(peerA, true)
    const peerB = pb.getByB58String(p3.id.toB58String())
    expect(peerA).to.deep.equal(peerB)
    done()
  })
})
