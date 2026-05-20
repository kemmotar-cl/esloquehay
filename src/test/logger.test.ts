import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../services/logger';

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(vi.fn());
    vi.spyOn(console, 'info').mockImplementation(vi.fn());
    vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs debug', () => {
    logger.debug('test', 'message');
    expect(console.debug).toHaveBeenCalled();
  });

  it('logs info', () => {
    logger.info('test', 'info message');
    expect(console.info).toHaveBeenCalled();
  });

  it('logs warn', () => {
    logger.warn('test', 'warn message');
    expect(console.warn).toHaveBeenCalled();
  });

  it('logs error', () => {
    logger.error('test', 'error message');
    expect(console.error).toHaveBeenCalled();
  });
});
