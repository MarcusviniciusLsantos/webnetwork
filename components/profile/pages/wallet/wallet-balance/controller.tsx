import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { TokenBalanceType } from "components/profile/token-balance";
import TokenIcon from "components/token-icon";

import { useAppState } from "contexts/app-state";

import { TokensOracles } from "interfaces/oracles-state";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";

import { getCoinInfoByContract, getCoinPrice } from "services/coingecko";

import useApi from "x-hooks/use-api";
import { useNetwork } from "x-hooks/use-network";
import useNetworkChange from "x-hooks/use-network-change";

import WalletBalanceView from "./view";

export default function WalletBalance() {
  const { t } = useTranslation(["common", "profile"]);

  const [totalAmount, setTotalAmount] = useState("0");
  const [tokensOracles, setTokensOracles] = useState<TokensOracles[]>([]);
  const [tokens, setTokens] = useState<TokenBalanceType[]>([]);
  const [hasNoConvertedToken, setHasNoConvertedToken] = useState(false);

  const { state } = useAppState();

  const { searchCurators, getTokens } = useApi();
  const { getURLWithNetwork } = useNetwork();
  const { handleAddNetwork } = useNetworkChange();
  const { query, push } = useRouter();

  const getAddress = (token: string | Token) =>
    typeof token === "string" ? token : token?.address;

  async function processToken(token: string | Token) {
    const [tokenData, balance] = await Promise.all([
      typeof token === "string"
        ? state.Service?.active?.getERC20TokenData(token)
        : token,
      state.Service?.active?.getTokenBalance(getAddress(token),
                                             state.currentUser.walletAddress),
    ]);

    const tokenInformation = await getCoinInfoByContract(tokenData.symbol);

    return {
      balance,
      ...tokenData,
      icon: <TokenIcon src={tokenInformation?.icon as string} />,
    };
  }

  async function handleNetworkSelected(chain: SupportedChainData) {
    handleAddNetwork(chain).catch((e) =>
      console.log("Handle Add Network Error", e));
  }

  function loadBalances() {
    if (!state.currentUser?.walletAddress) return;

    searchCurators({
      address: state.currentUser?.walletAddress,
      networkName: query?.network?.toString() || "",
      chainShortName:
        query?.chain?.toString() || state?.connectedChain?.shortName,
    }).then(({ rows }) => {
      Promise.all(rows?.map(async (curator) => {
        const tokenInformation = await getCoinInfoByContract(curator?.network?.networkToken?.symbol);

        return {
            symbol: t("$oracles", {
              token: curator?.network?.networkToken?.symbol,
            }),
            name: `${t("misc.locked")} ${curator?.network?.networkToken?.name}`,
            address: curator?.network?.networkToken?.address,
            icon: <TokenIcon src={tokenInformation?.icon as string} />,
            oraclesLocked: BigNumber(curator.tokensLocked),
            networkName: curator?.network?.name,
        };
      })).then(setTokensOracles);
    });

    if (state.Service?.starting) return;

    getTokens(state?.connectedChain?.id, query?.network?.toString() || "").then((tokens) => {
      Promise.all(tokens?.map(async (token) => {
        const tokenData = await processToken(token?.address);
        return { networks: token?.networks, ...tokenData };
      })).then(setTokens);
    });
  }

  useEffect(loadBalances, [
    state.currentUser?.walletAddress,
    state.connectedChain,
    state.Service?.starting,
  ]);

  useEffect(() => {
    if (!tokens.length) return;

    Promise.all(tokens.map(async (token) => ({
        tokenAddress: token.address,
        value:
          typeof token.balance === "string"
            ? BigNumber(token.balance)
            : token.balance,
        price: await getCoinPrice(token?.symbol,
                                  state?.Settings.currency.defaultFiat),
    }))).then((tokens) => {
      const totalConverted = tokens.reduce((acc, token) =>
          BigNumber(token.value)
            .multipliedBy(token.price || 0)
            .plus(acc),
                                           BigNumber(0));
      const noConverted = !!tokens.find((token) => token.price === undefined);
      const totalTokens = tokens.reduce((acc, token) => BigNumber(token.value).plus(acc),
                                        BigNumber(0));

      setTotalAmount(noConverted ? totalTokens.toFixed() : totalConverted.toFixed());
      setHasNoConvertedToken(noConverted);
    });
  }, [tokens]);

  return (
    <WalletBalanceView
      totalAmount={totalAmount}
      isOnNetwork={!!query?.network}
      hasNoConvertedToken={hasNoConvertedToken}
      defaultFiat={state?.Settings?.currency?.defaultFiat}
      tokens={tokens}
      tokensOracles={tokensOracles}
      handleNetworkSelected={handleNetworkSelected}
      handleNetworkLink={(token: TokensOracles) => {
        push(getURLWithNetwork("/", {
            chain: state?.connectedChain?.shortName,
            network: token?.networkName,
        }));
      }}
    />
  );
}
