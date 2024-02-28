import Image from "next/image";
import Link from "next/link";

type Props = {
  rotation: number | null;
};

const HeaderLogo = ({ rotation }: Props) => (
  <Link
    href="/"
    className="group flex items-center gap-2 duration-150 hover:text-sky-500 active:scale-90 active:opacity-75"
  >
    <Image
      src="/images/icon.svg"
      width="24"
      height="24"
      alt="UpTab Logo"
      className="duration-150 group-hover:brightness-110"
      priority
      style={{ transform: `rotateZ(${(rotation ?? 0) / 3}deg)` }}
    />
    <span className="font-medium">UpTab</span>
  </Link>
);

export default HeaderLogo;
