import { useEffect, useState } from "react";
import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import getConfig from "next/config";

import ResponsiveWrapper from "components/responsive-wrapper";

import { useAppState } from "../../contexts/app-state";
import { getCoinPrice } from "../../services/coingecko";
import InputNumber from "../input-number";
import TokensDropdown from "../tokens-dropdown";

export default function CreateBountyTokenAmount({
  currentToken,
  setCurrentToken,
  addToken,
  canAddCustomToken,
  defaultToken = null,
  userAddress,
  customTokens,
  labelSelect,
  tokenBalance,
  issueAmount,
  setIssueAmount,
  isFunders = false,
  needValueValidation,
  decimals = 18,
  isFunding = false,
}) {
  const { t } = useTranslation("bounty");
  const { state } = useAppState();
  const { publicRuntimeConfig } = getConfig();
  const [inputError, setInputError] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isErrorConverted, setIsErrorConverted] = useState(false);

  function handleIssueAmountOnValueChange(values: NumberFormatValues) {
    if (
      needValueValidation &&
      +values.floatValue > +currentToken?.currentValue
    ) {
      setIssueAmount({ formattedValue: "" });
      setInputError(t("bounty:errors.exceeds-allowance"));
    } else if (values.floatValue < 0) {
      setIssueAmount({ formattedValue: "" });
    } else if (
      values.floatValue !== 0 &&
      BigNumber(values.floatValue).isLessThan(BigNumber(currentToken?.minimum))
    ) {
      setIssueAmount(values);
      setInputError(t("bounty:errors.exceeds-minimum-amount", {
          amount: currentToken?.minimum,
      }));
    } else {
      setIssueAmount(values);
      if (inputError) setInputError("");
    }
  }

  function handleIssueAmountBlurChange() {
    if (needValueValidation && tokenBalance?.lt(issueAmount.floatValue)) {
      setIssueAmount({ formattedValue: tokenBalance.toFixed() });
    }
  }

  function updateConversion() {
    if (!currentToken?.symbol || !publicRuntimeConfig?.enableCoinGecko) return;

    getCoinPrice(currentToken?.symbol,
                 state?.Settings?.currency?.defaultFiat).then((price) => {
                   if (isNaN(price) || price === 0) setIsErrorConverted(true);
                   if (!isNaN(price)) setConvertedAmount((issueAmount.value || 0) * price);
                 });
  }

  function renderConvertedAmount() {
    return isErrorConverted
      ? t("fields.conversion-token.invalid")
      : `${convertedAmount} ${state.Settings?.currency.defaultFiat}`;
  }

  function selectTokens() {
    return (
      <TokensDropdown
        token={currentToken}
        label={labelSelect}
        tokens={customTokens}
        userAddress={userAddress}
        canAddToken={canAddCustomToken}
        addToken={addToken}
        setToken={setCurrentToken}
        disabled={false}
        defaultToken={defaultToken}
        showCurrencyValue={false}
        needsBalance={isFunding}
        noLabel
      />
    );
  }

  function inputNumber() {
    return (
      <InputNumber
        groupClassName={isFunding ? `input-funded` : ""}
        className={isFunding ? `input-funded` : ""}
        classSymbol={isFunding ? "" : " text-primary"}
        symbol={!isFunding && currentToken?.symbol}
        thousandSeparator
        fullWidth={!publicRuntimeConfig?.enableCoinGecko}
        max={tokenBalance.toFixed()}
        value={issueAmount.value}
        placeholder="0"
        allowNegative={false}
        decimalScale={decimals}
        onValueChange={handleIssueAmountOnValueChange}
        onBlur={handleIssueAmountBlurChange}
        error={!!inputError}
        helperText={
          <>{inputError && <p className="p-small my-2">{inputError}</p>}</>
        }
      />
    );
  }

  function renderBalance() {
    return (
      <div className="text-truncate">
        <span className="text-gray">{t("bounty:balance")}</span>{" "}
        {tokenBalance.toFixed()}{" "}
        {currentToken?.symbol || t("common:misc.token")}
      </div>
    );
  }

  function RenderItemRow({ children, label = "", description = "", borderBottom = true }) {
    return (
      <div className={`mt-4 pb-4 ${borderBottom ? 'border-bottom border-gray-700' : ''}`}>
        <label className="text-white">{label}</label>
        <div className="row justify-content-between">
          <div className="col-md-6 col-12 text-gray mt-1">{description}</div>
          <div className="col-md-4 col-12 mt-1">{children}</div>
        </div>
      </div>
    );
  }

  function handleUpdateToken() {
    if (issueAmount?.floatValue === 0) return;

    if (
      BigNumber(issueAmount?.floatValue).isLessThan(BigNumber(currentToken?.minimum))
    ) {
      setInputError(t("bounty:errors.exceeds-minimum-amount", {
          amount: currentToken?.minimum,
      }));
    } else setInputError("");
  }

  //useEffect(updateConversion, [issueAmount.value]);
  useEffect(handleUpdateToken, [currentToken?.minimum]);

  return (
    <div className="mt-4">
      <label className="mb-1 text-gray">
        {isFunding
          ? isFunders
            ? t("fields.select-token.funding")
            : t("fields.select-token.reward")
          : t("fields.select-token.label")}
      </label>
      {isFunding ? (
        <div className="d-flex justify-content-between col-md-6 p-2 border-radius-8 border border-gray-700">
          <div className="d-flex flex-column col-7">
            {inputNumber()}
            <div className="text-white-30 ms-2">{renderConvertedAmount()}</div>
          </div>
          <div className="col-4 me-2 mt-3 pt-1">{selectTokens()}</div>
        </div>
      ) : (
        <div>
          <div className="d-flex flex-wrap justify-content-between">
            <div className="col col-md-4  mb-0 pb-0">
              {selectTokens()}
              <ResponsiveWrapper className="mt-1" xs={true} md={false}>
                {renderBalance()}
              </ResponsiveWrapper>
            </div>

            <ResponsiveWrapper
              className="d-flex justify-content-end mt-3"
              xs={false}
              md={true}
            >
              {renderBalance()}
            </ResponsiveWrapper>
          </div>

          <RenderItemRow
            label="Set Reward"
            description="Est quis sit irure exercitation id consequat cupidatat elit nulla velit amet ex."
          >
            {inputNumber()}
          </RenderItemRow>
          <RenderItemRow
            label="Service fees"
            description="Est quis sit irure exercitation id consequat cupidatat elit nulla velit amet ex."
          >
            {inputNumber()}
          </RenderItemRow>
          <RenderItemRow
            label="Total amount"
            description="Est quis sit irure exercitation id consequat cupidatat elit nulla velit amet ex."
            borderBottom={false}
          >
            {inputNumber()}
          </RenderItemRow>
        </div>
      )}
    </div>
  );
}
