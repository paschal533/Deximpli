import dotAnimation from "@/constants/dots.json";
import { useQuery } from "@tanstack/react-query";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, Context, useContext } from "react";
import Lottie from "react-lottie";
import { Address } from "viem";
import SendEmailIcon from "../../../public/sendEmailIcon.svg";
import { SwapContext } from "@/context/swap-provider";

const cubeOptions = {
  loop: true,
  autoplay: true,
  animationData: dotAnimation,

  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
interface AccountStatus {
  processing: boolean;
}
const fetchAccountStatus = async (
  hashedEmail: bigint | null
): Promise<AccountStatus> => {
  if (!hashedEmail) {
    throw new Error("No email found");
  }

  const response = await fetch(
    `http://localhost:8080/account?email_hash=${hashedEmail.toString()}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const responseData = await response.json(); // Read response body once
  console.log(responseData);

  return responseData; 
};

function MailtoLink({
  onEmailSent,
  hashedEmail,
}: {
  onEmailSent: () => void;
  hashedEmail: bigint;
}) {
  const [emailRecieved, setEmailRecieved] = useState(false);
  const {address, userEmail, setUserEmail} = useContext(SwapContext)
  //const getHashedEmail = usePersistentStore((state) => state.getHashedEmail);
  //const hashedEmail = getHashedEmail();
  const [polling, setPolling] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Open Mail Client");
  const to = "deximpli@gmail.com";
  const subject = encodeURIComponent(`Change owner to ${address}`);
  const body = encodeURIComponent(
    "Please send this email from the email address you used to generate your wallet. Don't modify the to or subject and we'll take care of the rest!"
  );

  const control = useAnimation()

  const validateEmail = (email : string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isValidEmail = validateEmail(userEmail);

  const {
    data: accountStatus,
    isLoading,
    error,
  } = useQuery<AccountStatus, Error>({
    queryKey: ["accountStatus", hashedEmail?.toString()],
    queryFn: () => fetchAccountStatus(hashedEmail),
    //refetchInterval: (data) => (data?.processing === true ? false : 2000),
    refetchInterval: polling ? 2000 : false,
    enabled: polling,
  });

  useEffect(() => {
    if (accountStatus?.processing == true) {
      onEmailSent();
      setPolling(false);
      setButtonTitle("Email recieved!");
      setEmailRecieved(true);
    }
  }, [accountStatus?.processing]);

  const mailtoHref = `mailto:${to}?subject=${subject}&body=${body}`;

  const handleEmail = () => {
    window.location.href = mailtoHref;

    setPolling(true);
    setButtonTitle("Waiting for email");
    control.start({
      y: -500, // Adjust as needed for sliding distance
      scale: 0,
      opacity: 0,
      transition: { duration: 0.5 }, // Adjust timing as needed
    });
  };

  return (
    <div className="bg-cream p-2 rounded-lg">
      <input
          id="email"
          type="email"
          placeholder="Enter a your Gmail address"
          onChange={(e: any) => setUserEmail(e.target.value)}
          value={userEmail}
           
          className="rounded-lg text-xl bg-cream p-2 font-bold outline-none placeholder-black placeholder:font-normal placeholder:font-mono placeholder:text-lg"
        />
    <motion.button
      initial={{ scale: 1, opacity: 1 }}
      animate={control}
      onClick={() => handleEmail()}
      disabled={isValidEmail == null || userEmail.length == 0}
      whileHover={{ backgroundColor: "#ff73d7" }}
      whileTap={{ scale: 0.98 }}
      className="px-4 py-2 cursor-pointer font-bold bg-[#D7009A] rounded-lg"
      style={{
        border: "none",
        right: 12,
        top: 10,
        height: "36px",
        color: "white",
        backgroundColor: "#D7009A",
      }}
      type="button"
    >
      <div
        className="flex justify-center items-center"
        style={{ height: "100%" }}
      >
        <span>{buttonTitle}</span>
        <div style={{ width: "28px" }}>
          {isLoading ? (
            <Lottie options={cubeOptions} height={40} width={40} />
          ) : (
            <motion.div>
              <Image
                style={{ marginLeft: "10px" }}
                src={SendEmailIcon}
                alt="send email button"
                width={18}
                height={18}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.button>
    </div>
  );
}

export default MailtoLink;
