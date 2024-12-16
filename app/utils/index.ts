import { MetaMask } from '@web3-react/metamask';
import type { Connector } from '@web3-react/types';

export function sum(a: number, b: number) {
  if (a == 1) {
    return 1;
  } else {
    return a + b;
  }
}

/**
 * Custom error class for address formatting errors
 */
export class AddressFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AddressFormatError';
  }
}

/**
 * Validates if a string is a valid Ethereum address
 *
 * @param address - The address to validate
 * @throws {AddressFormatError} If the address is invalid
 */
function validateAddress(address: string): void {
  if (typeof address !== 'string') {
    throw new AddressFormatError('Address must be a string');
  }

  if (!address.startsWith('0x')) {
    throw new AddressFormatError('Address must start with 0x');
  }

  if (address.length !== 42) {
    throw new AddressFormatError('Address must be 42 characters long');
  }

  // 验证地址是否只包含有效的十六进制字符
  const validHex = /^0x[0-9a-fA-F]{40}$/;
  if (!validHex.test(address)) {
    throw new AddressFormatError('Address contains invalid characters');
  }
}

/**
 * Formats a given Ethereum address to a shorter version.
 *
 * @param address - The full Ethereum address
 * @param chars - The number of characters to show at the start and end. Default is 3
 * @returns The formatted address
 * @throws {AddressFormatError} If the address is invalid or chars is invalid
 */
export function formatAddress(address: string, chars: number = 3): string {
  try {
    validateAddress(address);

    // 验证 chars 参数
    if (typeof chars !== 'number') {
      throw new AddressFormatError('Chars parameter must be a number');
    }

    if (chars < 0) {
      throw new AddressFormatError('Chars parameter cannot be negative');
    }

    if (chars === 0) {
      return '0x...';
    }

    // 计算可用于显示的最大字符数
    // 总长度(42) - '0x'(2) - '...'(3) = 37 个字符可用
    // 除以 2 是因为我们要在开头和结尾显示相同数量的字符
    const maxChars = Math.floor((address.length - 5) / 2);

    // 如果请求的字符数超过最大值，返回完整地址
    if (chars >= maxChars) {
      return address;
    }

    const start = address.substring(0, chars + 2); // +2 for "0x"
    const end = address.substring(address.length - chars);
    return `${start}...${end}`;
  } catch (error) {
    // 重新抛出自定义错误
    if (error instanceof AddressFormatError) {
      throw error;
    }
    // 处理其他未预期的错误
    throw new AddressFormatError('Unexpected error formatting address');
  }
}

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask';
  return 'Unknown';
}
