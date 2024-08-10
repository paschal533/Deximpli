"use client";
import { useState, useEffect, useCallback, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Button,
  Divider,
  Grid,
  Typography,
  useTheme,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ethers } from "ethers";
import { StakingPoolABI } from "@/utils/StakingPoolABI";
import { toast } from "react-toastify";
import { getTokenInfo, toString } from "@/utils/Helper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { StakeContext } from "@/context/stake-provider";
import { SwapContext } from "@/context/swap-provider";

const Withdraw = ({ poolAddress }: { poolAddress: any }) => {
  const { address, signer, provider } = useContext(StakeContext);
  const { network } = useContext(SwapContext);
  const [stakingPoolAddress, setStakingPoolAddress] = useState("");
  const [stakedToken, setStakedToken] = useState<any>({});
  const [stakedAmount, setStakedAmount] = useState<any>(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const getStakedToken = useCallback(
    async (poolAddress: any) => {
      if (Object.keys(stakedToken).length > 0) {
        return;
      }
      try {
        const stakingPool = new ethers.Contract(
          poolAddress,
          StakingPoolABI,
          signer,
        );
        const _stakedToken = await getTokenInfo(
          await stakingPool.stakedToken(),
          provider,
        );
        setStakedToken(_stakedToken);
        setStakingPoolAddress(poolAddress);
        setLoadingInfo(false);
      } catch (error) {
        toast.error(
          `Cannot get the information of staked token with staking pool address ${poolAddress}!`,
        );
        console.error(error);
      }
    },
    [signer, stakedToken],
  );

  const getStakedAmount = useCallback(async () => {
    if (stakingPoolAddress === "") return;
    try {
      const stakingPool = new ethers.Contract(
        stakingPoolAddress,
        StakingPoolABI,
        signer,
      );
      const userInfo = await stakingPool.userInfo(address);
      setStakedAmount(
        ethers.utils.formatUnits(userInfo.amount, stakedToken.decimals),
      );
    } catch (error) {
      toast.error("Cannot get staked token amount!");
      console.error(error);
    }
  }, [address, signer, stakedToken, stakingPoolAddress]);

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

  const handleWithdraw = async () => {
    if (stakingPoolAddress === "") {
      toast.error("Staking pool not found!");
      return;
    }
    setLoading(true);
    try {
      const stakingPool = new ethers.Contract(
        stakingPoolAddress,
        StakingPoolABI,
        signer,
      );
      const tx = await stakingPool.withdraw(
        ethers.utils.parseUnits(toString(amount), stakedToken.decimals),
      );
      await tx.wait();
      toast.info(`Withdraw token successfully! Transaction hash: ${tx.hash}`);
      setAmount(0);
      await getStakedAmount();
    } catch (error) {
      toast.error("Cannot withdraw staked token!");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (address && poolAddress) {
      getStakedToken(poolAddress);
      getStakedAmount();
    }
  }, [address, poolAddress, getStakedAmount, getStakedToken]);

  if (!address) {
    return (
      <p className="h-[50px] text-center !font-medium !mt-2 bg-cream px-4 py-2 rounded-xl  w-full">
        Please connect to a wallet to stake
      </p>
    );
  }

  return (
    <div>
      {" "}
      {loadingInfo ? (
        <div className=" p-3 items-center flex justify-center h-[100px] text-center rounded-lg mt-2 font-semibold">
          <CircularProgress />
        </div>
      ) : (
        <Grid container>
          <Grid item>
            <Grid container columnGap={12} className="mb-4">
              <Grid item>
                <Typography sx={{ mt: 1 }}>
                  Withdraw Staked Token ({stakedToken.symbol})
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <div>
              <div className="w-full p-2 mt-2 flex-col items-center">
                <p className="font-semibold text-md">Amount to Withdraw :</p>

                <input
                  type="number"
                  id="reward_per_block"
                  value={amount == 0 ? "" : amount}
                  onChange={handleChange}
                  placeholder={`enter the amount of ${stakedToken.symbol} to withdraw`}
                  className="bg-none w-full mt-2 text-lg font-normal placeholder:text-slate-500 placeholder:font-normal placeholder:text-lg  bg-cream shadow-sm p-2 rounded-lg outline-none border-none"
                />
              </div>
              <div className="w-full flex justify-between pr-2 items-center">
                <p className="p-2 font-semibold">
                  Staked {stakedToken.symbol}:
                </p>
                <div>
                  <span className="font-medium"> {stakedAmount}</span>
                  <div
                    className="text-xs cursor-pointer float-end font-semibold text-[#D7009A]"
                    onClick={() => setAmount(stakedAmount)}
                  >
                    Max
                  </div>
                </div>
              </div>
              <Grid item xs={4}></Grid>
              <div className="w-full space-x-2 p-2">
                <Button
                  className="bg-cream w-1/2 text-[#D7009A] rounded-lg"
                  disabled={amount <= 0 || amount > stakedAmount}
                  fullWidth
                  onClick={() => handleWithdraw()}
                >
                  {loading ? (
                    <CircularProgress sx={{ color: "#D7009A" }} />
                  ) : amount > stakedAmount ? (
                    "Withdraw too much!"
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              </div>
              <Grid item xs={4}></Grid>
            </div>
          </Grid>
        </Grid>
      )}{" "}
    </div>
  );
};

export default Withdraw;
