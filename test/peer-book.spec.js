/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const PeerBook = require('../src')
// const Multiaddr = require('multiaddr')
// const PeerInfo = require('peer-info')

describe('peer-info', function () {
  this.timeout(20000)

  it('create with Id', (done) => {
    const pb = new PeerBook()
    expect(pb).to.exist
    done()
  })
})
