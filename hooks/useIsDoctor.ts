import { useReadContract } from "wagmi";
import { CONTRACT_ABI2, CONTRACT_ADDRESS2 } from "@/lib/contracts2";

export const useIsDoctor = (address: `0x${string}` | undefined) => {
  return useReadContract({
    address: CONTRACT_ADDRESS2,
    abi: CONTRACT_ABI2,
    functionName: "isDoctor",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!address,
    },
  });
};
