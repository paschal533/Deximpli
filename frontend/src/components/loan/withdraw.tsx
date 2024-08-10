import { useState, useEffect, useCallback, useContext } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getTokenInfo, toString } from "@/utils/Helper";
import { ERC20ABI } from "@/utils/ERC20ABI";
import AssetPoolABI from "@/contracts/AssetPool.json";
import { SuppotedAssetPoolContractAddress } from "@/utils/Tokens";
import { LoanContext } from "@/context/loan-provider";

const Withdraw = ({ tokenAddress }: { tokenAddress: any }) => {
  const { address, provider, signer } = useContext(LoanContext);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<any>({});
  const [depositBalance, setDepositBalance] = useState(0);
  const [amount, setAmount] = useState(0);

  const getWithdrawableBalance = useCallback(
    async (tokenObject: any) => {
      try {
        const assetPool = new ethers.Contract(
          SuppotedAssetPoolContractAddress(provider?._network.chainId),
          AssetPoolABI.abi,
          signer,
        );
        let _balance = await assetPool.getUserCompoundedLiquidityBalance(
          address,
          tokenObject.address,
        );
        _balance = Number(
          ethers.utils.formatUnits(_balance, tokenObject.decimals),
        );
        const poolInfo = await assetPool.getPool(tokenObject.address);
        let _available = Number(
          ethers.utils.formatUnits(
            poolInfo.availableLiquidity,
            tokenObject.decimals,
          ),
        );
        setDepositBalance(Math.min(_available, _balance));
      } catch (error) {
        toast.error("Cannot get deposit balance!");
        console.error(error);
      }
    },
    [address, signer, provider],
  );

  const loadWithdrawInfo = useCallback(
    async (tokenAddress: any) => {
      setLoading(true);
      try {
        const tokenObject = await getTokenInfo(tokenAddress, provider);
        setToken(tokenObject);
        await getWithdrawableBalance(tokenObject);
      } catch (error) {
        toast.error("Failed to load information for withdrawal!");
        console.log(error);
      }
      setLoading(false);
    },
    [getWithdrawableBalance, provider],
  );

  const handleChange = (e: any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    if (tmpVal < 0 || isNaN(tmpVal)) {
      return;
    } else if (
      !(
        typeof tmpVal === "string" &&
        (tmpVal.endsWith(".") || tmpVal.startsWith("."))
      )
    ) {
      tmpVal = Number(e.target.value.toString());
    }
    setAmount(tmpVal);
  };

  const getShareBalance = async (assetPool: any, tokenAddress: any) => {
    try {
      const pool = await assetPool.pools(tokenAddress);
      const shareContract = new ethers.Contract(
        pool.shareToken,
        ERC20ABI,
        signer,
      );
      return await shareContract.balanceOf(address);
    } catch (error) {
      toast.error("Cannot get the balance of share tokens");
      console.log(error);
    }
    return 0;
  };

  const handleWithdraw = async () => {
    try {
      const assetPool = new ethers.Contract(
        SuppotedAssetPoolContractAddress(provider?._network.chainId),
        AssetPoolABI.abi,
        signer,
      );
      let tx;
      if (depositBalance <= amount) {
        // Withdraw all shares
        const shareBalance = await getShareBalance(assetPool, token.address);
        tx = await assetPool.withdrawByShare(token.address, shareBalance);
      } else {
        tx = await assetPool.withdrawByAmount(
          token.address,
          ethers.utils.parseUnits(toString(amount), token.decimals),
        );
      }
      await tx.wait();
      toast.info(`Withdraw token successfully! Transaction hash: ${tx.hash}`);
      setAmount(0);
      await getWithdrawableBalance(token);
    } catch (error) {
      toast.error("Failed to withdraw!");
      console.error(error);
    }
  };

  useEffect(() => {
    if (address && tokenAddress) {
      loadWithdrawInfo(tokenAddress);
    }
  }, [address, tokenAddress, loadWithdrawInfo]);

  return (
    <div>
      <Grid item>
        <Grid container columnGap={12}>
          <Grid item>
            <Typography sx={{ mt: 1 }}>Withdraw Asset</Typography>
          </Grid>
        </Grid>
        <Divider />
        <div>
          <div className="w-full p-2 mt-2 flex-col items-center">
            <p className="font-semibold text-md">Amount to withdraw</p>

            <input
              type="number"
              id="reward_per_block"
              value={amount == 0 ? "" : amount}
              onChange={handleChange}
              placeholder={`enter withdraw token (${token.symbol}) amount`}
              className="bg-none w-full mt-2 text-lg font-normal placeholder:text-slate-500 placeholder:font-normal placeholder:text-lg  bg-cream shadow-sm p-2 rounded-lg outline-none border-none"
            />
          </div>
          <div className="w-full flex justify-between pr-2 items-center">
            <p className="p-2 font-semibold">
              Withdrawable balance of {token.symbol}:
            </p>
            <div className="space-x-1 justify-center items-center">
              <span className="font-medium">{depositBalance}</span>
              <div
                className="text-xs cursor-pointer float-end font-semibold text-[#D7009A]"
                onClick={() => setAmount(depositBalance)}
              >
                Max
              </div>
            </div>
          </div>
          <Grid item xs={4}></Grid>
          <div className="w-full flex space-x-2 p-2">
            <Button
              className="!bg-cream w-1/2 text-[#D7009A] font-semibold rounded-lg"
              disabled={amount <= 0 || amount > depositBalance}
              fullWidth
              onClick={handleWithdraw}
            >
              {loading ? (
                <CircularProgress sx={{ color: "#D7009A" }} />
              ) : (
                "Withdraw"
              )}
            </Button>
          </div>
          <Grid item xs={4}></Grid>
        </div>
      </Grid>
    </div>
  );
};

export default Withdraw;
