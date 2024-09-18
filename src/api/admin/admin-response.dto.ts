/**
 * Admin Response
 * @description Response for administrative endpoints
 */
export class AdminResponse {
  /**
   * Status of the operation, could be success or error
   * @example 'success'
   */
  status: 'success' | 'error';
  /**
   * Message describing the result of the operation
   * @example 'Database regenerated successfully'
   */
  message: string;
}
