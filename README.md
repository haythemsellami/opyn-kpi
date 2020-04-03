# Opyn KPI

## How To Run

To install dependencies:
```
$ npm i
```

To get total insurance coverage in dollar:
```
$ node index.js -m insurance-coverage
```

To get total ETH locked in protocol:
```
$ node index.js -m eth-locked
```

To get total token amount locked in protocol:
```
$ node index.js -m token-locked -t tokenName

# tokenName: usdc, dai
```
e.g:
```
$ node index.js -m token-locked -t usdc
```

To get addresses that interacted with a specific oToken (sent or received oToken)
```
$ node index.js -m interacted-addresses -t oTokenName

#oTokenName: old-ocdai, ocdai, ocusdc, oeth-040320, oeth-042420
```
e.g:
```
$ node index.js -m interacted-addresses -t oeth-042420
```

