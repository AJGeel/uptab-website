/** A link that stays on this site and opens in this tab, so following it would leave the page. */
export const leavingLink = (event: MouseEvent) => {
  const link = (event.target as Element | null)?.closest("a[href]");

  if (
    !(link instanceof HTMLAnchorElement) ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (link.target && link.target !== "_self") ||
    link.hasAttribute("download") ||
    link.origin !== window.location.origin ||
    (link.pathname === window.location.pathname && link.search === window.location.search)
  ) {
    return null;
  }

  return link.href;
};
