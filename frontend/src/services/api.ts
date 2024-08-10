//@ts-nocheck
import cc from "cryptocompare";

export const getExchangeRate = async () => {
  const exchangeRate = await cc.price("ETH", ["USD"]);
  return exchangeRate["USD"];
};
