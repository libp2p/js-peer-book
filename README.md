Peer Book JavaScript Implementation
===================================

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://protocol.ai)
[![](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![](https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)
[![Discourse posts](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg)](https://discuss.libp2p.io)
[![](https://img.shields.io/codecov/c/github/libp2p/js-peer-book.svg?style=flat-square)](https://codecov.io/gh/libp2p/js-peer-book)
[![](https://img.shields.io/travis/libp2p/js-peer-book.svg?style=flat-square)](https://travis-ci.com/libp2p/js-peer-book)
[![Dependency Status](https://david-dm.org/libp2p/js-peer-book.svg?style=flat-square)](https://david-dm.org/libp2p/js-peer-book)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> Peer Store for libp2p and IPFS

## Lead Maintainer

[Vasco Santos](https://github.com/vasco-santos)

## Table of Contents

soon™

## Installation

### npm

```sh
> npm i peer-book
```

### Node.JS, Browserify, Webpack

```JavaScript
const PeerBook = require('peer-book')
```

### Browser: `<script>` Tag

Loading this module through a script tag will make the `PeerBook` obj available in the global namespace.

```html
<script src="https://unpkg.com/peer-book/dist/index.min.js"></script>
<!-- OR -->
<script src="https://unpkg.com/peer-book/dist/index.js"></script>
```

# Usage

### `put(peerInfo, replace)`

Adds the peerInfo using it's peerId to the peerBook

If the peerInfo for that id was already added, the addresses are going to be merged

If `replace` is set to true, then the peerInfo will be completly overwritten by the new one, without keeping the previous addresses.

### `get(peerIdLike)`

Gets the peerInfo using it's peerId

`peerIdLike` can be:
  - A base58 peerId string
    - Example: `QmfHZLGRxYoF87esc98DetgKwzMhE4gumCC9kq39EBrueM`
  - A [Multiaddr](https://www.npmjs.com/package/multiaddr#api) string _with a peer-id_
    - Example: `/ip4/127.0.0.1/tcp/1/ipfs/QmfHZLGRxYoF87esc98DetgKwzMhE4gumCC9kq39EBrueM`
  - A peerId buffer
    - Example: `<Buffer 12 20 fb cb db 25 57 c9 4c 7d 73 c6 d9 bb 83 cc e6 4d 7a de 66 59 12 94 bc 8d f3 95 5d 10 e6 ee ce 2e>`
  - A [PeerId](https://www.npmjs.com/package/peer-id#api) object
  - A [Multiaddr](https://www.npmjs.com/package/multiaddr#api) object _with a peer-id_
  - A [PeerInfo](https://www.npmjs.com/package/peer-info#api) object

# License

MIT
