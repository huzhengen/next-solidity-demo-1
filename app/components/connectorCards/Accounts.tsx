import type { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';
import type { Web3ReactHooks } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { Address } from '@ant-design/web3';

function useBalances(
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  accounts?: string[],
): BigNumber[] | undefined {
  const [balances, setBalances] = useState<BigNumber[] | undefined>();

  useEffect(() => {
    if (provider && accounts?.length) {
      let stale = false;

      void Promise.all(accounts.map(account => provider.getBalance(account))).then(
        iner_balances => {
          if (stale) return;
          setBalances(iner_balances);
        },
      );

      return () => {
        stale = true;
        setBalances(undefined);
      };
    }
  }, [provider, accounts]);

  return balances;
}

export function Accounts({
  accounts,
  provider,
  ENSNames,
}: {
  accounts: ReturnType<Web3ReactHooks['useAccounts']>;
  provider: ReturnType<Web3ReactHooks['useProvider']>;
  ENSNames: ReturnType<Web3ReactHooks['useENSNames']>;
}) {
  const balances = useBalances(provider, accounts);

  if (accounts === undefined) return null;

  return (
    <div>
      <b>
        {accounts.length === 0
          ? 'None'
          : accounts?.map((account, i) => (
            <ul key={account} style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {/* {ENSNames?.[i] ?? account.substring(0, 6)} */}
              {ENSNames?.[i] ?? <Address
                ellipsis={{
                  headClip: 8,
                  tailClip: 6,
                }}
                copyable
                address={account}
              />}
              {balances?.[i] ? ` (${formatEther(balances[i]).substring(0, 6)})` : null}
            </ul>
          ))}
      </b>
    </div>
  );
}
