import React, { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import InternalLink from "components/internal-link";
import PageHero, { InfosHero } from "components/page-hero";

import { useDAO } from "contexts/dao";

import { handleNetworkAddress } from "helpers/custom-network";

import useApi from "x-hooks/use-api";
import useNetwork from "x-hooks/use-network";

export default function Oracle({ children }) {
  const { asPath } = useRouter();
  const { t } = useTranslation(["oracle", "common"]);

  const { getTotalUsers } = useApi();
  const { service: DAOService } = useDAO();
  const { network: activeNetwork, getURLWithNetwork } = useNetwork();

  const [infos, setInfos] = useState<InfosHero[]>([
    {
      value: 0,
      label: t("common:heroes.in-progress")
    },
    {
      value: 0,
      label: t("common:heroes.bounties-closed")
    },
    {
      value: 0,
      label: t("common:heroes.bounties-in-network"),
      currency: "BEPRO"
    }
  ]);

  useEffect(() => {
    if (!DAOService || !activeNetwork) return;

    Promise.all([
      DAOService.getClosedBounties(handleNetworkAddress(activeNetwork)),
      DAOService.getOpenBounties(handleNetworkAddress(activeNetwork)),
      DAOService.getTotalSettlerLocked(handleNetworkAddress(activeNetwork)),
      getTotalUsers()
    ])
    .then(([closed, inProgress, onNetwork, totalUsers]) => {
      setInfos([
        {
          value: inProgress,
          label: t("common:heroes.in-progress")
        },
        {
          value: closed,
          label: t("common:heroes.bounties-closed")
        },
        {
          value: onNetwork,
          label: t("common:heroes.bounties-in-network"),
          currency: "BEPRO"
        },
        {
          value: totalUsers,
          label: t("common:heroes.protocol-members")
        }
      ]);
    });
  }, [DAOService, activeNetwork]);

  return (
    <div>
      <PageHero
        title={t("oracle:title")}
        subtitle={t("oracle:subtitle")}
        infos={infos}
      />
      <div className="container pt-3">
        <div className="row">
          <div className="d-flex justify-content-center">
            <InternalLink
              href={getURLWithNetwork("/oracle/new-bounties")}
              label={String(t("new-bounties"))}
              className={"mr-3 h3 p-0"}
              active={(asPath.endsWith("/oracle") && true) || undefined}
              nav
              transparent
            />

            <InternalLink
              href={getURLWithNetwork("/oracle/ready-to-merge")}
              label={String(t("ready-to-merge"))}
              className={"h3 p-0"}
              nav
              transparent
            />
          </div>
        </div>
      </div>
      <div className="container p-footer">
        <div className="row justify-content-center">{children}</div>
      </div>
    </div>
  );
}
