# Opyn KPI

## How To Run

Install dependencies:
```
$ npm i
```

To get total insurance coverage in dollar:
```
$ node index.js -m insurance-coverage
```

To get total USD locked in protocol:
```
$ node index.js -m usd-locked
```

To get total ETH locked in protocol:
```
$ node index.js -m eth-locked
```

To get total token amount locked in protocol:
```bash
$ node index.js -m token-locked -t tokenName

# tokenName: usdc, dai
```
e.g:
```
$ node index.js -m token-locked -t usdc
```
To get unique addresses that interacted with all oTokens (sent or received any oToken)
```bash
$ node index.js -m interacted-addresses
```

To get unique addresses that interacted with a specific oToken (sent or received oToken)
```bash
$ node index.js -m interacted-addresses -t oTokenName

# oTokenName: ocrv, old-ocdai, ocdai, ocusdc, oeth-040320-100, oeth-042420-100, oeth-042420-150
```
e.g:
```
$ node index.js -m interacted-addresses -t oeth-042420-100
```

