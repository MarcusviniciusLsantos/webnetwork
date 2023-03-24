import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import PaymentItem from "components/profile/payment-item";

import { Network } from "interfaces/network";
import { Payment } from "interfaces/payments";

import { useNetwork } from "x-hooks/use-network";

import NetworkColumns from "./network-columns";
import NetworkItem from "./network-item";
import { FlexColumn } from "./wallet-balance";

interface PaymentsListProps {
  payments: Payment[];
  networks: Network[];
  totalConverted: string | number;
  symbol: string;
}

// TODO: Add InfiniteScroll and pagination
export default function PaymentsList({
  payments,
  networks,
  totalConverted,
  symbol
}: PaymentsListProps) {
  const { push } = useRouter();
  const { t } = useTranslation(["common", "profile", "bounty"]);

  const { getURLWithNetwork } = useNetwork();

  function handleItemClick(issueId: string, chainName: string, networkName: string) {
    const [repoId, id] = issueId.split("/");

    push(getURLWithNetwork("/bounty", { id, repoId, chain: chainName, network: networkName}));
  }

  if (!payments || !networks) return null;
  return (
    <>
      <NetworkColumns
        columns={[
          t("custom-network:steps.network-information.fields.name.default"),
          "Total payments",
          "Network link",
        ]}
      />
      {networks &&
        networks?.map((network, key) => (
          <NetworkItem
            key={key}
            type="network"
            networkName={network?.name}
            iconNetwork={network?.logoIcon}
            handleNetworkLink={() => {
              push(getURLWithNetwork("/", { chain: network?.chain?.chainName, network: network?.name }))
            }}
            amount={totalConverted}
            symbol={symbol}
          >
            <FlexColumn className="col-12">
              {payments &&
                payments
                  ?.filter((p) => network?.id === p?.issue?.network?.id)
                  .map((payment: Payment) =>
                    PaymentItem({
                      ...payment,
                      labelToken: t("misc.$token"),
                      labelBounty: t("bounty:label"),
                      handleItemClick,
                    }))}
            </FlexColumn>
          </NetworkItem>
        ))}
    </>
  );
}