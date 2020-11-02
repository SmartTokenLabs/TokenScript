
hu-and-hu.service.ts: Activities and Transactions

1. approveForLiquidity(): Transaction created: Approve (USDT or HBTC -> MiningPoolShare)

Before depositing USDT or HBTC, the user needs to approve it first.

ApprovedForLiquidityPool (or Approved for short) is an Activity observable on LiquidityPool token.

Activity Object has the following specific members: (specific means on top of 'inherited' attributes like blockHeight)

ApprovedForLiquidityPool:
- amount
- ownerAddress†

† (the address of the owner of the LiquidityPoolShare being deposited, currently always the current user unless the transaction isn't created on the web interface )

2. approveForMining(): Transaction created: Approve (LiquidityPoolShare -> MiningPoolShare)

Before depositing XToken (LiquidityPoolShare), the user needs to approve it first.

ApprovedForMiningPool (or Approved for short) is an Activity observable on MiningPoolShare token.

Activity Object has the following specific members: (specific means on top of 'inherited' attributes like blockHeight)

ApprovedForMiningPool:
- amount
- ownerAddress†

2. miningPoolDeposit(): Transaction created: Deposit (LiquidityPoolShare -> MiningPoolShare)

ActivityName: Deposited, observable on MiningPoolShare token

Activity Object has the following specific members: (specific means on top of 'inherited' attributes like blockHeight)

DepositedForMiningPool:
- amount
- depositorAddress

3. miningPoolWithdraw(): Transaction created: Withdraw from Mining Pool(MiningPool -> LiquidityPool)

ActivityName: Withdrew, observable on MiningPoolShare token

The Activity Object has the following specific members:
WithdrewFromMiningPool:
- amount
- ownerAddress


4. liquidityPoolWithdraw(): Transaction created: Withdraw from Liquidity Pool(LiquidityPool -> addresses)

ActivityName: Withdrew, observable on LiquidityPool token

This activity happens 2 times in 1 transactions, if the user choose to withdraw both side of the pair

Activity Object has the following specific members:
WithdrewFromLiquidityPool:
- amount
- tokenSymbol
- beneficiaryAddress

So if you do one withdraw of 100ETH and 1 HBTC, then you observe 2 Withdarw Activities:

WithdrewActivity[0]:
{
    'amount': 100,
    'tokenSymbol': 'ETH',
    'beneficiaryAddress': 0x8903048028430;
}

withdrewActivity[1]:
{
    'amount': 1,
    'tokenSymbol': 'HBTC',
    'beneficiaryAddress': 0x8903048028430;
}

## Design question

In case of 4, do we want to abstract that away and get only 1 activity? It won't be easy but if it's worth it:

WithdrewActivity:
{
    'ethAmount': 100,
    'pairAmount': 1,
    'pairSymbol': 'HBTC',
    'ethBeneficiaryAddress': 0x8903048028430,
    'pairBeneficiaryAddress': 0x8903048028430
}

Answer: no. It won't be a problem to push 2 activities at once
