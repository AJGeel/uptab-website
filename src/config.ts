import { FaqItemProps } from "./components/Faq/Faq";
import { SlideProps } from "./components/Slide";

export const slideConfig: SlideProps[] = [
  {
    title: "Revitalize",
    text: "UpTab transforms your new tabs into a sleek blend of beauty and functionality. Daily changing backgrounds, modern design, and subtle animations create a breath of fresh air.",
    imageUrl: "/images/slide-revitalize.jpg",
  },
  {
    title: "Organize",
    text: "Check local weather, organize bookmarks, and store links seamlessly. Intuitive design for an efficient browsing experience.",
    imageUrl: "/images/slide-organize.jpg",
  },
  {
    title: "Upgrade",
    text: "Regular updates, new features, and your feedback shape the future. Join us on the journey where innovation meets simplicity.",
    imageUrl: "/images/slide-advance.jpg",
  },
];

export const faqConfig: FaqItemProps[] = [
  {
    question: "Is UpTab compatible with my bookmarks?",
    answer:
      "Yes, UpTab uses the existing bookmarks in your browser. No syncs needed.",
  },
  {
    question: "Does UpTab store any personal information or browsing history?",
    answer:
      "Nope. UpTab prioritizes user privacy. It does not store any personal information or track your browsing history. Any data is locally stored on your device.",
  },
  {
    question: "Is UpTab free to use?",
    answer:
      "Yup, UpTab is completely free to use. I also don't sell your data.",
  },
  {
    question: "Wen new features??!",
    answer:
      "We aim to enhance your browsing experience by adding new features and fixing bugs. Updates are rolled out periodically, so watch those notifications.",
  },
  {
    question: "What do I do if I encounter issues or bugs with UpTab?",
    answer:
      "If you come across any issues or bugs, please report them to me. You can create an issue on the GitHub repository, and I'll try to fix it 🤓",
  },
];

export const externalUrls = {
  chrome:
    "https://chromewebstore.google.com/detail/uptab/dapdeiobfagcbhcpeijbhhlggopmjnlf",
  firefox: "https://addons.mozilla.org/en-US/firefox/addon/uptab/",
  github: "https://github.com/ajgeel/uptab",
};
