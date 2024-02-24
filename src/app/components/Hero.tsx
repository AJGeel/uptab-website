import Image from "next/image";

type StoreButtonProps = {
  label: string;
  url: string;
  iconUrl: string;
};

const StoreButton = ({ label, url, iconUrl }: StoreButtonProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 rounded-lg bg-white px-4 py-3 shadow-md outline outline-black/10 ring-sky-500 ring-offset-1 duration-150 hover:ring-2 focus:ring-2 active:scale-90 active:opacity-75"
  >
    <Image src={iconUrl} width="34" height="34" alt={label} />
    <div className="">
      <p className="text-sm font-medium text-slate-500">Get it for</p>
      <p className="font-bold text-slate-900">{label}</p>
    </div>
  </a>
);

const Hero = () => (
  <div className="mx-auto flex flex-col items-center pt-14">
    <Image
      src="/images/icon.svg"
      width="80"
      height="80"
      alt="UpTab Logo"
      className="drop-shadow-xl"
    />
    <h1 className="mt-6 text-balance text-center text-3xl font-bold leading-normal">
      <span className="text-sky-500">Super-charge your new tabs</span> with
      weather forecasts, bookmarks and Dutch landscapes.
    </h1>
    <div className="mt-12 flex items-center gap-6">
      <StoreButton
        label="Google Chrome"
        url="https://chromewebstore.google.com/detail/uptab/dapdeiobfagcbhcpeijbhhlggopmjnlf"
        iconUrl="/images/chrome-icon.svg"
      />
      <StoreButton
        label="Mozilla Firefox"
        url="https://addons.mozilla.org/en-US/firefox/addon/uptab/"
        iconUrl="/images/firefox-icon.svg"
      />
    </div>
  </div>
);

export default Hero;
