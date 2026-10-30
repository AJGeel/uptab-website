import { headers } from "next/headers";

const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]"];

/**
 * The photo manager changes files on disk, so it only answers requests to
 * this machine. `next dev` also listens on the local network, and requests
 * sent to the network address are refused. This keeps other devices on the
 * network out, but isn't a security boundary: the Host header can be forged.
 */
export const isLocalRequest = async () => {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  const host = (await headers()).get("host") ?? "";

  return (
    URL.canParse(`http://${host}`) &&
    LOCAL_HOSTNAMES.includes(new URL(`http://${host}`).hostname)
  );
};
