import type { ParsedEmailHeader, HeaderFlag } from './types';

function extractField(raw: string, fieldName: string): string {
  const regex = new RegExp(`^${fieldName}:\\s*(.+?)(?=\\n\\S|$)`, 'ims');
  const match = raw.match(regex);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

function extractAllReceived(raw: string): string[] {
  const results: string[] = [];
  const regex = /^Received:\s*([\s\S]+?)(?=^\S|\n\n|$)/gim;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    results.push(match[1].replace(/\s+/g, ' ').trim());
  }
  return results;
}

function extractDomain(address: string): string {
  const match = address.match(/@([\w.-]+)/);
  return match ? match[1].toLowerCase() : '';
}

export function parseEmailHeaders(raw: string): ParsedEmailHeader {
  const from = extractField(raw, 'From');
  const replyTo = extractField(raw, 'Reply-To');
  const returnPath = extractField(raw, 'Return-Path');
  const messageId = extractField(raw, 'Message-ID');
  const originatingIp = extractField(raw, 'X-Originating-IP');
  const receivedChain = extractAllReceived(raw);

  const flags: HeaderFlag[] = [];

  // Check From vs Reply-To domain mismatch
  if (from && replyTo) {
    const fromDomain = extractDomain(from);
    const replyToDomain = extractDomain(replyTo);
    if (fromDomain && replyToDomain && fromDomain !== replyToDomain) {
      flags.push({
        field: 'Reply-To',
        message: `Reply-To domain (${replyToDomain}) does not match From domain (${fromDomain}). This is a common phishing indicator — replies will go to a different server than the apparent sender.`,
        severity: 'danger',
      });
    }
  }

  // Check From vs Return-Path domain mismatch
  if (from && returnPath) {
    const fromDomain = extractDomain(from);
    const returnDomain = extractDomain(returnPath);
    if (fromDomain && returnDomain && fromDomain !== returnDomain) {
      flags.push({
        field: 'Return-Path',
        message: `Return-Path domain (${returnDomain}) does not match From domain (${fromDomain}). Bounced emails will go to a different address than the apparent sender.`,
        severity: 'warning',
      });
    }
  }

  // Check for unusual number of relay hops
  if (receivedChain.length > 5) {
    flags.push({
      field: 'Received',
      message: `Unusually high number of relay hops (${receivedChain.length}). Legitimate emails rarely pass through more than 3–4 servers. This may indicate obfuscation or spam routing.`,
      severity: 'warning',
    });
  }

  // Check for missing Message-ID
  if (!messageId) {
    flags.push({
      field: 'Message-ID',
      message: 'Message-ID header is missing. Most legitimate mail servers add this automatically. Its absence may indicate a manually crafted or spoofed email.',
      severity: 'warning',
    });
  }

  // Check for suspicious originating IP patterns (private/reserved ranges in a public email)
  if (originatingIp) {
    const privateIp = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(originatingIp);
    if (privateIp) {
      flags.push({
        field: 'X-Originating-IP',
        message: `Originating IP (${originatingIp}) is a private/internal address. This is unusual for emails received from the internet and may indicate a spoofed or internal-origin header.`,
        severity: 'warning',
      });
    }
  }

  return { from, replyTo, returnPath, messageId, originatingIp, receivedChain, flags };
}
