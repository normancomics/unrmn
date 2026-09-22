export const UTOKEN = {
  origin: 'https://utoken.gg',
  tokenId: 'cmtbx9mg50001jgng7ts9t15j',
  slug: 'unrmn',
  tokenPage: 'https://utoken.gg/token/unrmn',
  collectionPage: 'https://utoken.gg/collection/unrmn',
  scannerPage: 'https://utoken.gg/scanner',
}

export const utokenApiCandidates = [
  `/utoken-api/api/tokens/${UTOKEN.tokenId}`,
  `${UTOKEN.origin}/api/tokens/${UTOKEN.tokenId}`,
]

export const utokenStreamCandidates = [
  `/utoken-api/api/tokens/${UTOKEN.tokenId}/stream`,
  `${UTOKEN.origin}/api/tokens/${UTOKEN.tokenId}/stream`,
]
