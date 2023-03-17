import { useEffect, useState } from "react";
import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import getConfig from "next/config";

import DoubleArrowRight from "assets/icons/double-arrow-right";

import { useAppState } from "../contexts/app-state";
import { getCoinPrice } from "../services/coingecko";
import Button from "./button";
import InputNumber from "./input-number";
import TokensDropdown from "./tokens-dropdown";

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
  review = false,
  needValueValidation,
  decimals = 18,
  isFunding = false,
}) {
  const { t } = useTranslation("bounty");
  const { state } = useAppState();
  const { publicRuntimeConfig } = getConfig();
  const [inputError, setInputError] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);

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
      BigNumber(values.floatValue).isLessThan(BigNumber(state.Settings?.minBountyValue))
    ) {
      setInputError(t("bounty:errors.exceeds-minimum-amount", {
          amount: state.Settings?.minBountyValue,
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
                   setConvertedAmount(issueAmount.value * price);
                 });
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
        disabled={review}
        defaultToken={defaultToken}
        showCurrencyValue={needValueValidation}
        needsBalance
        noLabel
      />
    );
  }

  useEffect(updateConversion, [issueAmount.value]);

  return (
    <div className="mt-4">
      <label className="mb-1 text-gray">
        {isFunding ? "Set Funded Reward" : "Set Reward"}
      </label>
      {isFunding ? (
        <div className="d-flex justify-content-between col-md-6 p-2 border-radius-8 border border-gray-700">
          <div className="d-flex flex-column col-7">
            <InputNumber 
              className="input-funded" 
              thousandSeparator
            />
            <div className="text-white-30 ms-2 mt-1">
              {convertedAmount} {state.Settings?.currency.defaultFiat}
            </div>
          </div>
          <div className="col-4 me-2 mt-3">
          {selectTokens()}
          </div>

        </div>
      ) : (
        <div className="p-2 border-radius-8 border border-gray-700">
          <div className="row d-flex justify-content-between">
            <div className="d-flex col-8">
              <div className="col-md-6">{selectTokens()}</div>
              <div className="col-md-4 ms-2">
                <Button
                  className="bounty-outline-button"
                  onClick={() => {
                    setIssueAmount({
                      formattedValue: tokenBalance.toFixed(),
                      floatValue: tokenBalance.toNumber(),
                      value: tokenBalance.toFixed(),
                    });
                  }}
                >
                  Use Max
                </Button>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="p-1 ps-3 border-radius-4 border border-gray-700 text-gray">
                Balance: {tokenBalance.toFixed()}{" "}
                {currentToken?.symbol || t("common:misc.token")}
              </div>
            </div>
          </div>

          <div className="col-md-12 bg-gray-850 border border-radius-4 border-gray-700">
            <div className="d-flex mt-4 ms-3">
              <div className="col-5">
              <InputNumber
                className="input-fund"
                classSymbol="symbol-fund"
                fullWidth={!publicRuntimeConfig?.enableCoinGecko}
                thousandSeparator
                disabled={review || !currentToken?.currentValue}
                max={tokenBalance.toFixed()}
                symbol={currentToken?.symbol || t("common:misc.token")}
                value={issueAmount.value}
                placeholder="0"
                allowNegative={false}
                decimalScale={decimals}
                onValueChange={handleIssueAmountOnValueChange}
                onBlur={handleIssueAmountBlurChange}
                error={!!inputError}
                helperText={
                  <>
                    {inputError && <p className="p-small my-2">{inputError}</p>}
                  </>
                }
              />
              </div>
              {publicRuntimeConfig?.enableCoinGecko && (
                <div className="d-flex mt-0">
                  <div className="pt-2 mx-4">
                    <DoubleArrowRight className="text-gray" />
                  </div>
                  <div className="mt-2 ms-2 convert-value">
                    {convertedAmount} {state.Settings?.currency.defaultFiat}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
