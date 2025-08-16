export const openLink = (url: string, target = '_blank') => {
  if (!url) return

  // Validate URL format
  try {
    new URL(url)
  } catch (_e) {
    console.error('Invalid URL:', url)
    return
  }

  // Open link in specified target
  if (target === '_self') {
    window.location.href = url
  } else if (target === '_blank') {
    // Open in new tab with security features
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    // For other targets, use default behavior
    window.open(url, target)
  }
}
