/** µToken SVG art store for uNORMAN cards on Robinhood Chain */
export const UNRMN_ART = {
  /** On-chain SVG renderer used by utoken.gg collection wall */
  address: '0x0613b0db76251a53d9b99dd2e656c721dcee8814' as const,
  /**
   * Function selector that returns the full card SVG string for a token id.
   * Confirmed via utoken.gg multicalls: eth_call(data=0xeb3fbd83 + tokenId) -> string SVG.
   * Name not published in their minified client; treat as tokenSvg(uint256)-class.
   */
  tokenSvgSelector: '0xeb3fbd83' as const,
  canvas: 49,
} as const
