# Opyn KPI

## oTokens

- old-ocdai
- ocdai
- ocusdc
- ocrv
- oeth-040320-100
- oeth-042420-100
- oeth-042420-150
- oeth-050120-160
- oeth-050820-160
- oeth-052920-150
- call-oeth-052920-250

## How To Run

Install dependencies:
```
$ npm i
```

### To get total insurance coverage in dollar

```
$ node index.js -m insurance-coverage
```

### To get total USD locked in protocol

```
$ node index.js -m usd-locked
```

### To get total ETH locked in protocol

```
$ node index.js -m eth-locked
```

### To get total token amount locked in protocol

```bash
$ node index.js -m token-locked -t tokenName

# tokenName: usdc, dai
```
e.g:
```
$ node index.js -m token-locked -t usdc
```

### To get unique addresses that interacted with all oTokens (sent or received any oToken)

```bash
$ node index.js -m interacted-addresses
```

### To get unique addresses that interacted with a specific oToken (sent or received oToken)

```bash
$ node index.js -m interacted-addresses -t oTokenName

# oTokenName: ocrv, old-ocdai, ocdai, ocusdc, oeth-040320-100, oeth-042420-100, oeth-042420-150, oeth-050120-160, oeth-052920-150, call-oeth-052920-250 or oeth for all oETH token.
```
e.g:
```
$ node index.js -m interacted-addresses -t oeth-042420-100
```

### To get TVL for a specifc date

**Make sure to add [DeFi Pulse API Key](https://data.defipulse.com/) in `.env` file as the below format** (The api-key parameter is not strictly required, but calling the API without it will get you rate limited.)

```
API_KEY = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx       
```

```bash
$ node index.js -m history -d date
```

the `date` should be in the following format: YYYY-MM-DD

e.g:
```
$ node index.js -m history -d 2020-02-13
```